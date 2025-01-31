import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { 
  FaImage, 
  FaTimes, 
  FaEdit,
  FaArrowLeft,
  FaPaperPlane,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaHeading,
  FaCheck
} from 'react-icons/fa'
import '../utils/draftjs-polyfill'
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw,
  convertFromRaw,
  ContentState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  AtomicBlockUtils
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import './WriteArticle.css'

const { hasCommandModifier } = KeyBindingUtil
const AUTOSAVE_KEY = 'draft-article-autosave'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const WriteArticle = ({ isEditing }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [article, setArticle] = useState(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved && !isEditing) {
      const parsed = JSON.parse(saved)
      return {
        title: parsed.title || '',
        description: parsed.description || '',
        tags: parsed.tags || [],
        thumbnail: null,
        thumbnailPreview: parsed.thumbnailPreview || null
      }
    }
    return {
      title: '',
      description: '',
      tags: [],
      thumbnail: null,
      thumbnailPreview: null
    }
  })

  const [editorState, setEditorState] = useState(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved && !isEditing) {
      const parsed = JSON.parse(saved)
      if (parsed.content) {
        return EditorState.createWithContent(convertFromRaw(parsed.content))
      }
    }
    return EditorState.createEmpty()
  })

  const [currentTag, setCurrentTag] = useState('')
  const [lastSaved, setLastSaved] = useState(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [isCropping, setIsCropping] = useState(false)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Fetch article data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchArticle = async () => {
        try {
          const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single()

          if (error) throw error

          // Check if user is the author
          const { data: { user } } = await supabase.auth.getUser()
          if (user.id !== article.author_id) {
            alert('You are not authorized to edit this article')
            navigate('/blog')
            return
          }

          setArticle({
            title: article.title,
            description: article.description,
            tags: article.tags || [],
            thumbnail: null,
            thumbnailPreview: article.thumbnail_url
          })

          if (article.content) {
            setEditorState(EditorState.createWithContent(convertFromRaw(article.content)))
          }
        } catch (error) {
          console.error('Error fetching article:', error)
          navigate('/blog')
        }
      }

      fetchArticle()
    }
  }, [isEditing, id, navigate])

  // Auto-save effect
  useEffect(() => {
    const saveContent = () => {
      const contentState = editorState.getCurrentContent()
      const rawContent = convertToRaw(contentState)
      
      const dataToSave = {
        title: article.title,
        description: article.description,
        tags: article.tags,
        thumbnailPreview: article.thumbnailPreview,
        content: rawContent,
        lastSaved: new Date().toISOString()
      }
      
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(dataToSave))
      setLastSaved(new Date().toISOString())
    }

    // Save every 2 seconds after changes
    const timeoutId = setTimeout(saveContent, 2000)
    return () => clearTimeout(timeoutId)
  }, [article, editorState])

  // Clear autosave when navigating away after successful submission
  const clearAutosave = () => {
    localStorage.removeItem(AUTOSAVE_KEY)
  }

  useEffect(() => {
    // Add warning before user leaves page with unsaved changes
    const handleBeforeUnload = (e) => {
      const contentState = editorState.getCurrentContent()
      if (contentState.hasText()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [editorState])

  useEffect(() => {
    // Focus the editor when the component mounts
    setTimeout(() => {
      document.querySelector('.DraftEditor-root')?.focus()
    }, 100)
  }, [])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.onload = () => {
          const crop = centerAspectCrop(image.width, image.height, 16 / 9)
          setArticle({
            ...article,
            thumbnail: file,
            thumbnailPreview: reader.result
          })
          setCrop(crop)
          setIsCropping(true)
        }
        image.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const crop = centerAspectCrop(width, height, 16 / 9)
    setCrop(crop)
  }

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
    const croppedFile = new File([blob], 'cropped-thumbnail.jpg', { type: 'image/jpeg' })

    setArticle(prev => ({
      ...prev,
      thumbnail: croppedFile,
      thumbnailPreview: URL.createObjectURL(blob)
    }))
    setIsCropping(false)
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!article.tags.includes(currentTag.trim())) {
        setArticle({
          ...article,
          tags: [...article.tags, currentTag.trim()]
        })
      }
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setArticle({
      ...article,
      tags: article.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let thumbnail_url = article.thumbnailPreview

      // Upload new thumbnail if exists
      if (article.thumbnail) {
        const fileExt = article.thumbnail.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `thumbnails/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(filePath, article.thumbnail, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg'
          })

        if (uploadError) throw uploadError

        // Get public URL - Update this part
        const { data } = supabase.storage
          .from('articles')
          .getPublicUrl(filePath)

        thumbnail_url = data.publicUrl
      }

      // Convert editor content to raw JSON
      const contentState = editorState.getCurrentContent()
      const rawContent = convertToRaw(contentState)
      
      // Get user info
      const { data: { user } } = await supabase.auth.getUser()

      if (isEditing) {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: article.title,
            description: article.description,
            content: rawContent,
            thumbnail_url,
            tags: article.tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (updateError) throw updateError
      } else {
        // Create new article
        const { error: insertError } = await supabase
          .from('articles')
          .insert([
            {
              title: article.title,
              description: article.description,
              content: rawContent,
              thumbnail_url,
              tags: article.tags,
              author_id: user.id,
              author_name: user.user_metadata?.full_name || user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (insertError) throw insertError
      }
      
      // Clear autosave
      localStorage.removeItem(AUTOSAVE_KEY)
      
      // Navigate to the blog page
      navigate('/blog')
    } catch (error) {
      console.error('Error saving article:', error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Memoize the editor change handler
  const handleEditorChange = useCallback((newState) => {
    setEditorState(newState)
  }, [])

  // Add mobile-specific key commands
  const keyBindingFn = (e) => {
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
      if (e.keyCode === 13 /* Enter */ && hasCommandModifier(e)) {
        return 'submit'
      }
    }
    
    if (e.keyCode === 49 /* 1 */ && hasCommandModifier(e)) {
      return 'header-one'
    }
    if (e.keyCode === 66 /* B */ && hasCommandModifier(e)) {
      return 'bold'
    }
    if (e.keyCode === 73 /* I */ && hasCommandModifier(e)) {
      return 'italic'
    }
    if (e.keyCode === 85 /* U */ && hasCommandModifier(e)) {
      return 'underline'
    }
    if (e.keyCode === 55 /* 7 */ && hasCommandModifier(e)) {
      return 'ordered-list-item'
    }
    if (e.keyCode === 56 /* 8 */ && hasCommandModifier(e)) {
      return 'unordered-list-item'
    }
    if (e.keyCode === 81 /* Q */ && hasCommandModifier(e)) {
      return 'blockquote'
    }
    return getDefaultKeyBinding(e)
  }

  const handleKeyCommand = (command, editorState) => {
    if (command === 'submit') {
      handleSubmit(new Event('submit'))
      return 'handled'
    }
    
    let newState

    if (command === 'bold') {
      newState = RichUtils.toggleInlineStyle(editorState, 'BOLD')
    } else if (command === 'italic') {
      newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC')
    } else if (command === 'underline') {
      newState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
    } else {
      newState = RichUtils.handleKeyCommand(editorState, command)
    }

    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType))
  }

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const isBlockTypeActive = (blockType) => {
    const selection = editorState.getSelection()
    const currentBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()
    return blockType === currentBlockType
  }

  const isInlineStyleActive = (inlineStyle) => {
    const currentStyle = editorState.getCurrentInlineStyle()
    return currentStyle.has(inlineStyle)
  }

  const handleEditorImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Upload image to Supabase storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `article-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data } = supabase.storage
          .from('articles')
          .getPublicUrl(filePath)

        // Create new atomic block with image
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
          'IMAGE',
          'IMMUTABLE',
          { src: data.publicUrl }
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const newEditorState = EditorState.set(
          editorState,
          { currentContent: contentStateWithEntity }
        )
        setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image. Please try again.')
      }
    }
  }

  // Add custom block renderer
  const blockRendererFn = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: EditorImage,
        editable: false,
      }
    }
    return null
  }

  // Image component for the editor
  const EditorImage = (props) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    const { src } = entity.getData()
    return (
      <div className="editor-image-upload">
        <img src={src} alt="" />
        <div className="editor-image-controls">
          <button
            type="button"
            onClick={() => {
              const newContentState = props.contentState.mergeEntityData(
                props.block.getEntityAt(0),
                { alignment: 'left' }
              )
              props.blockProps.setEditorState(
                EditorState.push(editorState, newContentState, 'change-block-data')
              )
            }}
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="write-article-page">
      <form onSubmit={handleSubmit} className="article-form">
        <header className="form-header">
          <div className="header-left">
            <h1>
              <FaEdit size={20} />
              {isEditing ? 'Edit Article' : 'Write Article'}
            </h1>
            {lastSaved && !isEditing && (
              <span className="autosave-status">
                Last saved: {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="button button-secondary" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? All progress will be saved locally.')) {
                  navigate('/blog')
                }
              }}
            >
              <FaArrowLeft size={14} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="button button-primary">
              <FaPaperPlane size={14} />
              <span>Publish</span>
            </button>
          </div>
        </header>

        <div className="form-content">
          <div className="form-main">
            <div className="article-guidelines">
              <h3>📝 Article Guidelines</h3>
              <ul>
                <li>Your article should focus on Artificial Intelligence related topics</li>
                <li>This can include: AI technologies, machine learning, deep learning, neural networks, AI applications, or AI ethics</li>
                <li>Share your insights, experiences, or analysis of current AI trends</li>
                <li>Make sure to include relevant examples and references</li>
              </ul>
            </div>

            <div className="thumbnail-upload">
              {isCropping ? (
                <div className="crop-container">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={16 / 9}
                  >
                    <img
                      ref={imgRef}
                      src={article.thumbnailPreview}
                      onLoad={onImageLoad}
                      style={{ maxWidth: '100%' }}
                      alt="Crop preview"
                    />
                  </ReactCrop>
                  <canvas
                    ref={previewCanvasRef}
                    style={{ display: 'none' }}
                  />
                  <div className="crop-actions">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleCropComplete}
                    >
                      <FaCheck size={14} />
                      <span>Apply Crop</span>
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => {
                        setIsCropping(false)
                        setArticle(prev => ({
                          ...prev,
                          thumbnail: null,
                          thumbnailPreview: null
                        }))
                      }}
                    >
                      <FaTimes size={14} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : article.thumbnailPreview ? (
                <div className="thumbnail-preview">
                  <img src={article.thumbnailPreview} alt="Article thumbnail" />
                  <button 
                    type="button" 
                    className="remove-thumbnail"
                    onClick={() => setArticle({
                      ...article,
                      thumbnail: null,
                      thumbnailPreview: null
                    })}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label className="thumbnail-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    hidden
                  />
                  <FaImage size={24} />
                  <span>Add Cover Image</span>
                </label>
              )}
            </div>

            <input
              type="text"
              placeholder="Article Title"
              className="title-input"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Short description (will appear in the article preview)"
              className="description-input"
              value={article.description}
              onChange={(e) => setArticle({ ...article, description: e.target.value })}
              required
            />

            <div className="editor-container">
              <div className="formatting-toolbar">
                <button
                  type="button"
                  className={`format-button ${isBlockTypeActive('header-one') ? 'active' : ''}`}
                  onClick={() => toggleBlockType('header-one')}
                  title="Heading (Ctrl+1)"
                >
                  <FaHeading size={16} />
                </button>
                <div className="format-divider" />
                <button
                  type="button"
                  className={`format-button ${isInlineStyleActive('BOLD') ? 'active' : ''}`}
                  onClick={() => toggleInlineStyle('BOLD')}
                  title="Bold (Ctrl+B)"
                >
                  <FaBold size={16} />
                </button>
                <button
                  type="button"
                  className={`format-button ${isInlineStyleActive('ITALIC') ? 'active' : ''}`}
                  onClick={() => toggleInlineStyle('ITALIC')}
                  title="Italic (Ctrl+I)"
                >
                  <FaItalic size={16} />
                </button>
                <button
                  type="button"
                  className={`format-button ${isInlineStyleActive('UNDERLINE') ? 'active' : ''}`}
                  onClick={() => toggleInlineStyle('UNDERLINE')}
                  title="Underline (Ctrl+U)"
                >
                  <FaUnderline size={16} />
                </button>
                <div className="format-divider" />
                <button
                  type="button"
                  className={`format-button ${isBlockTypeActive('unordered-list-item') ? 'active' : ''}`}
                  onClick={() => toggleBlockType('unordered-list-item')}
                  title="Bullet List (Ctrl+8)"
                >
                  <FaListUl size={16} />
                </button>
                <button
                  type="button"
                  className={`format-button ${isBlockTypeActive('ordered-list-item') ? 'active' : ''}`}
                  onClick={() => toggleBlockType('ordered-list-item')}
                  title="Numbered List (Ctrl+7)"
                >
                  <FaListOl size={16} />
                </button>
                <div className="format-divider" />
                <button
                  type="button"
                  className={`format-button ${isBlockTypeActive('blockquote') ? 'active' : ''}`}
                  onClick={() => toggleBlockType('blockquote')}
                  title="Quote (Ctrl+Q)"
                >
                  <FaQuoteRight size={16} />
                </button>
                <div className="format-divider" />
                <label className="format-button image-upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditorImageUpload}
                    hidden
                  />
                  <FaImage size={16} />
                </label>
              </div>
              <div className="editor-content">
                <Editor
                  editorState={editorState}
                  onChange={handleEditorChange}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={keyBindingFn}
                  blockRendererFn={blockRendererFn}
                  placeholder="Write your article content here..."
                  spellCheck={true}
                />
              </div>
            </div>
          </div>

          <div className="form-sidebar">
            <div className="tags-section">
              <h3>Tags</h3>
              <div className="tags-input">
                <div className="tags-list">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
              <p className="tags-hint">Press Enter to add a tag</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default WriteArticle 