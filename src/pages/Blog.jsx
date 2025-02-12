import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPen, FaHeart, FaRegHeart, FaEdit, FaTrash } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import './Blog.css'

const Blog = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      // First get the articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          article_likes (count)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (articlesError) throw articlesError

      // Then get the profiles for the authors
      if (articles && articles.length > 0) {
        const authorIds = [...new Set(articles.map(article => article.author_id))]
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', authorIds)

        if (profilesError) throw profilesError

        // Combine the data
        const articlesWithAuthors = articles.map(article => ({
          ...article,
          profiles: profiles.find(profile => profile.id === article.author_id)
        }))

        // Check which articles are liked by the current user
        if (user) {
          const { data: likedArticles } = await supabase
            .from('article_likes')
            .select('article_id')
            .eq('user_id', user.id)

          const likedArticleIds = new Set(likedArticles?.map(like => like.article_id))
          articlesWithAuthors.forEach(article => {
            article.isLiked = likedArticleIds.has(article.id)
          })
        }

        setArticles(articlesWithAuthors)
      } else {
        setArticles([])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (articleId, isLiked) => {
    if (!user) return

    try {
      if (isLiked) {
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('article_likes')
          .insert([{ article_id: articleId, user_id: user.id }])
      }

      // Update the articles state
      setArticles(articles.map(article => {
        if (article.id === articleId) {
          const likesCount = article.article_likes[0]?.count || 0
          return {
            ...article,
            isLiked: !isLiked,
            article_likes: [{ count: isLiked ? likesCount - 1 : likesCount + 1 }]
          }
        }
        return article
      }))
    } catch (error) {
      console.error('Error handling like:', error)
    }
  }

  const handleDelete = async (articleId) => {
    if (!user) return

    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)
        .eq('author_id', user.id)

      // Update the articles state
      setArticles(articles.filter(article => article.id !== articleId))
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  if (loading) {
    return <div className="blog-container">Loading articles...</div>
  }

  if (error) {
    return <div className="blog-container">Error: {error}</div>
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog</h1>
        <Link to="/write" className="write-button">
          <FaPen /> Write Article
        </Link>
      </div>

      <div className="articles-grid">
        {articles.map(article => (
          <article key={article.id} className="article-card">
            {article.cover_image && (
              <img 
                src={article.cover_image} 
                alt={article.title}
                className="article-cover"
              />
            )}
            <div className="article-content">
              <h2>
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="article-excerpt">{article.excerpt}</p>
              
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="article-meta">
                <div className="article-author">
                  {article.profiles?.avatar_url ? (
                    <img 
                      src={article.profiles.avatar_url}
                      alt={article.profiles.full_name}
                      className="author-avatar"
                    />
                  ) : (
                    <div className="author-initials">
                      {article.profiles?.full_name?.[0]}
                    </div>
                  )}
                  <div className="author-info">
                    <span className="author-name">{article.profiles?.full_name}</span>
                    <span className="publish-date">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="article-stats">
                  <button 
                    className={`like-button ${article.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(article.id, article.isLiked)}
                    disabled={!user}
                    title={user ? (article.isLiked ? 'Unlike' : 'Like') : 'Login to like'}
                  >
                    {article.isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span className="like-count">
                      {article.article_likes[0]?.count || 0}
                    </span>
                  </button>
                  
                  {user && user.id === article.author_id && (
                    <div className="article-actions">
                      <Link 
                        to={`/blog/edit/${article.id}`}
                        className="edit-button"
                        title="Edit article"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="delete-button"
                        title="Delete article"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog 