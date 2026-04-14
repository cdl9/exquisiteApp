import { useEffect, useState } from "react";
import EventManager from "./events/EventManager";
import CalendarView from "./calendar/CalendarView";


export default function EventsProvider({locations, activeView, employees, groups}) {
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
    const updatedEvents = events.map(ev =>
      ev.id === updatedEvent.id ? updatedEvent : ev
    )

    setEvents(updatedEvents)

    // ⭐ keep modal event in sync
    if (selectedEvent?.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent)
    }

    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

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
          employees={employees}
          groups={groups}
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
