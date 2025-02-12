import '../utils/draft-polyfill';
import React, { useEffect, useRef } from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw, AtomicBlockUtils } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@fontsource/material-symbols-rounded';
import './RichTextEditor.css';

const RichTextEditor = ({ onChange, initialContent, placeholder, editorState, setEditorState }) => {
  const editor = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialContent && !editorState) {
      try {
        const contentState = convertFromRaw(JSON.parse(initialContent));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error('Error parsing initial content:', error);
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [initialContent]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const focus = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  // Update parent component with content changes
  useEffect(() => {
    if (onChange && editorState) {
      const contentState = editorState.getCurrentContent();
      const raw = convertToRaw(contentState);
      onChange(JSON.stringify(raw));
    }
  }, [editorState, onChange]);

  // Get current inline style and block type
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  // Add image handling functions
  const handleAddImage = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a blob URL for the image
      const blobUrl = URL.createObjectURL(file);
      
      // Insert the image into the editor
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'IMAGE',
        'IMMUTABLE',
        { src: blobUrl, alt: file.name }
      );
      
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(
        editorState,
        { currentContent: contentStateWithEntity }
      );
      
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          ' '
        )
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Add block renderer function
  const blockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
      };
    }
    return null;
  };

  // Add Media component
  const MediaComponent = (props) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src, alt } = entity.getData();
    const type = entity.getType();

    if (type === 'IMAGE') {
      return <img src={src} alt={alt} style={{ maxWidth: '100%' }} />;
    }
    return null;
  };

  return (
    <div className="editor-container" onClick={focus}>
      <div className="formatting-toolbar">
        {/* Inline Style Controls */}
        <button
          className={`format-button ${currentStyle.has('BOLD') ? 'active' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle('BOLD');
          }}
          type="button"
        >
          <span className="material-symbols-rounded">format_bold</span>
        </button>
        <button
          className={`format-button ${currentStyle.has('ITALIC') ? 'active' : ''}`}
          onMouseDown={(e) => toggleInlineStyle('ITALIC')}
          type="button"
        >
          <span className="material-symbols-rounded">format_italic</span>
        </button>
        <button
          className={`format-button ${currentStyle.has('UNDERLINE') ? 'active' : ''}`}
          onMouseDown={(e) => toggleInlineStyle('UNDERLINE')}
          type="button"
        >
          <span className="material-symbols-rounded">format_underlined</span>
        </button>

        <div className="format-divider" />

        {/* Block Type Controls */}
        <button
          className={`format-button ${blockType === 'header-one' ? 'active' : ''}`}
          onMouseDown={(e) => toggleBlockType('header-one')}
          type="button"
        >
          <span className="material-symbols-rounded">format_h1</span>
        </button>
        <button
          className={`format-button ${blockType === 'header-two' ? 'active' : ''}`}
          onMouseDown={(e) => toggleBlockType('header-two')}
          type="button"
        >
          <span className="material-symbols-rounded">format_h2</span>
        </button>

        <div className="format-divider" />

        <button
          className={`format-button ${blockType === 'unordered-list-item' ? 'active' : ''}`}
          onMouseDown={(e) => toggleBlockType('unordered-list-item')}
          type="button"
        >
          <span className="material-symbols-rounded">format_list_bulleted</span>
        </button>
        <button
          className={`format-button ${blockType === 'ordered-list-item' ? 'active' : ''}`}
          onMouseDown={(e) => toggleBlockType('ordered-list-item')}
          type="button"
        >
          <span className="material-symbols-rounded">format_list_numbered</span>
        </button>

        <div className="format-divider" />

        <button
          className={`format-button ${blockType === 'blockquote' ? 'active' : ''}`}
          onMouseDown={(e) => toggleBlockType('blockquote')}
          type="button"
        >
          <span className="material-symbols-rounded">format_quote</span>
        </button>

        <div className="format-divider" />

        <button
          className="format-button"
          onMouseDown={handleAddImage}
          type="button"
          title="Add Image"
        >
          <span className="material-symbols-rounded">image</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="editor-content">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder={placeholder}
          ref={editor}
          blockRendererFn={blockRenderer}
        />
      </div>
    </div>
  );
};

export default RichTextEditor; 