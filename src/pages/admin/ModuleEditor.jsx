import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromRaw,
  AtomicBlockUtils,
  ContentState
} from 'draft-js';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import QuizForm from '../../components/QuizForm';
import AssignmentForm from '../../components/AssignmentForm';
import {
  FaHeading,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaCode,
  FaImage,
  FaVideo,
  FaYoutube,
  FaQuestion,
  FaTasks,
  FaSave,
  FaEye,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa';
import 'draft-js/dist/Draft.css';
import './ModuleEditor.css';

const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Beginner Friendly', color: '#34a853' },
  INTERMEDIATE: { label: 'Intermediate', color: '#fbbc04' },
  ADVANCED: { label: 'Advanced', color: '#ea4335' }
};

const BLOCK_TYPES = [
  { label: 'Heading 1', style: 'header-one', icon: FaHeading },
  { label: 'Heading 2', style: 'header-two', icon: FaHeading },
  { label: 'Heading 3', style: 'header-three', icon: FaHeading },
  { label: 'Bullet List', style: 'unordered-list-item', icon: FaListUl },
  { label: 'Numbered List', style: 'ordered-list-item', icon: FaListOl },
  { label: 'Quote Block', style: 'blockquote', icon: FaQuoteRight },
  { label: 'Code Block', style: 'code-block', icon: FaCode },
];

const INLINE_STYLES = [
  { label: 'Bold Text', style: 'BOLD', icon: FaBold },
  { label: 'Italic Text', style: 'ITALIC', icon: FaItalic },
  { label: 'Underline Text', style: 'UNDERLINE', icon: FaUnderline },
];

const MEDIA_BUTTONS = [
  { label: 'Insert Image', action: 'image', icon: FaImage },
  { label: 'Insert Video', action: 'video', icon: FaVideo },
  { label: 'Insert YouTube Video', action: 'youtube', icon: FaYoutube },
];

