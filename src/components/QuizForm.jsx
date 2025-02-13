import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SINGLE_CHOICE: 'single_choice',
  TEXT: 'text',
  PARAGRAPH: 'paragraph'
};

const QuizForm = ({ onClose, onSave }) => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    questions: []
  });

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          text: '',
          options: ['', ''],
          correctAnswers: [],
          points: 1
        }
      ]
    }));
  };

  const removeQuestion = (questionId) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const addOption = (questionId) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              options: q.options.map((opt, idx) => 
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const toggleCorrectAnswer = (questionId, optionIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== questionId) return q;

        const correctAnswers = [...q.correctAnswers];
        const answerIndex = correctAnswers.indexOf(optionIndex);

        if (q.type === QUESTION_TYPES.SINGLE_CHOICE) {
          // For single choice, only allow one correct answer
          return { ...q, correctAnswers: [optionIndex] };
        } else {
          // For multiple choice, toggle the answer
          if (answerIndex === -1) {
            correctAnswers.push(optionIndex);
          } else {
            correctAnswers.splice(answerIndex, 1);
          }
          return { ...q, correctAnswers };
        }
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(quiz);
  };

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <div className="form-modal-header">
          <h2>Create Quiz</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="quiz-title">Quiz Title</label>
              <input
                type="text"
                id="quiz-title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quiz-description">Description</label>
              <textarea
                id="quiz-description"
                value={quiz.description}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="time-limit">Time Limit (minutes)</label>
                <input
                  type="number"
                  id="time-limit"
                  value={quiz.timeLimit}
                  onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  min={1}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passing-score">Passing Score (%)</label>
                <input
                  type="number"
                  id="passing-score"
                  value={quiz.passingScore}
                  onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                  min={0}
                  max={100}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Questions</h3>
              <button 
                type="button"
                className="add-question-btn"
                onClick={addQuestion}
              >
                <FaPlus /> Add Question
              </button>
            </div>

            {quiz.questions.map((question, questionIndex) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                    className="question-type-select"
                  >
                    <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>Multiple Choice</option>
                    <option value={QUESTION_TYPES.SINGLE_CHOICE}>Single Choice</option>
                    <option value={QUESTION_TYPES.TEXT}>Short Answer</option>
                    <option value={QUESTION_TYPES.PARAGRAPH}>Long Answer</option>
                  </select>

                  <button
                    type="button"
                    className="remove-question-btn"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    placeholder={`Question ${questionIndex + 1}`}
                    required
                  />
                </div>

                {(question.type === QUESTION_TYPES.MULTIPLE_CHOICE || 
                  question.type === QUESTION_TYPES.SINGLE_CHOICE) && (
                  <div className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-item">
                        <label className="checkbox-label">
                          <input
                            type={question.type === QUESTION_TYPES.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                            checked={question.correctAnswers.includes(optionIndex)}
                            onChange={() => toggleCorrectAnswer(question.id, optionIndex)}
                            name={`question-${question.id}`}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        </label>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="add-option-btn"
                      onClick={() => addOption(question.id)}
                    >
                      <FaPlus /> Add Option
                    </button>
                  </div>
                )}

                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                    min={1}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm; 