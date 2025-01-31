import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { 
  FaArrowLeft, 
  FaUser, 
  FaClock, 
  FaHeart, 
  FaComment 
} from 'react-icons/fa'
import '../utils/draftjs-polyfill'
import { convertFromRaw } from 'draft-js'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './ArticleView.css'

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1677442136019-21780ecad995'

const ArticleView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [editorState, setEditorState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        setArticle(data)
        // Convert the raw content back to EditorState
        const contentState = convertFromRaw(data.content)
        setEditorState(EditorState.createWithContent(contentState))
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      alert('Error loading article')
    } finally {
      setLoading(false)
    }
  }

  const blockRendererFn = (block) => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent()
      const entity = contentState.getEntity(block.getEntityAt(0))
      if (entity.getType() === 'IMAGE') {
        return {
          component: ArticleImage,
          editable: false,
        }
      }
    }
    return null
  }

  // Image component for the article view
  const ArticleImage = (props) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    const { src } = entity.getData()
    return (
      <div className="article-image-container">
        <img src={src} alt="" className="article-content-image" />
      </div>
    )
  }

  if (loading) {
    return <div className="article-loading">Loading article...</div>
  }

  if (!article) {
    return <div className="article-error">Article not found</div>
  }

  return (
    <div className="article-view">
      <header className="article-header">
        <button 
          className="back-button"
          onClick={() => navigate('/blog')}
        >
          <FaArrowLeft /> Back to Blog
        </button>
      </header>

      <div className="article-content">
        {article.thumbnail_url && (
          <div className="article-hero">
            <img src={article.thumbnail_url} alt={article.title} />
          </div>
        )}

        <div className="article-main">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <div className="meta-item">
              <FaUser />
              <span>{article.author_name}</span>
            </div>
            <div className="meta-item">
              <FaClock />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="article-tags">
            {article.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>

          <p className="article-description">{article.description}</p>

          <div className="article-body">
            {editorState && (
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                readOnly={true}
                blockRendererFn={blockRendererFn}
              />
            )}
          </div>

          <div className="article-stats">
            <div className="stat-item">
              <FaHeart />
              <span>{article.likes_count || 0}</span>
            </div>
            <div className="stat-item">
              <FaComment />
              <span>{article.comments_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleView 