import { useState } from 'react'
import { 
  CalendarOutline,
  PeopleOutline,
  LocationOutline,
  VideocamOutline,
  AddOutline
} from 'react-ionicons'
import './Events.css'

const Events = () => {
  const [viewType, setViewType] = useState('upcoming')

  const events = [
    {
      id: 1,
      title: "Introduction to AI Workshop",
      date: "March 15, 2024",
      time: "10:00 AM - 12:00 PM",
      type: "workshop",
      location: "Virtual",
      instructor: "Dr. Sarah Miller",
      attendees: 45,
      description: "Get started with AI fundamentals and explore popular AI tools.",
      isOnline: true
    },
    {
      id: 2,
      title: "Prompt Engineering Masterclass",
      date: "March 17, 2024",
      time: "2:00 PM - 4:00 PM",
      type: "masterclass",
      location: "Room 201, Tech Building",
      instructor: "Prof. James Wilson",
      attendees: 30,
      description: "Learn advanced techniques for crafting effective AI prompts.",
      isOnline: false
    },
    // Add more events...
  ]

  return (
    <div className="events-page">
      <header className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Events & Workshops</h1>
            <p className="page-description">Join our AI learning sessions and workshops</p>
          </div>
          <button className="button button-primary">
            <AddOutline color="white" />
            <span>Add to Calendar</span>
          </button>
        </div>

        <div className="view-toggle">
          <button 
            className={`toggle-button ${viewType === 'upcoming' ? 'active' : ''}`}
            onClick={() => setViewType('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`toggle-button ${viewType === 'past' ? 'active' : ''}`}
            onClick={() => setViewType('past')}
          >
            Past Events
          </button>
        </div>
      </header>

      <div className="events-container">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-date">
              <CalendarOutline color="#5f6368" />
              <div>
                <p className="date">{event.date}</p>
                <p className="time">{event.time}</p>
              </div>
            </div>

            <div className="event-details">
              <div className="event-header">
                <h2>{event.title}</h2>
                <span className={`event-type ${event.type}`}>
                  {event.type}
                </span>
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-meta">
                <div className="meta-item">
                  {event.isOnline ? (
                    <VideocamOutline color="#5f6368" />
                  ) : (
                    <LocationOutline color="#5f6368" />
                  )}
                  <span>{event.location}</span>
                </div>
                <div className="meta-item">
                  <PeopleOutline color="#5f6368" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>

              <div className="event-actions">
                <button className="button button-primary">Register Now</button>
                <button className="button button-secondary">Learn More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Events 