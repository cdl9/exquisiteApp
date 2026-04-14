import React, { useState, useEffect } from "react";
import "./Event.css";
import { useRef } from "react";
import RoleManager from "./RoleManager";
import {createPortal} from "react-dom";

function formatTime(t) {
  if (!t) return "";
  // expects "HH:MM" 24-hour
  const [hh, mm] = t.split(":");
  const n = new Date();
  n.setHours(parseInt(hh, 10), parseInt(mm || "0", 10));
  return n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatDateISO(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US");
}

export default function ViewEventModal({
  selected,
  onClose,
  onDelete,
  onUpdate,
  locations,
  employees,
  groups
}) {

  if (!selected) return null;

  const [errors, setErrors] = useState({});
  const nameRef = useRef(null); 
  const dateRef = useRef(null);
  const startTimeRef = useRef(null);


  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationId, setLocationId] = useState(locations.length? Number(locations[0].id) :null);
  const [jobCode, setJobCode] = useState("");



  // Prefill when selected changes
  useEffect(() => {
    resetFormFromSelected();
  }, [selected]);

  useEffect(() => {
    setIsDirty(hasChanges());
  }, [name, date, startTime, endTime, locationId, jobCode]);


  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (typeof onUpdate !== "function") {
        console.error("onUpdate is not a function");
        return;
        }

    const updatedEvent = {
      ...selected,
      name: name.trim(),
      date,
      startTime,
      endTime,
      locationId,
      jobCode: jobCode.trim(),
    };
    delete updatedEvent.location;

    onUpdate(updatedEvent);
    console.log("Event updated:", updatedEvent);
    resetFormFromSelected();
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const validate = () => {
    const err = {};

    if (!name.trim()) err.name = "Event name is required.";
    if (!date) err.date = "Date is required.";
    if (!startTime) err.startTime = "Start time is required.";

    if (endTime && startTime && endTime <= startTime) {
        err.endTime = "End time must be after start time.";
    }

    setErrors(err);
    if (err.name) nameRef.current?.focus();
    else if (err.date) dateRef.current?.focus();
    else if (err.startTime) startTimeRef.current?.focus();

    return Object.keys(err).length === 0;
  };

  const resetFormFromSelected = () => {
    if (!selected) return;
    setName(selected.name);
    setDate(selected.date);
    setStartTime(selected.startTime || "");
    setEndTime(selected.endTime || "");
    setLocationId(Number(selected.locationId) || null);
    setJobCode(selected.jobCode || "");
    };
  const hasChanges = () => {
    if (!selected) return false;

    return (
        name !== selected.name ||
        date !== selected.date ||
        startTime !== (selected.startTime || "") ||
        endTime !== (selected.endTime || "") ||
        locationId !== (selected.locationId || null) ||
        jobCode !== (selected.jobCode || "")
    );
    };
  const attemptClose = () => {
    if (isEditing && isDirty) {
        const confirmClose = window.confirm(
        "You have unsaved changes. Discard them?"
        );
        if (!confirmClose) return;
    }

    resetFormFromSelected();
    setErrors({});
    setIsEditing(false);
    onClose();
    };

  const selectedLocation = locations.find(
    (l) => Number(l.id) === Number(selected.locationId)
  )|| locations[0];

  return createPortal(
    <div className="ev-modal-overlay" onClick={attemptClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={attemptClose}>×</button>

        {!isEditing ? (
          <>
            <h3>{selected.name}</h3>

            <div className="ev-detail-row">
              <strong>Date:</strong> {formatDateISO(selected.date)}
            </div>

            <div className="ev-detail-row">
              <strong>Time:</strong> {formatTime(selected.startTime)} {selected.endTime ? `– ${formatTime(selected.endTime)}` : ""}
            </div>

            <div className="ev-detail-row">
              <strong>Location:</strong> {selectedLocation?.name || "—"}
            </div>

            <div className="ev-detail-row">
              <strong>Job code:</strong> {selected.jobCode || "(none)"}
            </div>
            <RoleManager
              event={selected}
              updateEvent={onUpdate}
              employees={employees}
              groups={groups}
            />
            <div className="modal-actions">
              <button className="btn" onClick={() => {
                setIsEditing(true)
                resetFormFromSelected();
                setErrors({});
              }}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => {
                if (window.confirm("Delete this event?")) {
                    onDelete(selected.id);
                    onClose();
                }
                }}
            >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Edit Event</h3>
            <form className="ev-form standard-form" onSubmit={handleSave} >

            <label>Event name</label>
            <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <div className="ev-err">{errors.name}</div>}

            <label>Date</label>
            <input ref={dateRef} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {errors.date && <div className="ev-err">{errors.date}</div>}

            <div className="ev-row">
              <div>
                <label>Start time</label>
                <input ref={startTimeRef} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
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
                <option value="">— Select location —</option>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>

            <label>Job code</label>
            <input value={jobCode} onChange={(e) => setJobCode(e.target.value)} />

            <div className="ev-form-actions">
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn cancel-btn" 
                onClick={attemptClose}>
                        Cancel
              </button>
            </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
