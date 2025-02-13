import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const AssignmentForm = ({ onClose, onSave }) => {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 100,
    requirements: [''],
    resources: [''],
    submissionType: 'file', // 'file', 'text', 'link'
    allowedFileTypes: '.pdf,.doc,.docx',
    maxFileSize: 10, // MB
  });

  const addListItem = (field) => {
    setAssignment(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field, index) => {
    setAssignment(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (field, index, value) => {
    setAssignment(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(assignment);
  };

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <div className="form-modal-header">
          <h2>Create Assignment</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="assignment-title">Assignment Title</label>
              <input
                type="text"
                id="assignment-title"
                value={assignment.title}
                onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignment-description">Description</label>
              <textarea
                id="assignment-description"
                value={assignment.description}
                onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter assignment description"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="due-date">Due Date</label>
                <input
                  type="datetime-local"
                  id="due-date"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="points">Points</label>
                <input
                  type="number"
                  id="points"
                  value={assignment.points}
                  onChange={(e) => setAssignment(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  min={1}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Requirements</h3>
              <button
                type="button"
                className="add-item-btn"
                onClick={() => addListItem('requirements')}
              >
                <FaPlus /> Add Requirement
              </button>
            </div>

            {assignment.requirements.map((requirement, index) => (
              <div key={index} className="list-item">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateListItem('requirements', index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeListItem('requirements', index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Resources</h3>
              <button
                type="button"
                className="add-item-btn"
                onClick={() => addListItem('resources')}
              >
                <FaPlus /> Add Resource
              </button>
            </div>

            {assignment.resources.map((resource, index) => (
              <div key={index} className="list-item">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => updateListItem('resources', index, e.target.value)}
                  placeholder={`Resource ${index + 1} (URL or description)`}
                />
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeListItem('resources', index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Submission Settings</h3>
            
            <div className="form-group">
              <label htmlFor="submission-type">Submission Type</label>
              <select
                id="submission-type"
                value={assignment.submissionType}
                onChange={(e) => setAssignment(prev => ({ ...prev, submissionType: e.target.value }))}
              >
                <option value="file">File Upload</option>
                <option value="text">Text Submission</option>
                <option value="link">Link Submission</option>
              </select>
            </div>

            {assignment.submissionType === 'file' && (
              <>
                <div className="form-group">
                  <label htmlFor="allowed-types">Allowed File Types</label>
                  <input
                    type="text"
                    id="allowed-types"
                    value={assignment.allowedFileTypes}
                    onChange={(e) => setAssignment(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                    placeholder=".pdf,.doc,.docx"
                  />
                  <small>Enter file extensions separated by commas</small>
                </div>

                <div className="form-group">
                  <label htmlFor="max-size">Maximum File Size (MB)</label>
                  <input
                    type="number"
                    id="max-size"
                    value={assignment.maxFileSize}
                    onChange={(e) => setAssignment(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    min={1}
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm; 