import type { Event } from "../Event";


type EventCardProps = {
  event: Event;
  isSaved: boolean;
  onSave: (eventId: string) => void;
};


function EventCard({
  event,
  isSaved,
  onSave,
}: EventCardProps) {


  function formatTime(time: number) {
    const date = new Date(time * 1000);

    const formattedTime = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return formattedTime;
  }


  function getEventIcon(type: string) {
    if (type === "WORKSHOP") {
      return "⚙️";
    }

    if (type === "MEAL") {
      return "🍽️";
    }

    if (type === "SPEAKER") {
      return "🎤";
    }

    if (type === "MINIEVENT") {
      return "⭐";
    }

    return "🌊";
  }


  function getGoogleMapsLink(
    latitude: number,
    longitude: number
  ) {
    const link =
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return link;
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
        🫧 {startTime} - {endTime}
      </p>


      {event.locations.length > 0 && (
        <div className="event-locations">

          {event.locations.map((location, index) => {
            const mapsLink = getGoogleMapsLink(
              location.latitude,
              location.longitude
            );

            return (
              <a
                key={index}
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="location-link"
              >
                📍 {location.description} ↗
              </a>
            );
          })}

        </div>
      )}


      <p className="event-description">
        {event.description}
      </p>


      <button
        className={isSaved ? "save-button saved" : "save-button"}
        onClick={() => {
          onSave(event.eventId);
        }}
      >
        {isSaved ? "★ Saved" : "☆ Save to My Schedule"}
      </button>

    </div>
  );
}


export default EventCard;