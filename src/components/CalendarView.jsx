import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect } from "react";

import ViewEventModal from "./ViewEventModal.jsx";


import "./CalendarView.css";
/*
const LOCATION_COLORS = {
  "42nd St": "#8181ff",
  "Wall St": "#34bfa3",
  "25 Broadway": "#ff8e8e",
  "South St": "#f6c344",
};

*/
export default function CalendarView({
  events, deleteEvent,
  updateEvent,
  selectedEvent,
  setSelectedEvent,
  locations,
}) {

  const calendarEvents = events.map(ev => ({
    id: ev.id,
    title: ev.name,
    start: ev.date + (ev.startTime ? `T${ev.startTime}` : ""),
    end: ev.endTime ? ev.date + `T${ev.endTime}` : undefined,
    extendedProps: {
      locationId: ev.locationId,
      jobCode: ev.jobCode,
    },
  }));



const handleEventClick = (info) => {
  const ev = info.event;

  setSelectedEvent({
    id: ev.id,
    name: ev.title,
    date: ev.startStr.slice(0, 10),
    startTime: ev.startStr.slice(11, 16),
    endTime: ev.endStr ? ev.endStr.slice(11, 16) : "",
    locationId: ev.extendedProps.locationId,
    jobCode: ev.extendedProps.jobCode,
  });
};


const handleDelete = (id) => {
  if (!confirm("Delete this event?")) return;
  console.log("Deleting event with id:", id);
  deleteEvent(Number(id));
  setSelectedEvent(null);
};


  function renderEventContent(eventInfo) {
    const { event } = eventInfo;
    const locationId = event.extendedProps.locationId;

    const loc = locations.find(l =>l.id===locationId);
    const locationName = loc?.name || "";
    const color = loc?.color  || "#a0a0a0";

    return (
        <div className="fc-custom-event"
            style={{ borderLeft: `4px solid ${color}` }}
        >
        <div className="fc-event-title">{event.title}</div>

        {locationName && (
            <div className="fc-event-location">{locationName}</div>
        )}

        {event.start && (
            <div className="fc-event-time">
            {new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
        )}
        </div>
    );
  }




  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        height="80vh"
        selectable={true}
        eventClick={handleEventClick}
        events={calendarEvents}
        eventContent={renderEventContent}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        
      />
      {selectedEvent && (
        <ViewEventModal
          selected={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDelete}
          onUpdate={updateEvent}
          locations={locations}
        />
      )}
    </div>

    
  );
}
