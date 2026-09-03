import type { Event } from "../Event";

type EventCardProps = {
  event: Event;
};

function EventCard({ event }: EventCardProps) {
  const startTime = new Date(event.startTime * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime = new Date(event.endTime * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div>
      <h2>{event.name}</h2>

      <p>
        {startTime} - {endTime}
      </p>

      <p>{event.eventType}</p>
      <p>{event.description}</p>
    </div>
  );
}

export default EventCard;