import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaArrowLeft,
  FaSave,
  FaUpload,
  FaPlus,
  FaTrash,
  FaGraduationCap,
  FaBook,
  FaVideo,
  FaFile,
  FaImage,
  FaLink
} from 'react-icons/fa';
import './ModuleEditor.css';

const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Beginner Friendly', color: '#34a853' },
  INTERMEDIATE: { label: 'Intermediate', color: '#fbbc04' },
  ADVANCED: { label: 'Advanced', color: '#ea4335' }
};

const ModuleEditor = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewModule = moduleId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    order: 1,
    difficulty_level: 'BEGINNER',
    status: 'draft',
    materials: []
  });

  useEffect(() => {
    if (!isNewModule) {
      fetchModuleData();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const { data: module, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      // Fetch associated materials
      const { data: materials, error: materialsError } = await supabase
        .from('module_materials')
        .select('*')
        .eq('module_id', moduleId)
        .order('order', { ascending: true });

      if (materialsError) throw materialsError;

      setModuleData({
        ...module,
        materials: materials || []
      });
    } catch (error) {
      console.error('Error fetching module:', error);
      setError('Failed to load module data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    setModuleData(prev => {
      const newMaterials = [...prev.materials];
      newMaterials[index] = {
        ...newMaterials[index],
        [field]: value
      };
      return {
        ...prev,
        materials: newMaterials
      };
    });
  };

  const handleAddMaterial = () => {
    setModuleData(prev => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          title: '',
          type: 'document',
          content_url: '',
          order: prev.materials.length + 1,
          duration: 0,
          required: true
        }
      ]
    }));
  };

  const handleRemoveMaterial = (index) => {
    setModuleData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (file, index) => {
    try {
      setUploadProgress(0);
      const fileExt = file.name.split('.').pop();
      const fileName = `course-materials/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(fileName);

      handleMaterialChange(index, 'content_url', publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const modulePayload = {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        difficulty_level: moduleData.difficulty_level,
        status: moduleData.status
      };

      let savedModuleId;

      if (isNewModule) {
        const { data, error } = await supabase
          .from('course_modules')
          .insert([modulePayload])
          .select()
          .single();

        if (error) throw error;
        savedModuleId = data.id;
      } else {
        const { error } = await supabase
          .from('course_modules')
          .update(modulePayload)
          .eq('id', moduleId);

        if (error) throw error;
        savedModuleId = moduleId;
      }

      // Save materials
      if (moduleData.materials.length > 0) {
        const materialsPayload = moduleData.materials.map(material => ({
          ...material,
          module_id: savedModuleId
        }));

        const { error: materialsError } = await supabase
          .from('module_materials')
          .upsert(materialsPayload, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (materialsError) throw materialsError;
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving module:', error);
      setError('Failed to save module');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="module-editor">
      <header className="editor-header">
        <button className="back-button" onClick={() => navigate('/admin/courses')}>
          <FaArrowLeft /> Back to Courses
        </button>
        <h1>{isNewModule ? 'Create New Module' : 'Edit Module'}</h1>
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Module'}
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="editor-grid">
        <div className="main-form">
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

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={moduleData.description}
              onChange={handleInputChange}
              placeholder="Enter module description"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Week Number</label>
              <input
                type="number"
                id="order"
                name="order"
                value={moduleData.order}
                onChange={handleInputChange}
                min={1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty_level">Difficulty Level</label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={moduleData.difficulty_level}
                onChange={handleInputChange}
              >
                {Object.entries(DIFFICULTY_LEVELS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="materials-section">
            <div className="section-header">
              <h2>Course Materials</h2>
              <button className="add-material-btn" onClick={handleAddMaterial}>
                <FaPlus /> Add Material
              </button>
            </div>

            {moduleData.materials.map((material, index) => (
              <div key={index} className="material-card">
                <div className="material-header">
                  <div className="material-icon">
                    {material.type === 'video' && <FaVideo />}
                    {material.type === 'document' && <FaFile />}
                    {material.type === 'image' && <FaImage />}
                    {material.type === 'link' && <FaLink />}
                  </div>
                  <button 
                    className="remove-material-btn"
                    onClick={() => handleRemoveMaterial(index)}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="material-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={material.title}
                      onChange={(e) => handleMaterialChange(index, 'title', e.target.value)}
                      placeholder="Material title"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={material.type}
                        onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
                      >
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="image">Image</option>
                        <option value="link">External Link</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        value={material.duration}
                        onChange={(e) => handleMaterialChange(index, 'duration', parseInt(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content URL</label>
                    {material.type === 'link' ? (
                      <input
                        type="url"
                        value={material.content_url}
                        onChange={(e) => handleMaterialChange(index, 'content_url', e.target.value)}
                        placeholder="Enter URL"
                      />
                    ) : (
                      <div className="file-upload">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e.target.files[0], index)}
                          accept={
                            material.type === 'video' ? 'video/*' :
                            material.type === 'document' ? '.pdf,.doc,.docx' :
                            material.type === 'image' ? 'image/*' : undefined
                          }
                        />
                        <button className="upload-btn">
                          <FaUpload /> Upload File
                        </button>
                        {uploadProgress > 0 && (
                          <div className="upload-progress">
                            Uploading: {uploadProgress}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={material.required}
                        onChange={(e) => handleMaterialChange(index, 'required', e.target.checked)}
                      />
                      Required Material
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="editor-sidebar">
          <div className="sidebar-section">
            <h3>Module Status</h3>
            <select
              name="status"
              value={moduleData.status}
              onChange={handleInputChange}
              className="status-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h3>Quick Tips</h3>
            <ul className="tips-list">
              <li>Give your module a clear, descriptive title</li>
              <li>Break down content into digestible sections</li>
              <li>Include a mix of different material types</li>
              <li>Set appropriate difficulty level</li>
              <li>Review all content before publishing</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ModuleEditor; 