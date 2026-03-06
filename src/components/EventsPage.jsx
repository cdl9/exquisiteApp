// EventsPage.jsx
import React, { useEffect, useState } from "react";
import EventManager from "./EventManager";
import CalendarView from "./CalendarView";
import EventModal from "./EventModal";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(saved);
  }, []);

  const persist = (list) => {
    setEvents(list);
    localStorage.setItem("events", JSON.stringify(list));
  };

  return (
    <>
      <CalendarView
        events={events}
        onEventClick={setSelectedEvent}
      />

      <EventManager
        events={events}
        setEvents={persist}
        onAdd={() => setShowAdd(true)}
        onSelect={setSelectedEvent}
      />

      {showAdd && (
        <EventModal
            mode="add"
            close={() => setShowAdd(false)}
        />
        )}

       {selected && (
        <EventModal
            mode="view"
            selected={selected}
            close={() => setSelected(null)}
        />
       )}
    </>
  );
}
