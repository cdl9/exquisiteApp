// EventManager.jsx
import React, { useEffect, useState } from "react";
import "./Event.css";
import ViewEventModal from "./ViewEventModal.jsx";
/*
const DEFAULT_LOCATIONS = [
  "42nd St",
  "Wall St",
  "25 Broadway",
  "South St",
];
*/


function formatDateISO(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US");
}

function formatTime(t) {
  if (!t) return "";
  // expects "HH:MM" 24-hour
  const [hh, mm] = t.split(":");
  const n = new Date();
  n.setHours(parseInt(hh, 10), parseInt(mm || "0", 10));
  return n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function EventManager({
  events,
  addEvent,
  deleteEvent,
  updateEvent,
  selectedEvent,
  setSelectedEvent,
  locations,
  employees,
  groups
}) {

  const [showAdd, setShowAdd] = useState(false);
  //const [selected, setSelected] = useState(null);
  // form state
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationId, setLocationId] = useState(locations.length? Number(locations[0].id) :null);
  //const [locationId, setLocationId] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [errors, setErrors] = useState({});
/*
  // load saved events
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("events") || "[]");
      setEvents(saved);
    } catch (e) {
      console.error("Failed to parse saved events", e);
      setEvents([]);
    }
  }, []);

  // helper to persist
  const persist = (newList) => {
    setEvents(newList);
    localStorage.setItem("events", JSON.stringify(newList));
  };*/

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Event name is required.";
    if (!date) err.date = "Date is required.";
    if (!startTime) err.startTime = "Start time is required.";
    // if endTime present, ensure it's after startTime
    if (endTime) {
      const s = startTime || "00:00";
      if (s && endTime <= s) err.endTime = "End time must be after start time.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resetForm = () => {
    setName("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocationId(
      locations.length !=null? Number(locations[0].id) : null
    );
    setJobCode("");
    setErrors({});
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      id: Date.now(),
      name: name.trim(),
      date, // YYYY-MM-DD
      startTime: startTime || "",
      endTime: endTime || "",
      locationId: Number(locationId),
      jobCode: jobCode.trim(),
      createdAt: new Date().toISOString(),
      roles: [], // role associations
      staff: [], // reserved for future booking associations
    };

    addEvent(newEvent); // 🔑 parent handles sorting + saving
    resetForm();
    setShowAdd(false);

    /*const updated = [newEvent, ...events].sort((a, b) => {
      if (a.date === b.date) return (a.startTime || "").localeCompare(b.startTime || "");
      return b.date < a.date ? 1 : -1; // newest first
    });

    persist(updated);
    resetForm();
    setShowAdd(false);*/
  };

  /*
  const handleDelete = (id) => {
    if (!confirm("Delete this event? This action cannot be undone.")) return;
    const updated = events.filter((ev) => ev.id !== id);
    persist(updated);
    setSelected(null);
  };*/

  const handleDelete = (id) => {
    if (!confirm("Delete this event? This action cannot be undone.")) return;

  console.log("Deleting event with id:", id);

    deleteEvent(Number(id));
    setSelectedEvent(null);
  };


  return (
    <div className="ev-wrap">
      <div className="ev-header">
        <h2 className="formTitle">Events</h2>
        <div className="ev-actions">
          <button className="btn" onClick={() => setShowAdd(true)}>+ Add Event</button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="ev-empty">No events yet. Click “Add Event” to create one.</div>
      ) : (
        <div className="ev-list">
          {events.map((ev) => (
            <div key={ev.id} className="ev-card" onClick={() => setSelectedEvent(ev)}>
              <div className="ev-left">
                <div className="ev-date">{formatDateISO(ev.date)}</div>
                <div className="ev-time">{formatTime(ev.startTime)} {ev.endTime ? `– ${formatTime(ev.endTime)}` : ""}</div>
              </div>
              <div className="ev-mid">
                <div className="ev-name">{ev.name}</div>
                <div className="ev-meta">{locations.find((l) => l.id === ev.locationId)?.name} • {ev.jobCode || "No job code"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add event modal */}
      {showAdd && (
        <div className="ev-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            <h3>Add Event</h3>
            <form className="ev-form standard-form" onSubmit={handleAdd}>
              <label>Event name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />

              {errors.name && <div className="ev-err">{errors.name}</div>}

              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

              {errors.date && <div className="ev-err">{errors.date}</div>}

              <div className="ev-row">
                <div>
                  <label>Start time</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  {errors.startTime && <div className="ev-err">{errors.startTime}</div>}
                </div>
                <div>
                  <label>End time</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  {errors.endTime && <div className="ev-err">{errors.endTime}</div>}
                </div>
              </div>

              <label>Location</label>
              <select value={locationId} onChange={(e) => setLocationId(Number(e.target.value))}>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>

              <label>Job code</label>
              <input value={jobCode} onChange={(e) => setJobCode(e.target.value)} />

              <div className="ev-form-actions">
                <button type="submit" className="btn">Save event</button>
                <button type="button" className="btn cancel-btn" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View event modal */}
      {selectedEvent && (
        <ViewEventModal
          selected={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDelete}
          onUpdate={updateEvent}
          locations={locations}
          employees={employees}
          groups={groups}
        />
      )}

    </div>
  );
}