const ModuleEditor = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewModule = moduleId === 'new';
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    weekNumber: 1,
    difficultyLevel: 'BEGINNER',
    status: 'draft'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Load existing module data
  useEffect(() => {
    console.log('ModuleEditor: Initial load', { moduleId, isNewModule });
    
    if (isNewModule) {
      console.log('ModuleEditor: New module, checking for draft');
      const savedDraft = localStorage.getItem('moduleEditorDraft');
      if (savedDraft) {
        try {
          const { moduleData: draftData, content: draftContent } = JSON.parse(savedDraft);
          setModuleData(draftData);
          
          if (draftContent) {
            const contentState = convertFromRaw(JSON.parse(draftContent));
            setEditorState(EditorState.createWithContent(contentState));
          }
          console.log('ModuleEditor: Draft loaded successfully');
        } catch (e) {
          console.error('Error parsing saved draft:', e);
          setError('Failed to load saved draft');
        }
      }
      setLoading(false);
    } else {
      fetchModuleData();
    }
  }, [moduleId]);

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (moduleData.title || editorState.getCurrentContent().hasText()) {
        const draft = {
          moduleData,
          content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          quizzes,
          assignments
        };
        localStorage.setItem('moduleEditorDraft', JSON.stringify(draft));
        setLastSaved(new Date());
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [moduleData, editorState, quizzes, assignments]);

  const fetchModuleData = async () => {
    try {
      console.log('ModuleEditor: Fetching module data');
      setLoading(true);
      const { data: module, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      console.log('ModuleEditor: Module data fetched', module);

      setModuleData({
        title: module.title,
        description: module.description,
        weekNumber: module.week_number,
        difficultyLevel: module.difficulty_level,
        status: module.status
      });

      if (module.content) {
        const contentState = convertFromRaw(JSON.parse(module.content));
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (error) {
      console.error('Error fetching module:', error);
      setError('Failed to load module data');
    } finally {
      console.log('ModuleEditor: Setting loading to false');
      setLoading(false);
    }
  };

  const handleActionWithConfirmation = (action) => {
    let message = '';
    switch (action) {
      case 'publish':
        message = 'Are you sure you want to publish this module? This will make it visible to all users.';
        break;
      case 'draft':
        message = 'Are you sure you want to save this as a draft? It will not be visible to users.';
        break;
      case 'drop':
        message = 'Are you sure you want to drop this draft? All unsaved changes will be lost.';
        break;
      default:
        return;
    }
    
    setConfirmationAction({ type: action, message });
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmationAction) return;

    try {
      setSaving(true);
      setError(null);

      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);

      const modulePayload = {
        title: moduleData.title,
        description: moduleData.description,
        week_number: moduleData.weekNumber,
        difficulty_level: moduleData.difficultyLevel,
        content: JSON.stringify(rawContent)
      };

      switch (confirmationAction.type) {
        case 'publish':
          modulePayload.status = 'published';
          break;
        case 'draft':
          modulePayload.status = 'draft';
          break;
        case 'drop':
          localStorage.removeItem('moduleEditorDraft');
          navigate('/admin/courses');
          return;
      }

      if (isNewModule) {
        const { error } = await supabase
          .from('course_modules')
          .insert([modulePayload]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('course_modules')
          .update(modulePayload)
          .eq('id', moduleId);

        if (error) throw error;
      }

      if (confirmationAction.type !== 'draft') {
        localStorage.removeItem('moduleEditorDraft');
        navigate('/admin/courses');
      } else {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving module:', error);
      setError('Failed to save module');
    } finally {
      setSaving(false);
      setShowConfirmation(false);
      setConfirmationAction(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    if (newState) {
      setEditorState(newState);
    }
  };

  const keyBindingFn = (e) => {
    if (e.keyCode === 73 /* i */ && (e.ctrlKey || e.metaKey)) {
      return 'italic';
    }
    if (e.keyCode === 66 /* b */ && (e.ctrlKey || e.metaKey)) {
      return 'bold';
    }
    if (e.keyCode === 85 /* u */ && (e.ctrlKey || e.metaKey)) {
      return 'underline';
    }
    if (e.keyCode === 13 /* enter */ && e.shiftKey) {
      return 'split-block';
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, editorState) => {
    let newState;

    switch (command) {
      case 'split-block':
        newState = RichUtils.insertSoftNewline(editorState);
        break;
      case 'bold':
        newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        break;
      case 'italic':
        newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        break;
      case 'underline':
        newState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
        break;
      default:
        newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const addMedia = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `course-materials/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('course-materials')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('course-materials')
            .getPublicUrl(filePath);

          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            type === 'image' ? 'IMAGE' : 'VIDEO',
            'IMMUTABLE',
            { src: publicUrl }
          );

          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity }
          );

          setEditorState(AtomicBlockUtils.insertAtomicBlock(
            newEditorState,
            entityKey,
            ' '
          ));
        } catch (error) {
          console.error('Error uploading file:', error);
          setError('Failed to upload file');
        }
      }
    };
    input.click();
  };

  const addYouTubeVideo = () => {
    const url = prompt('Enter YouTube video URL:');
    if (url) {
      // Extract video ID from URL
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'YOUTUBE',
          'IMMUTABLE',
          { src: embedUrl }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
          editorState,
          { currentContent: contentStateWithEntity }
        );

        setEditorState(AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          ' '
        ));
      }
    }
  };

  const handleAddQuiz = () => {
    setShowQuizForm(true);
  };

  const handleAddAssignment = () => {
    setShowAssignmentForm(true);
  };

  const mediaBlockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaBlock,
        editable: false,
        props: {
          editorState,
          setEditorState
        }
      };
    }
    return null;
  };

  const getCurrentBlockType = () => {
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return blockType;
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  const isBlockTypeActive = (blockType) => {
    return blockType === getCurrentBlockType();
  };

  const isInlineStyleActive = (inlineStyle) => {
    return currentStyle.has(inlineStyle);
  };

  if (loading) {
    console.log('ModuleEditor: Rendering loading state');
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading module editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error Loading Module</h2>
        <p>{error}</p>
        <button className="back-button" onClick={() => navigate('/admin/courses')}>
          <FaArrowLeft /> Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="module-editor">
      <header className="editor-header">
        <button className="back-button" onClick={() => navigate('/admin/courses')}>
          <FaArrowLeft /> Back to Courses
        </button>
        <div className="header-actions">
          {lastSaved && (
            <span className="last-saved">
              Last saved at {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <button 
            className="action-button draft"
            onClick={() => handleActionWithConfirmation('draft')}
            disabled={saving}
          >
            <FaSave /> Save as Draft
          </button>
          <button 
            className="action-button publish"
            onClick={() => handleActionWithConfirmation('publish')}
            disabled={saving}
          >
            <FaEye /> Publish
          </button>
          <button 
            className="action-button drop"
            onClick={() => handleActionWithConfirmation('drop')}
            disabled={saving}
          >
            <FaTimes /> Drop Draft
          </button>
        </div>
      </header>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirm Action</h3>
            <p>{confirmationAction?.message}</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmationAction(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="editor-grid">
        <div className="main-form">
          <div className="basic-info">
            <div className="form-group">
              <label htmlFor="title">Module Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={moduleData.title}
                onChange={handleInputChange}
                placeholder="Enter module title"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weekNumber">Week Number</label>
                <input
                  type="number"
                  id="weekNumber"
                  name="weekNumber"
                  value={moduleData.weekNumber}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="difficultyLevel">Difficulty Level</label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={moduleData.difficultyLevel}
                  onChange={handleInputChange}
                >
                  {Object.entries(DIFFICULTY_LEVELS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="toolbar-group">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type.style}
                    className={`toolbar-button ${isBlockTypeActive(type.style) ? 'active' : ''}`}
                    onClick={() => toggleBlockType(type.style)}
                    data-tooltip={type.label}
                  >
                    <type.icon />
                  </button>
                ))}
              </div>

              <div className="toolbar-group">
                {INLINE_STYLES.map((type) => (
                  <button
                    key={type.style}
                    className={`toolbar-button ${isInlineStyleActive(type.style) ? 'active' : ''}`}
                    onClick={() => toggleInlineStyle(type.style)}
                    data-tooltip={type.label}
                  >
                    <type.icon />
                  </button>
                ))}
              </div>

              <div className="toolbar-group">
                {MEDIA_BUTTONS.map((btn) => (
                  <button
                    key={btn.action}
                    className="toolbar-button"
                    onClick={() => {
                      if (btn.action === 'youtube') {
                        addYouTubeVideo();
                      } else {
                        addMedia(btn.action);
                      }
                    }}
                    data-tooltip={btn.label}
                  >
                    <btn.icon />
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-content" onClick={() => editorRef.current?.focus()}>
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                blockRendererFn={mediaBlockRenderer}
                placeholder="Start writing your module content..."
                textAlignment="left"
                textDirectionality="LTR"
                spellCheck={true}
              />
            </div>
          </div>

          <div className="module-sections">
            <div className="section-header">
              <h2>Module Components</h2>
              <div className="section-actions">
                <button 
                  className="add-section-btn"
                  onClick={handleAddQuiz}
                >
                  <FaQuestion /> Add Quiz
                </button>
                <button 
                  className="add-section-btn"
                  onClick={handleAddAssignment}
                >
                  <FaTasks /> Add Assignment
                </button>
              </div>
            </div>

            <div className="quizzes-list">
              {quizzes.map((quiz, index) => (
                <div key={index} className="quiz-card">
                  {/* Quiz display component */}
                </div>
              ))}
            </div>

            <div className="assignments-list">
              {assignments.map((assignment, index) => (
                <div key={index} className="assignment-card">
                  {/* Assignment display component */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="editor-sidebar">
          <div className="sidebar-section">
            <h3>Module Status</h3>
            <div className="module-status">
              <div className="status-box draft">
                <div className="status-dot draft"></div>
                Draft
              </div>
              <div className="status-box unpublished">
                <div className="status-dot unpublished"></div>
                Unpublished
              </div>
              {/* Published state will be shown when module has been published before */}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Tips</h3>
            <ul className="tips-list">
              <li>Use headings to organize your content</li>
              <li>Add images and videos to make content engaging</li>
              <li>Include quizzes to test understanding</li>
              <li>Set clear assignment instructions</li>
              <li>Preview your module before publishing</li>
            </ul>
          </div>
        </aside>
      </div>

      {showQuizForm && (
        <QuizForm
          onClose={() => setShowQuizForm(false)}
          onSave={(quiz) => {
            setQuizzes([...quizzes, quiz]);
            setShowQuizForm(false);
          }}
        />
      )}

      {showAssignmentForm && (
        <AssignmentForm
          onClose={() => setShowAssignmentForm(false)}
          onSave={(assignment) => {
            setAssignments([...assignments, assignment]);
            setShowAssignmentForm(false);
          }}
        />
      )}
    </div>
  );
};

const MediaBlock = ({ block, contentState, blockProps }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  const { src } = entity.getData();

  if (type === 'IMAGE') {
    return (
      <div className="media-block image-block">
        <img src={src} alt="" />
      </div>
    );
  } else if (type === 'VIDEO') {
    return (
      <div className="media-block video-block">
        <video src={src} controls />
      </div>
    );
  } else if (type === 'YOUTUBE') {
    return (
      <div className="media-block youtube-block">
        <iframe
          width="560"
          height="315"
          src={src}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  } else if (type === 'QUIZ') {
    return (
      <div className="media-block quiz-block">
        <h3>Quiz Section</h3>
        {/* Quiz editor component will go here */}
      </div>
    );
  } else if (type === 'ASSIGNMENT') {
    return (
      <div className="media-block assignment-block">
        <h3>Assignment Section</h3>
        {/* Assignment editor component will go here */}
      </div>
    );
  }

  return null;
};

export default ModuleEditor; 