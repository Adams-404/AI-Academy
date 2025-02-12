import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import { v4 as uuidv4 } from 'uuid'
import RichTextEditor from '../components/RichTextEditor'
import './WriteArticle.css'

const WriteArticle = ({ isEditing }) => {
  const { id } = useParams()
  const [title, setTitle] = useState(() => localStorage.getItem('draftTitle') || '')
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [content, setContent] = useState(() => localStorage.getItem('draftContent') || '')
  const [description, setDescription] = useState(() => localStorage.getItem('draftDescription') || '')
  const [coverImage, setCoverImage] = useState(null)
  const [coverImageUrl, setCoverImageUrl] = useState(() => localStorage.getItem('draftCoverImageUrl') || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('draftTags')
    return savedTags ? JSON.parse(savedTags) : []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchArticle = async () => {
      if (isEditing && id) {
        try {
          const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single()

          if (error) throw error

          if (article) {
            setTitle(article.title)
            setContent(article.content)
            setDescription(article.excerpt)
            setCoverImageUrl(article.cover_image)
            setTags(article.tags || [])
            
            try {
              const contentState = convertFromRaw(JSON.parse(article.content))
              setEditorState(EditorState.createWithContent(contentState))
            } catch (e) {
              console.error('Error parsing article content:', e)
              setError('Error loading article content')
            }
          }
        } catch (error) {
          console.error('Error fetching article:', error)
          setError('Error loading article')
        }
      }
    }

    fetchArticle()
  }, [isEditing, id])

  useEffect(() => {
    if (!isEditing) {
      localStorage.setItem('draftTitle', title)
      localStorage.setItem('draftContent', content)
      localStorage.setItem('draftDescription', description)
      localStorage.setItem('draftCoverImageUrl', coverImageUrl || '')
      localStorage.setItem('draftTags', JSON.stringify(tags))
    }
  }, [title, content, description, coverImageUrl, tags, isEditing])

  const handleSubmit = async (status) => {
    setLoading(true)
    setError('')

    try {
      let cover_image = coverImageUrl

      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop()
        const fileName = `article-covers/${uuidv4()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(fileName, coverImage)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('article-covers')
          .getPublicUrl(fileName)

        cover_image = publicUrl
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const article = {
        title,
        content,
        excerpt: description,
        cover_image,
        tags,
        status,
        author_id: user.id,
        slug,
        updated_at: new Date().toISOString()
      }

      if (status === 'published') {
        article.published_at = new Date().toISOString()
      }

      if (isEditing) {
        const { error } = await supabase
          .from('articles')
          .update(article)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([article])

        if (error) throw error
      }

      clearDraft()
      navigate('/blog')
    } catch (error) {
      console.error('Error saving article:', error)
      setError('Error saving article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    await handleSubmit('draft')
  }

  const handlePublish = async () => {
    await handleSubmit('published')
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      setCoverImageUrl(URL.createObjectURL(file))
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      e.preventDefault()
      const newTags = [...tags]
      newTags.pop()
      setTags(newTags)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      clearDraft()
      navigate('/blog')
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('draftTitle')
    localStorage.removeItem('draftContent')
    localStorage.removeItem('draftDescription')
    localStorage.removeItem('draftCoverImageUrl')
    localStorage.removeItem('draftTags')
  }

  const handleContentChange = (newContent) => {
    setContent(newContent)
  }

  useEffect(() => {
    return () => {
      // Optionally clear draft when navigating away
      // Uncomment if you want to clear draft when leaving the page
      // clearDraft()
    }
  }, [])

  return (
    <div className="write-article-page">
      <div className="write-article-container">
        <div className="page-header">
          <div className="header-title">
            <h1>{isEditing ? 'Edit Article' : 'Write Article'}</h1>
          </div>
          <div className="header-actions">
            <button 
              type="button"
              onClick={handleCancel}
              className="btn cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn draft-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="btn primary-btn"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Write a brief description of your article..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-input"
              maxLength={200}
              rows={3}
              required
            />
            <div className="description-counter">
              {description.length}/200 characters
            </div>
          </div>

          <div className="form-group">
            <div 
              className="cover-image-upload"
              onClick={() => document.getElementById('cover-image').click()}
            >
              {coverImageUrl ? (
                <img 
                  src={coverImageUrl} 
                  alt="Cover" 
                  className="cover-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <span className="material-symbols-rounded">add_photo_alternate</span>
                  <span>Choose Cover Image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="cover-image"
              accept="image/*"
              onChange={handleCoverImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <RichTextEditor
              onChange={handleContentChange}
              initialContent={content}
              placeholder="Write your article here..."
              editorState={editorState}
              setEditorState={setEditorState}
            />
          </div>

          <div className="form-group">
            <div className="tags-input-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags..."
                className="tag-input"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteArticle 