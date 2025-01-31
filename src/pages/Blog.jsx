import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import { 
  FaPlus,
  FaUser,
  FaClock,
  FaEdit,
  FaTrash 
} from 'react-icons/fa'
import '../utils/draftjs-polyfill'
import { convertFromRaw } from 'draft-js'
import './Blog.css'

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1677442136019-21780ecad995' // Add a default AI-related image URL

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return

    try {
      setLoading(true)
      
      // First, get the article to get its thumbnail URL and content
      const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (fetchError) throw fetchError

      // Check if user is the author
      const { data: { user } } = await supabase.auth.getUser()
      if (user.id !== article.author_id) {
        throw new Error('You are not authorized to delete this article')
      }

      // Delete the article from the database
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .match({ id: articleId, author_id: user.id })

      if (deleteError) throw deleteError

      // If there was a thumbnail, delete it from storage
      if (article?.thumbnail_url) {
        const thumbnailPath = article.thumbnail_url.split('/').pop() // Get filename from URL
        const { error: storageError } = await supabase.storage
          .from('articles')
          .remove([`thumbnails/${thumbnailPath}`])
        
        if (storageError) {
          console.error('Error deleting thumbnail:', storageError)
        }
      }

      // Delete any images from the article content
      if (article?.content) {
        const contentState = convertFromRaw(article.content)
        const blocks = contentState.getBlocksAsArray()
        const imageBlocks = blocks.filter(block => block.getType() === 'atomic')
        
        for (const block of imageBlocks) {
          const entityKey = block.getEntityAt(0)
          if (entityKey) {
            const entity = contentState.getEntity(entityKey)
            if (entity.getType() === 'IMAGE') {
              const { src } = entity.getData()
              const imagePath = src.split('/').pop() // Get filename from URL
              const { error: storageError } = await supabase.storage
                .from('articles')
                .remove([`article-images/${imagePath}`])
              
              if (storageError) {
                console.error('Error deleting article image:', storageError)
              }
            }
          }
        }
      }

      // Fetch fresh data instead of just updating local state
      await fetchPosts()
      
      alert('Article deleted successfully!')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderArticleCard = (article) => {
    const isAuthor = currentUser?.id === article.author_id

    return (
      <div key={article.id} className="article-card">
        <div className="article-image" onClick={() => navigate(`/blog/${article.id}`)}>
          {article.thumbnail_url ? (
            <img 
              src={article.thumbnail_url} 
              alt={article.title}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = DEFAULT_THUMBNAIL
              }}
            />
          ) : (
            <div className="placeholder-image">
              <FaPlus size={20} />
            </div>
          )}
        </div>
        <div className="article-content">
          <h2 onClick={() => navigate(`/blog/${article.id}`)}>{article.title}</h2>
          <p>{article.description}</p>
          <div className="article-tags">
            {article.tags?.map((tag, index) => (
              <span key={index} className="tag">
                {tag.startsWith('@') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
          <div className="article-meta">
            <span className="author">
              <FaUser size={14} />
              {article.author_name}
            </span>
            <span className="date">
              <FaClock size={14} />
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="article-actions">
            <button 
              className="read-more"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              Read More
            </button>
            {isAuthor && (
              <div className="author-actions">
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/blog/edit/${article.id}`)
                  }}
                  title="Edit article"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(article.id)
                  }}
                  title="Delete article"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>AI Academy Blog</h1>
        <p>
          Stay updated with the latest in AI technology, tutorials, and insights from our
          community. Explore in-depth articles, guides, and news about artificial intelligence.
        </p>
        <button 
          className="write-article-button"
          onClick={() => navigate('/blog/write')}
        >
          <FaPlus />
          Write Article
        </button>
      </div>

      <div className="articles-grid">
        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="no-articles">
            <p>No articles yet. Be the first to write one!</p>
          </div>
        ) : (
          posts.map(renderArticleCard)
        )}
      </div>
    </div>
  )
}

export default Blog 