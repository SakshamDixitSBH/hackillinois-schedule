import type { Event } from "./Event";


type EventCardProps = {
  event: Event;
  isSaved: boolean;
  onSave: (eventId: string) => void;
  onDetails: (event: Event) => void;
};


function EventCard({
  event,
  isSaved,
  onSave,
  onDetails,
}: EventCardProps) {


  function formatTime(time: number) {
    const date = new Date(time * 1000);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }


  function getEventIcon(type: string) {
    if (type === "WORKSHOP") {
      return "⚙";
    }

    if (type === "MEAL") {
      return "🍴";
    }

    if (type === "SPEAKER") {
      return "◉";
    }

    if (type === "MINIEVENT") {
      return "✦";
    }

    return "≈";
  }


  const startTime = formatTime(event.startTime);
  const endTime = formatTime(event.endTime);

  const icon = getEventIcon(event.eventType);


  return (
    <div className="event-card">

      <div className="event-card-header">

        <h2>
          {event.name}
        </h2>

        <span className="event-type">
          {icon} {event.eventType}
        </span>

      </div>


      <p className="event-time">
        ◷ {startTime} — {endTime}
      </p>


      <p className="event-description">
        {event.description}
      </p>


      <div className="event-actions">

        <button
          className="details-button"
          onClick={() => {
            onDetails(event);
          }}
        >
          View Details
        </button>


        <button
          className={isSaved ? "save-button saved" : "save-button"}
          onClick={() => {
            onSave(event.eventId);
          }}
        >
          {isSaved ? "★ In My Route" : "☆ Add to Route"}
        </button>

      </div>

    </div>
  );
}


export default EventCard;