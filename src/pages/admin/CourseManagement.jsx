import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaLock,
  FaUnlock,
  FaGraduationCap,
  FaBook,
  FaClipboardList,
  FaBrain
} from 'react-icons/fa';
import './CourseManagement.css';

const CourseManagement = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to load course modules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = () => {
    navigate('/admin/courses/module/new');
  };

  const handleEditModule = (moduleId) => {
    navigate(`/admin/courses/module/${moduleId}`);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      
      // Refresh the modules list
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('Failed to delete module');
    }
  };

  const handleTogglePublish = async (moduleId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .update({ status: currentStatus === 'published' ? 'draft' : 'published' })
        .eq('id', moduleId);

      if (error) throw error;
      
      // Refresh the modules list
      fetchModules();
    } catch (error) {
      console.error('Error updating module status:', error);
      setError('Failed to update module status');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-management">
      <header className="management-header">
        <div className="header-content">
          <div className="header-title">
            <FaGraduationCap className="header-icon" />
            <h1>Course Management</h1>
          </div>
          <button className="create-module-btn" onClick={handleCreateModule}>
            <FaPlus /> Create New Module
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.id} className="module-card">
            <div className="module-header">
              <div className="module-title">
                <FaBook className="module-icon" />
                <h3>{module.title}</h3>
              </div>
              <span className={`module-status ${module.status}`}>
                {module.status}
              </span>
            </div>

            <p className="module-description">{module.description}</p>

            <div className="module-meta">
              <span className="difficulty" style={{ 
                color: module.difficulty_level === 'BEGINNER' ? '#34a853' : 
                       module.difficulty_level === 'INTERMEDIATE' ? '#fbbc04' : '#ea4335' 
              }}>
                <FaBrain /> {module.difficulty_level}
              </span>
              <span className="order">
                <FaClipboardList /> Week {module.order}
              </span>
            </div>

            <div className="module-actions">
              <button 
                className="action-btn view" 
                onClick={() => navigate(`/admin/courses/module/${module.id}/preview`)}
              >
                <FaEye /> Preview
              </button>
              <button 
                className="action-btn edit" 
                onClick={() => handleEditModule(module.id)}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="action-btn publish" 
                onClick={() => handleTogglePublish(module.id, module.status)}
              >
                {module.status === 'published' ? <FaLock /> : <FaUnlock />}
                {module.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button 
                className="action-btn delete" 
                onClick={() => handleDeleteModule(module.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement; 