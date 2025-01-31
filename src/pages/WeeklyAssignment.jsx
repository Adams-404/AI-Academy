import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaTrophy, 
  FaCheckCircle, 
  FaFileUpload,
  FaInfoCircle,
  FaLightbulb,
  FaClipboardList,
  FaBook,
  FaExclamationCircle,
  FaGraduationCap,
  FaPlay,
  FaTimesCircle,
  FaChevronDown
} from 'react-icons/fa';
import './WeeklyAssignment.css';

const WeeklyAssignment = () => {
  const { weekId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState('not_started'); // not_started, in_progress, submitted
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // Mock assignment data (this should come from your backend)
  const assignmentData = {
    title: "AI Tools Implementation",
    description: "Apply your knowledge of AI tools by generating various outputs and reflecting on the experience.",
    duration: "2-3 hours",
    points: 100,
    dueDate: "March 30, 2024",
    objectives: [
      "Demonstrate practical understanding of AI tools",
      "Generate text and image outputs using AI",
      "Analyze and reflect on AI tool capabilities",
      "Document the implementation process"
    ],
    requirements: [
      "Use at least 2 different AI tools",
      "Generate minimum 3 different outputs",
      "Provide detailed documentation",
      "Include screenshots of your process"
    ],
    gradingCriteria: [
      {
        criterion: "Tool Usage & Implementation",
        points: 40,
        description: "Effective use of AI tools and quality of outputs"
      },
      {
        criterion: "Documentation & Analysis",
        points: 30,
        description: "Thoroughness of documentation and depth of analysis"
      },
      {
        criterion: "Reflection & Insights",
        points: 20,
        description: "Quality of reflections and insights gained"
      },
      {
        criterion: "Presentation",
        points: 10,
        description: "Organization and clarity of submission"
      }
    ],
    resources: [
      {
        title: "AI Tool Documentation",
        type: "documentation",
        link: "#"
      },
      {
        title: "Implementation Guide",
        type: "guide",
        link: "#"
      },
      {
        title: "Example Submissions",
        type: "examples",
        link: "#"
      }
    ]
  };

  // Quiz questions based on course topics
  const quizQuestions = [
    {
      question: "What is the main difference between Narrow AI and General AI?",
      options: [
        "Narrow AI is cheaper than General AI",
        "Narrow AI is designed for specific tasks while General AI can handle any intellectual task",
        "General AI is currently widely available",
        "Narrow AI is more powerful than General AI"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a key aspect of prompt engineering?",
      options: [
        "Writing code in Python",
        "Designing user interfaces",
        "Crafting effective instructions for AI models",
        "Managing server infrastructure"
      ],
      correctAnswer: 2
    },
    {
      question: "What is ChatGPT primarily used for?",
      options: [
        "Image generation",
        "Natural language processing and text generation",
        "Video editing",
        "Database management"
      ],
      correctAnswer: 1
    },
    {
      question: "Which tool is specifically designed for AI-assisted image creation?",
      options: [
        "ChatGPT",
        "GitHub Copilot",
        "DALL·E",
        "Dialogflow"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the primary purpose of Dialogflow?",
      options: [
        "Image editing",
        "Chatbot development and natural language understanding",
        "Code compilation",
        "Video processing"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is a best practice for AI implementation?",
      options: [
        "Using AI for every possible task",
        "Ignoring user privacy concerns",
        "Careful testing and validation of AI outputs",
        "Implementing AI without clear objectives"
      ],
      correctAnswer: 2
    },
    {
      question: "What is GitHub Copilot?",
      options: [
        "A version control system",
        "An AI-powered code completion tool",
        "A project management platform",
        "A debugging tool"
      ],
      correctAnswer: 1
    },
    {
      question: "Which aspect is most important when documenting AI implementation?",
      options: [
        "Using complex technical terms",
        "Including only successful attempts",
        "Detailed recording of process and outcomes",
        "Keeping documentation brief"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a key consideration when using AI for content creation?",
      options: [
        "Always using AI-generated content without review",
        "Ensuring originality and reviewing AI outputs",
        "Ignoring copyright concerns",
        "Using only text-based content"
      ],
      correctAnswer: 1
    },
    {
      question: "How should AI tools be integrated into a workflow?",
      options: [
        "Replace all human tasks with AI",
        "Use AI without any human oversight",
        "Strategically combine AI capabilities with human expertise",
        "Implement AI tools without training"
      ],
      correctAnswer: 2
    }
  ];

  // Start quiz timer
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setQuizCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizCompleted]);

  // Handle body scroll during quiz
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quizStarted, quizCompleted]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Implement submission logic here
    setSubmissionStatus('submitted');
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setShowQuiz(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    setQuizCompleted(true);
    // Calculate score and show results
    const correctAnswers = Object.entries(selectedAnswers).reduce((acc, [questionIndex, answerIndex]) => {
      return acc + (quizQuestions[questionIndex].correctAnswer === answerIndex ? 1 : 0);
    }, 0);
    // You can use the score as needed
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`assignment-container ${quizStarted ? 'quiz-started' : ''} ${quizCompleted ? 'quiz-completed' : ''}`}>
      <header className="assignment-header">
        <div className="header-content">
          <div className="header-main">
            <Link to="/WeekOneMaterials" className="back-link">
              <FaArrowLeft />
              <span className="back-text">Back to Materials</span>
            </Link>

            <div className="header-info">
              <h1>{assignmentData.title}</h1>
              <div className="assignment-meta">
                <span>
                  <FaClock />
                  {assignmentData.duration}
                </span>
                <span>
                  <FaTrophy />
                  {assignmentData.points} points
                </span>
                <span className="due-date">
                  <FaExclamationCircle />
                  Due {assignmentData.dueDate}
                </span>
              </div>
            </div>

            <div className="submission-status">
              {submissionStatus === 'submitted' ? (
                <div className="status submitted">
                  <FaCheckCircle />
                  Submitted
                </div>
              ) : (
                <div className="status pending">
                  Not Submitted
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="assignment-grid">
        <main className="assignment-content">
          <section className="content-section">
            <h2>
              <FaInfoCircle />
              Overview
            </h2>
            <p>{assignmentData.description}</p>
            
            <div className="objectives">
              <h3>
                <FaLightbulb />
                Learning Objectives
              </h3>
              <ul>
                {assignmentData.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="content-section">
            <h2>
              <FaClipboardList />
              Requirements
            </h2>
            <ul className="requirements-list">
              {assignmentData.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section className="content-section">
            <h2>
              <FaTrophy />
              Grading Criteria
            </h2>
            <div className="grading-criteria">
              {assignmentData.gradingCriteria.map((criteria, index) => (
                <div key={index} className="criteria-card">
                  <div className="criteria-header">
                    <h4>{criteria.criterion}</h4>
                    <span className="points">{criteria.points} pts</span>
                  </div>
                  <p>{criteria.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section">
            <h2>
              <FaBook />
              Resources
            </h2>
            <div className="resources-grid">
              {assignmentData.resources.map((resource, index) => (
                <a key={index} href={resource.link} className="resource-card">
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="content-section quiz-section">
            <h2>
              <FaGraduationCap />
              Knowledge Check Quiz
            </h2>
            {!quizStarted ? (
              <div className="quiz-container">
                <div className="quiz-header">
                  <h3 className="quiz-title">
                    <FaGraduationCap />
                    Knowledge Check Quiz
                  </h3>
                  <div className="quiz-info">
                    <span><FaClock /> 20 minutes</span>
                    <span><FaGraduationCap /> 10 questions</span>
                  </div>
                </div>
                <div className="start-quiz-container">
                  <button className="start-quiz-button" onClick={startQuiz}>
                    <FaPlay /> Start Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="quiz-container">
                <div className="quiz-header">
                  <h3 className="quiz-title">
                    <FaGraduationCap />
                    Knowledge Check Quiz
                  </h3>
                </div>
                {!quizCompleted ? (
                  <>
                    <div className="quiz-timer">
                      <FaClock /> Time Remaining: {formatTime(timeLeft)}
                    </div>
                    <div className="question-card">
                      <div className="question-number">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </div>
                      <div className="question-text">
                        {quizQuestions[currentQuestion].question}
                      </div>
                      <div className="options-list">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <div key={index} className="option-item">
                            <input
                              type="radio"
                              id={`option-${index}`}
                              name={`question-${currentQuestion}`}
                              className="option-input"
                              checked={selectedAnswers[currentQuestion] === index}
                              onChange={() => handleAnswerSelect(currentQuestion, index)}
                            />
                            <label htmlFor={`option-${index}`} className="option-label">
                              <div className="option-marker"></div>
                              <div className="option-text">{option}</div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="quiz-navigation">
                      <button
                        className="nav-button"
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </button>
                      {currentQuestion < quizQuestions.length - 1 ? (
                        <button
                          className="nav-button"
                          onClick={() => setCurrentQuestion(prev => prev + 1)}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="nav-button submit-quiz"
                          onClick={handleQuizSubmit}
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="quiz-results">
                    <div className="quiz-results-icon success">
                      <FaTrophy />
                    </div>
                    <h3>Quiz Completed!</h3>
                    <p>You can now proceed with the assignment submission.</p>
                    
                    <div className="quiz-score">
                      <div className="quiz-score-text">
                        Your Score: {Object.keys(selectedAnswers).reduce((acc, questionIndex) => {
                          return acc + (selectedAnswers[questionIndex] === quizQuestions[questionIndex].correctAnswer ? 1 : 0);
                        }, 0)} / {quizQuestions.length}
                      </div>
                      <div className="quiz-score-details">
                        {Math.round((Object.keys(selectedAnswers).reduce((acc, questionIndex) => {
                          return acc + (selectedAnswers[questionIndex] === quizQuestions[questionIndex].correctAnswer ? 1 : 0);
                        }, 0) / quizQuestions.length) * 100)}% Correct
                      </div>
                    </div>

                    <button 
                      className={`review-answers-button ${showAnswers ? 'active' : ''}`}
                      onClick={() => setShowAnswers(!showAnswers)}
                    >
                      <span>{showAnswers ? 'Hide Corrections' : 'Review Answers'}</span>
                      <FaChevronDown />
                    </button>

                    <div className={`quiz-answers ${showAnswers ? 'show' : ''}`}>
                      {quizQuestions.map((question, index) => (
                        <div 
                          key={index} 
                          className={`quiz-answer-item ${
                            selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'
                          }`}
                        >
                          <div className={`answer-icon ${
                            selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'
                          }`}>
                            {selectedAnswers[index] === question.correctAnswer ? (
                              <FaCheckCircle />
                            ) : (
                              <FaTimesCircle />
                            )}
                          </div>
                          <div className="answer-text">
                            <strong>Question {index + 1}:</strong> {question.question}
                            <br />
                            <small>
                              {selectedAnswers[index] === question.correctAnswer ? 
                                'Correct answer!' : 
                                `Correct answer was: ${question.options[question.correctAnswer]}`}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="content-section submission-section">
            <h2>
              <FaFileUpload />
              Submit Your Work
            </h2>
            <div className="upload-area">
              <div className="upload-dropzone">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <FaFileUpload />
                  <span>Drag & drop files or click to browse</span>
                  <span className="upload-hint">Maximum file size: 50MB</span>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files:</h4>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>
                        <span>{file.name}</span>
                        <button onClick={() => removeFile(index)} className="remove-file">
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                className="submit-button"
                onClick={handleSubmit}
                disabled={selectedFiles.length === 0 || submissionStatus === 'submitted'}
              >
                {submissionStatus === 'submitted' ? 'Submitted' : 'Submit Assignment'}
              </button>
            </div>
          </section>
        </main>

        <aside className="assignment-sidebar">
          <div className="sidebar-section">
            <h3>Assignment Progress</h3>
            <div className="progress-tracker">
              <div className="progress-item completed">
                <FaCheckCircle />
                <span>Review Materials</span>
              </div>
              <div className="progress-item active">
                <div className="progress-number">2</div>
                <span>Complete Assignment</span>
              </div>
              <div className="progress-item">
                <div className="progress-number">3</div>
                <span>Submit Work</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Tips for Success</h3>
            <ul className="tips-list">
              <li>Start early to allow time for revisions</li>
              <li>Review all requirements carefully</li>
              <li>Test your implementation thoroughly</li>
              <li>Document your process as you go</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WeeklyAssignment; 