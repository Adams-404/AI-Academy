import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { EditorState, convertFromRaw, Editor } from 'draft-js'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import { FaHeart, FaRegHeart, FaTrash, FaArrowLeft } from 'react-icons/fa'
import Icon from '@mdi/react'
import { mdiPencil } from '@mdi/js'
import 'draft-js/dist/Draft.css'
import './ArticleView.css'

const ArticleView = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [article, setArticle] = useState(null)
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [editorState, setEditorState] = useState(null)

  useEffect(() => {
    fetchArticle()
  }, [slug])

  useEffect(() => {
    if (user && article?.id) {
      checkIfLiked()
    }
  }, [user, article])

  const fetchArticle = async () => {
    try {
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select(`
          *,
          likes:article_likes(count)
        `)
        .eq('slug', slug)
        .single()

      if (articleError) throw articleError

      if (articleData) {
        setArticle(articleData)
        setLikeCount(articleData.likes?.[0]?.count || 0)
        
        // Then fetch the author's profile
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', articleData.author_id)
          .single()

        if (authorError) throw authorError
        setAuthor(authorData)

        // Convert the stored content to EditorState
        try {
          const parsedContent = JSON.parse(articleData.content)
          // Remove the title block from the content if it exists
          if (parsedContent.blocks && parsedContent.blocks.length > 0) {
            // Remove the first block if it matches the title
            if (parsedContent.blocks[0].text.trim() === articleData.title.trim()) {
              parsedContent.blocks = parsedContent.blocks.slice(1)
            }
          }
          const contentState = convertFromRaw(parsedContent)
          setEditorState(EditorState.createWithContent(contentState))
        } catch (e) {
          console.error('Error parsing article content:', e)
          setError('Error loading article content')
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError('Error loading article')
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async () => {
    if (!article?.id || !user?.id) return

    try {
      const { data, error } = await supabase
        .from('article_likes')
        .select('*')
        .eq('article_id', article.id)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setIsLiked(!!data)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (!user) return

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', article.id)
          .eq('user_id', user.id)

        if (error) throw error
        setLikeCount(prev => prev - 1)
        setIsLiked(false)
      } else {
        // Like
        const { error } = await supabase
          .from('article_likes')
          .insert([
            {
              article_id: article.id,
              user_id: user.id
            }
          ])

        if (error) throw error
        setLikeCount(prev => prev + 1)
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Error updating like:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id)

      if (error) throw error

      navigate('/blog')
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('Failed to delete article')
    }
  }

  if (loading) {
    return <div className="article-view-container">Loading...</div>
  }

  if (error || !article) {
    return <div className="article-view-container">Error: {error || 'Article not found'}</div>
  }

  return (
    <div className="article-view-container">
      <div className="article-view-content">
        <div className="article-header">
          <Link to="/blog" className="back-button">
            <FaArrowLeft /> Back to Blog
          </Link>

          {user && user.id === article?.author_id && (
            <div className="article-actions">
              <Link 
                to={`/blog/edit/${article.id}`}
                className="edit-button"
                title="Edit article"
              >
                <span className="material-symbols-rounded">edit_note</span>
              </Link>
              <button
                onClick={handleDelete}
                className="delete-button"
                title="Delete article"
              >
                <FaTrash size={18} />
              </button>
            </div>
          )}
        </div>

        {article.cover_image && (
          <img 
            src={article.cover_image}
            alt={article.title}
            className="article-cover-image"
          />
        )}

        <h1>{article.title}</h1>

        <div className="article-meta">
          <div className="author-info">
            {author?.avatar_url ? (
              <img 
                src={author.avatar_url} 
                alt={author.full_name}
                className="author-avatar"
              />
            ) : (
              <div className="author-initials">
                {author?.full_name?.[0]}
              </div>
            )}
            <div className="author-details">
              <span className="author-name">{author?.full_name}</span>
              <span className="publish-date">
                Published on {new Date(article.published_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!user}
            title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
          >
            <span className="material-symbols-rounded">
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="article-description">
          {article.excerpt}
        </div>

        <div className="article-body">
          {editorState && (
            <Editor
              editorState={editorState}
              readOnly={true}
              onChange={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticleView 