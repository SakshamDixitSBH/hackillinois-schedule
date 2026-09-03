import { useEffect, useState } from "react";
import type { Event } from "./Event";
import EventCard from "./components/EventCard";
import hackIllinoisLogo from "./assets/hackillinois-logo.png";
import "./App.css";

function App() {
  const [events, setEvents] = useState<Event[]>([]);

  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://adonix.hackillinois.org/event/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEvents(data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  function getEventDay(event: Event) {
    const date = new Date(event.startTime * 1000);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  function getDays() {
    const days: string[] = [];

    events.forEach((event) => {
      const day = getEventDay(event);

      if (!days.includes(day)) {
        days.push(day);
      }
    });

    return days;
  }

  function getEventTypes() {
    const types: string[] = [];

    events.forEach((event) => {
      if (!types.includes(event.eventType)) {
        types.push(event.eventType);
      }
    });

    return types;
  }

  const days = getDays();
  const eventTypes = getEventTypes();

  let filteredEvents = events;

  if (selectedDay !== "All") {
    filteredEvents = filteredEvents.filter((event) => {
      return getEventDay(event) === selectedDay;
    });
  }

  if (selectedType !== "All") {
    filteredEvents = filteredEvents.filter((event) => {
      return event.eventType === selectedType;
    });
  }

  if (searchTerm !== "") {
    filteredEvents = filteredEvents.filter((event) => {
      const eventName = event.name.toLowerCase();
      const eventDescription = event.description.toLowerCase();
      const search = searchTerm.toLowerCase();

      const nameMatches = eventName.includes(search);
      const descriptionMatches = eventDescription.includes(search);

      return nameMatches || descriptionMatches;
    });
  }

  filteredEvents = [...filteredEvents].sort((event1, event2) => {
    return event1.startTime - event2.startTime;
  });

  return (
    <div>
      <div className="ocean-background">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
        <span className="bubble bubble4"></span>
        <span className="bubble bubble5"></span>
        <span className="bubble bubble6"></span>
      </div>

      <img
        src={hackIllinoisLogo}
        alt="HackIllinois"
        className="hackillinois-logo"
      />

      <main className="schedule-page">

        <header className="schedule-header">
          <h1>Deep Dive Schedule</h1>

          <p className="subtitle">
            Dive into workshops, talks, food, and everything happening this weekend.
          </p>

          <div className="schedule-stats">
            <span>{events.length} EVENTS</span>
            <span>•</span>
            <span>{days.length} DAYS</span>
            <span>•</span>
            <span>{eventTypes.length} CATEGORIES</span>
          </div>
        </header>

        <div className="wave-line">
          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        </div>

        <div className="day-buttons">
          <button
            className={selectedDay === "All" ? "active-day" : ""}
            onClick={() => {
              setSelectedDay("All");
            }}
          >
            All Days
          </button>

          {days.map((day) => {
            return (
              <button
                key={day}
                className={selectedDay === day ? "active-day" : ""}
                onClick={() => {
                  setSelectedDay(day);
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="search-section">
          <span className="search-icon">🔎</span>

          <input
            type="text"
            placeholder="Search below the surface..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <p className="filter-label">EXPLORE BY CATEGORY</p>

        <div className="type-buttons">
          <button
            className={selectedType === "All" ? "active-type" : ""}
            onClick={() => {
              setSelectedType("All");
            }}
          >
            ALL
          </button>

          {eventTypes.map((type) => {
            return (
              <button
                key={type}
                className={selectedType === type ? "active-type" : ""}
                onClick={() => {
                  setSelectedType(type);
                }}
              >
                {type}
              </button>
            );
          })}
        </div>

        <div className="current-view">
          <div>
            <span className="current-label">CURRENT DIVE</span>

            <p>
              {selectedDay.toUpperCase()} / {selectedType.toUpperCase()}
            </p>
          </div>

          <span className="result-count">
            {filteredEvents.length} events
          </span>
        </div>

        <div className="events-container">
          {filteredEvents.map((event) => {
            return (
              <EventCard
                key={event.eventId}
                event={event}
              />
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <p className="no-events-icon">🐚</p>
              <p>No events found down here.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;