import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowLeft,
  FaBook,
  FaDownload,
  FaBrain,
  FaLightbulb,
  FaRobot,
  FaCogs,
  FaTools,
  FaCode,
  FaIndustry,
  FaChartLine,
  FaClipboardCheck,
  FaCheck,
  FaBookReader,
  FaClock,
  FaUser,
} from "react-icons/fa"
import "./WeekOneMaterials.css"
import { supabase } from '../config/supabase'
import { useAuth } from "../contexts/AuthContext" // Assuming you have AuthContext

const WeekOneMaterials = () => {
  const { user } = useAuth(); // Get current user from auth context
  
  const [activeSection, setActiveSection] = useState("introduction");
  
  const [progress, setProgress] = useState({
    introduction: false,
    concepts: false,
    applications: false,
  });

  const [showMaterials, setShowMaterials] = useState(false)

  const sections = {
    introduction: {
      title: "Introduction to AI",
      icon: <FaBrain />,
      content: [
        {
          subtitle: "What is Artificial Intelligence?",
          text: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn. At its core, AI is about creating systems that can perform tasks that typically require human intelligence.",
          keyPoints: [
            "Intelligence simulation in machines",
            "Problem-solving capabilities",
            "Learning from experience",
            "Pattern recognition",
            "Decision making abilities",
          ],
        },
        {
          subtitle: "Brief History of AI",
          text: "The field of AI has evolved significantly since its inception in the 1950s:",
          timeline: [
            { year: "1950s", event: "Birth of AI as an academic discipline" },
            { year: "1960s", event: "Development of early expert systems" },
            { year: "1980s", event: "Introduction of machine learning algorithms" },
            { year: "2010s", event: "Deep learning revolution" },
            { year: "Present", event: "AI integration in everyday applications" },
          ],
        },
      ],
    },
    concepts: {
      title: "Basic AI Concepts",
      icon: <FaCogs />,
      content: [
        {
          subtitle: "Types of AI",
          categories: [
            {
              name: "Narrow AI (ANI)",
              description: "Designed for specific tasks (e.g., facial recognition, playing chess)",
              examples: ["Siri", "Chess computers", "Image recognition systems"],
            },
            {
              name: "General AI (AGI)",
              description: "Hypothetical AI with human-like general intelligence",
              examples: ["Not yet achieved", "Subject of ongoing research"],
            },
          ],
        },
        {
          subtitle: "Core Components",
          components: [
            {
              name: "Machine Learning",
              description: "Systems that improve with experience",
              examples: ["Recommendation systems", "Spam filters"],
            },
            {
              name: "Deep Learning",
              description: "Neural networks with multiple layers",
              examples: ["Image recognition", "Natural language processing"],
            },
            {
              name: "Neural Networks",
              description: "Computing systems inspired by biological neural networks",
              examples: ["Pattern recognition", "Data classification"],
            },
          ],
        },
      ],
    },
    applications: {
      title: "Real-World Applications",
      icon: <FaIndustry />,
      content: [
        {
          subtitle: "Current Applications",
          categories: [
            {
              field: "Healthcare",
              examples: ["Disease diagnosis", "Drug discovery", "Patient care optimization"],
            },
            {
              field: "Finance",
              examples: ["Fraud detection", "Algorithmic trading", "Risk assessment"],
            },
            {
              field: "Transportation",
              examples: ["Self-driving cars", "Traffic prediction", "Route optimization"],
            },
          ],
        },
        {
          subtitle: "Case Studies",
          cases: [
            {
              title: "IBM Watson in Healthcare",
              description: "AI system assisting doctors in diagnosis and treatment planning",
              impact: "Improved accuracy in cancer diagnosis by 40%",
            },
            {
              title: "AI in Climate Change",
              description: "Using AI to predict weather patterns and optimize energy usage",
              impact: "Reduced energy consumption in data centers by 30%",
            },
          ],
        },
      ],
    },
  }

  const sectionOrder = ["introduction", "concepts", "applications"]

  const handleNavigation = async (direction) => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    const nextSection = sectionOrder[nextIndex];
    
    if (direction === "next") {
      // Update local state immediately for better UX
      const updatedProgress = {
        ...progress,
        [activeSection]: true // Mark current section as complete
      };
      
      // If this is the last section, mark it complete too
      if (nextIndex === sectionOrder.length - 1) {
        updatedProgress[nextSection] = true;
      }
      
      console.log('Saving updated progress:', updatedProgress, 'Next section:', nextSection);
      
      // Update local state
      setProgress(updatedProgress);
      setActiveSection(nextSection);
      
      // Scroll to top immediately
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Save to Supabase
      try {
        // First try to get the existing record
        const { data: existingData } = await supabase
          .from('course_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', 'week_one')
          .single();

        const updateData = {
          user_id: user.id,
          course_id: 'week_one',
          module_id: 'week_one_module',
          progress: updatedProgress,
          active_section: nextSection,
          last_position: nextSection,
          completed: nextIndex === sectionOrder.length - 1, // Mark as completed if on last section
          updated_at: new Date().toISOString()
        };

        let result;
        
        if (existingData?.id) {
          // Update existing record
          result = await supabase
            .from('course_progress')
            .update(updateData)
            .eq('id', existingData.id)
            .select();
        } else {
          // Insert new record
          result = await supabase
            .from('course_progress')
            .insert(updateData)
            .select();
        }

        const { error } = result;
        if (error) throw error;

        console.log('Saved to Supabase:', result.data);

        // Update localStorage
        localStorage.setItem('courseProgress', JSON.stringify(updatedProgress));
        localStorage.setItem('activeSection', nextSection);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    } else {
      setActiveSection(nextSection);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      console.log('Fetching progress for user:', user.id);
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', 'week_one')
        .single();

      console.log('Raw fetched data:', data);

      if (error) {
        if (error.code === 'PGRST116') {
          // Create initial record
          const initialProgress = {
            introduction: false,
            concepts: false,
            applications: false,
          };

          const { data: newData, error: insertError } = await supabase
            .from('course_progress')
            .insert({
              user_id: user.id,
              course_id: 'week_one',
              module_id: 'week_one_module',
              progress: initialProgress,
              active_section: 'introduction',
              last_position: 'introduction',
              completed: false,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) throw insertError;
          
          console.log('Created initial progress:', newData);
          data = newData;
        } else {
          throw error;
        }
      }

      if (data) {
        // Ensure we have all sections in the progress object
        const currentProgress = {
          introduction: false,
          concepts: false,
          applications: false,
          ...data.progress // This will override the defaults with saved values
        };

        // If the course was completed, ensure all sections are marked as complete
        if (data.completed) {
          sectionOrder.forEach(section => {
            currentProgress[section] = true;
          });
        }

        const currentSection = data.last_position || data.active_section || 'introduction';
        
        console.log('Restoring states:', {
          progress: currentProgress,
          activeSection: currentSection,
          completed: data.completed
        });

        setProgress(currentProgress);
        setActiveSection(currentSection);
        
        localStorage.setItem('courseProgress', JSON.stringify(currentProgress));
        localStorage.setItem('activeSection', currentSection);

        // Log the calculated progress
        const progressPercentage = calculateProgress(currentProgress);
        console.log('Restored progress percentage:', progressPercentage + '%');
      }
    } catch (error) {
      console.error('Error in fetchProgress:', error);
      // Fall back to localStorage if available
      const savedProgress = localStorage.getItem('courseProgress');
      const savedSection = localStorage.getItem('activeSection');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(parsedProgress);
        console.log('Restored from localStorage:', {
          progress: parsedProgress,
          percentage: calculateProgress(parsedProgress) + '%'
        });
      }
      if (savedSection) {
        setActiveSection(savedSection);
      }
    }
  };

  // Make sure calculateProgress is defined
  const calculateProgress = (progressObj) => {
    if (!progressObj) return 0;
    const totalSections = sectionOrder.length;
    const completedSections = Object.values(progressObj).filter(Boolean).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  // Add this effect to monitor progress changes
  useEffect(() => {
    const progressPercentage = calculateProgress(progress);
    console.log('Current progress state:', progress);
    console.log('Progress percentage:', progressPercentage + '%');
  }, [progress]);

  // Make sure we fetch progress when component mounts
  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const isFirstSection = sectionOrder.indexOf(activeSection) === 0
  const isLastSection = sectionOrder.indexOf(activeSection) === sectionOrder.length - 1

  const completedSections = Object.values(progress).filter(Boolean).length
  const totalSections = Object.keys(progress).length
  const progressPercentage = completedSections / totalSections

  const handleComplete = () => {
    const updatedProgress = {
      ...progress,
      [activeSection]: true
    };
    setProgress(updatedProgress);
    localStorage.setItem('courseProgress', JSON.stringify(updatedProgress));
    setShowMaterials(true);
  };

  const resetProgress = async () => {
    const initialProgress = {
      introduction: false,
      concepts: false,
      applications: false,
    };
    setProgress(initialProgress);
    setActiveSection("introduction");
    localStorage.setItem('courseProgress', JSON.stringify(initialProgress));
    localStorage.setItem('activeSection', "introduction");
  };

  return (
    <div className="materials-container">
      <header className="course-header">
        <div className="header-content">
          <div className="header-main">
            <Link to="/courses" className="back-link">
              <FaArrowLeft />
              <span className="back-text">Back to Courses</span>
            </Link>

            <div className="header-info">
              <h1>{sections[activeSection].title}</h1>
              <div className="course-meta">
                <span>
                  <FaBookReader />
                  Week 1
                </span>
                <span>
                  <FaClock />
                  2h
                </span>
                <span>
                  <FaUser />
                  Dr. Smith
                </span>
              </div>
            </div>

            <div className="progress-indicator">
              <div className="progress-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage * 100}, 100`}
                  />
                </svg>
                <span className="progress-text">{Math.round(progressPercentage * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="materials-grid">
        <div className="main-content">
          {!showMaterials ? (
            <>
              <div className="video-card">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/WP6z_X5d-Rw?si=FS3sQzHi8M8vBGLC"
                    title="Introduction to AI Concepts"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-info">
                  <h2>Introduction to AI Concepts</h2>
                  <p>Video Lecture • 4 mins</p>
                </div>
              </div>

              <div className="content-section">
                <div className="content-wrapper word-wrap">
                  {sections[activeSection].content.map((item, index) => (
                    <div key={index} className="content-block">
                      <h3>{item.subtitle}</h3>
                      {item.text && <p>{item.text}</p>}

                      {item.keyPoints && (
                        <ul className="key-points">
                          {item.keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      )}

                      {item.timeline && (
                        <div className="timeline">
                          {item.timeline.map((event, i) => (
                            <div
                              key={i}
                              className="timeline-event"
                              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                              <span className="year" style={{ flexShrink: 0, marginRight: "1rem" }}>
                                {event.year}
                              </span>
                              <span className="event" style={{ flexGrow: 1 }}>
                                {event.event}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.categories && (
                        <div className="grid-container">
                          <div className="categories-grid">
                            {item.categories.map((category, i) => (
                              <div
                                key={i}
                                className="category-card"
                              >
                                <h4>{category.name || category.field}</h4>
                                {category.description && <p>{category.description}</p>}
                                <ul>
                                  {category.examples.map((example, j) => (
                                    <li key={j}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.components && (
                        <div className="grid-container">
                          <div className="components-grid">
                            {item.components.map((component, i) => (
                              <div
                                key={i}
                                className="component-card"
                              >
                                <h4>{component.name}</h4>
                                <p>{component.description}</p>
                                <div className="examples">
                                  {component.examples.map((example, j) => (
                                    <span key={j} className="example-tag">
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.cases && (
                        <div className="grid-container">
                          <div className="case-studies">
                            {item.cases.map((case_study, i) => (
                              <div
                                key={i}
                                className="case-card"
                                style={{ display: "flex", flexDirection: "column", height: "100%" }}
                              >
                                <h4>{case_study.title}</h4>
                                <p>{case_study.description}</p>
                                <div className="impact" style={{ marginTop: "auto" }}>
                                  <strong>Impact:</strong> {case_study.impact}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="topic-navigation">
                  {!isFirstSection && (
                    <button className="nav-button prev" onClick={() => handleNavigation("prev")}>
                      <FaArrowLeft /> Previous Topic
                    </button>
                  )}
                  {!isLastSection && (
                    <button className="nav-button next" onClick={() => handleNavigation("next")}>
                      Next Topic <FaArrowLeft style={{ transform: "rotate(180deg)" }} />
                    </button>
                  )}
                  {isLastSection && (
                    <button className="nav-button complete" onClick={handleComplete}>
                      Complete Module <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="materials-section">
              <h2>Module Materials</h2>
              <div className="materials-list">
                <div className="material-card">
                  <div className="material-icon">
                    <FaDownload />
                  </div>
                  <div className="material-content">
                    <h3>Week 1 Complete Notes</h3>
                    <p className="material-meta">PDF • Comprehensive Notes</p>
                    <button className="start-button">Download Notes</button>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-icon">
                    <FaBook />
                  </div>
                  <div className="material-content">
                    <h3>Additional Resources</h3>
                    <p className="material-meta">External Links • Reading Material</p>
                    <div className="resource-links">
                      <a href="#" className="resource-link">AI Fundamentals Guide</a>
                      <a href="#" className="resource-link">Stanford Online AI Course</a>
                      <a href="#" className="resource-link">Harvard AI Ethics</a>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-icon">
                    <FaClipboardCheck />
                  </div>
                  <div className="material-content">
                    <h3>Weekly Assessment</h3>
                    <p className="material-meta">Quiz • 20 minutes</p>
                    <button className="start-button">Start Quiz</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeekOneMaterials

