import { useEffect, useState } from "react";
import EventManager from "./EventManager";
import CalendarView from "./CalendarView";
import News from "./News";

export default function EventsProvider({locations, activeView}) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

    
  // Load once from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("events") || "[]");
      setEvents(saved);
    } catch (e) {
      console.error("Failed to load events", e);
    }
  }, []);

  // Persist helper
  const persist = (updated) => {
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  // ADD
  const addEvent = (event) => {
    const updated = [...events, event].sort((a, b) => {
      if (a.date === b.date) {
        return (a.startTime || "").localeCompare(b.startTime || "");
      }
      return a.date.localeCompare(b.date);
    });

    persist(updated);
  };

  // UPDATE
  const updateEvent = (updatedEvent) => {
    const updated = events.map(ev =>
      Number(ev.id) === Number(updatedEvent.id) ? updatedEvent : ev
    );
    persist(updated);
  };

  // DELETE
  const deleteEvent = (id) => {
    const updated = events.filter(ev => Number(ev.id) !== Number(id));
    persist(updated);
  };

  return (
    <>
      {activeView === "Add Event" && (
        <EventManager
          events={events}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          updateEvent={updateEvent}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          locations={locations}
        />
      )}

      {activeView === "Calendar" && (
        <CalendarView
          events={events}
          deleteEvent={deleteEvent}
          updateEvent={updateEvent}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          locations={locations}
        />
      )}
    </>
  );
}
