import { useEffect, useState } from "react";
import type { Event } from "./Event";
import EventCard from "./EventCard";
import hackIllinoisLogo from "./assets/hackillinois-logo.png";
import bubble from "./assets/bubble.png";
import "./App.css";


function App() {
  const [events, setEvents] = useState<Event[]>([]);

  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const savedEvents = localStorage.getItem("savedEvents");

    if (savedEvents) {
      setSavedEventIds(JSON.parse(savedEvents));
    }
  }, []);


  useEffect(() => {
    fetch("https://adonix.hackillinois.org/event/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load events");
        }

        return response.json();
      })
      .then((data) => {
        setEvents(data.events);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError("Could not load the schedule.");
        setLoading(false);
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


  function toggleSavedEvent(eventId: string) {
    let updatedSavedEvents: string[];

    if (savedEventIds.includes(eventId)) {
      updatedSavedEvents = savedEventIds.filter((savedId) => {
        return savedId !== eventId;
      });
    } else {
      updatedSavedEvents = [...savedEventIds, eventId];
    }

    setSavedEventIds(updatedSavedEvents);

    localStorage.setItem(
      "savedEvents",
      JSON.stringify(updatedSavedEvents)
    );
  }


  function formatTime(time: number) {
    const date = new Date(time * 1000);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }


  const days = getDays();
  const eventTypes = getEventTypes();

  let filteredEvents = events;


  if (showSavedOnly) {
    filteredEvents = filteredEvents.filter((event) => {
      return savedEventIds.includes(event.eventId);
    });
  }


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
    const search = searchTerm.toLowerCase();

    filteredEvents = filteredEvents.filter((event) => {
      const nameMatches =
        event.name.toLowerCase().includes(search);

      const descriptionMatches =
        event.description.toLowerCase().includes(search);

      return nameMatches || descriptionMatches;
    });
  }


  filteredEvents = [...filteredEvents].sort((event1, event2) => {
    return event1.startTime - event2.startTime;
  });


  return (
    <div className="app-background">

      <div className="ocean-background">
        <img
    src={bubble}
    className="bubble bubble1"
    alt=""
  />

  <img
    src={bubble}
    className="bubble bubble2"
    alt=""
  />

  <img
    src={bubble}
    className="bubble bubble3"
    alt=""
  />

  <img
    src={bubble}
    className="bubble bubble4"
    alt=""
  />
  <img
    src={bubble}
    className="bubble bubble5"
    alt=""
  />
      </div>


      <img
        src={hackIllinoisLogo}
        alt="HackIllinois"
        className="hackillinois-logo"
      />


      <main className="schedule-page">

        <header className="schedule-header">
          <h1>CURRENT</h1>

          <p className="subtitle">
            Navigate HackIllinois
          </p>

          <div className="schedule-stats">
            <span>{events.length} EVENTS</span>
            <span>•</span>
            <span>{days.length} DAYS</span>
            <span>•</span>
            <span>{eventTypes.length} TYPES</span>
          </div>
        </header>


        <div className="control-panel">

          <div className="schedule-mode-buttons">

            <button
              className={!showSavedOnly ? "active-mode" : ""}
              onClick={() => {
                setShowSavedOnly(false);
              }}
            >
              All Events
            </button>


            <button
              className={showSavedOnly ? "active-mode" : ""}
              onClick={() => {
                setShowSavedOnly(true);
              }}
            >
              My Route ({savedEventIds.length})
            </button>

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
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>


          <p className="filter-label">
            EVENT TYPE
          </p>


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

        </div>


        <div className="events-heading">
          <span>EVENTS</span>
          <span>{filteredEvents.length} showing</span>
        </div>


        {loading && (
          <div className="message">
            Loading events...
          </div>
        )}


        {error !== "" && (
          <div className="error-message">
            {error}
          </div>
        )}


        {!loading && error === "" && (

          <div className="events-container">

            {filteredEvents.map((event) => {
              return (
                <EventCard
                  key={event.eventId}
                  event={event}
                  isSaved={savedEventIds.includes(event.eventId)}
                  onSave={toggleSavedEvent}
                  onDetails={setSelectedEvent}
                />
              );
            })}


            {filteredEvents.length === 0 && (
              <div className="message">
                {showSavedOnly
                  ? "Your route is empty."
                  : "No events match your search."}
              </div>
            )}

          </div>
        )}

      </main>


      {selectedEvent !== null && (

        <div
          className="modal-background"
          onClick={() => {
            setSelectedEvent(null);
          }}
        >

          <div
            className="event-modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <button
              className="close-modal"
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              ⓧ
            </button>


            <span className="modal-type">
              {selectedEvent.eventType}
            </span>


            <h2>
              {selectedEvent.name}
            </h2>


            <p className="modal-time">
              {formatTime(selectedEvent.startTime)}
              {" — "}
              {formatTime(selectedEvent.endTime)}
            </p>


            {selectedEvent.locations.length > 0 && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.locations[0].latitude},${selectedEvent.locations[0].longitude}`}
                target="_blank"
                className="modal-location"
              >
                📍 {selectedEvent.locations[0].description} ↗
              </a>
            )}


            {selectedEvent.mapImageUrl !== "" && (
              <a
                href={selectedEvent.mapImageUrl}
                target="_blank"
                className="floor-map-button"
              >
                🗺️ View Floor Map
              </a>
            )}


            <p className="modal-description">
              {selectedEvent.description}
            </p>


            <button
              className={
                savedEventIds.includes(selectedEvent.eventId)
                  ? "modal-save-button saved"
                  : "modal-save-button"
              }
              onClick={() => {
                toggleSavedEvent(selectedEvent.eventId);
              }}
            >
              {savedEventIds.includes(selectedEvent.eventId)
                ? "★ In My Route"
                : "☆ Add to My Route"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


export default App;