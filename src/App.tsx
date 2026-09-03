import { useEffect, useState } from "react";
import type { Event } from "./Event";
import EventCard from "./components/EventCard";

function App() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("https://adonix.hackillinois.org/event/")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div>
      <h1>HackIllinois 2027 Schedule</h1>

      {events.map((event) => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
}

export default App;