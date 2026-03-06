import React, { useState, useEffect } from "react";
import "./CancelForm.css";

const LOCATION_OPTIONS = [
  { id: "42nd-st", label: "42nd St" },
  { id: "wall-st", label: "Wall St" },
  { id: "25-broadway", label: "25 Broadway" },
  { id: "south-st", label: "South St" },
  { id: "off-premise", label: "Off-Premise" },
];

export default function CancelForm() {
  const [date, setDate] = useState("");
  const [locations, setLocations] = useState([]);
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);

  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  // Load previous values optionally (not necessary but helpful in dev)
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("cancelDraft") || "null");
    if (draft) {
      setDate(draft.date || "");
      setLocations(draft.locations || []);
      setType(draft.type || "");
      setReason(draft.reason || "");
      setAcknowledge(draft.acknowledge || false);
    }
  }, []);

  // Save draft so user doesn't lose data accidentally (optional)
  useEffect(() => {
    const draft = { date, locations, type, reason, acknowledge };
    localStorage.setItem("cancelDraft", JSON.stringify(draft));
  }, [date, locations, type, reason, acknowledge]);

  const toggleLocation = (locId) => {
    setLocations((prev) =>
      prev.includes(locId) ? prev.filter((l) => l !== locId) : [...prev, locId]
    );
  };

  const validate = () => {
    const errs = {};
    if (!date) errs.date = "Please select the event date.";
    if (!locations.length) errs.locations = "Select at least one location.";
    if (!type) errs.type = "Select a type (Breakfast / Lunch / Dinner).";
    if (!acknowledge) errs.acknowledge = "You must acknowledge the disclaimer.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearForm = () => {
    setDate("");
    setLocations([]);
    setType("");
    setReason("");
    setAcknowledge(false);
    setErrors({});
    localStorage.removeItem("cancelDraft");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const entry = {
      id: Date.now(),
      date,
      locations,
      type,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    // save to localStorage (simple persistence until you have a backend)
    const existing = JSON.parse(localStorage.getItem("cancellations") || "[]");
    localStorage.setItem("cancellations", JSON.stringify([entry, ...existing]));

    setShowConfirm(true);
    clearForm();
  };

  return (
    <div className="cancel-form-wrap">
      
    <div className="modal-content">
      <h1 className="cf-title">Cancellation Form</h1>
      <form className="add-news-form standard-form" onSubmit={handleSubmit} noValidate>
        {/* Event date */}
        <div className="cf-disclaimer">
            Dinner events - Cancel by 10AM EST on the day of the event.
            <br></br>Breakfast/Lunch events - Cancel by 3PM EST on the day before the event.
            <br></br>
            <br></br>

        </div>
        <div className="cf-row">
          <label htmlFor="event-date">Event Date *</label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
            className="date-input"
          />
          {errors.date && <div className="cf-error">{errors.date}</div>}
        </div>

        {/* Locations */}
        <div className="cf-row">
          <label>Location(s) *</label>
          <div className="cf-locations">
            {LOCATION_OPTIONS.map((loc) => (
              <label key={loc.id} className="cf-checkbox">
                <input
                  type="checkbox"
                  name="locations"
                  value={loc.id}
                  checked={locations.includes(loc.id)}
                  onChange={() => toggleLocation(loc.id)}
                />
                <span>{loc.label}</span>
              </label>
            ))}
          </div>
          {errors.locations && <div className="cf-error">{errors.locations}</div>}
        </div>

        {/* Type */}
        <div className="cf-row">
          <label>Type *</label>
          <div className="cf-radios">
            <label className="cf-radio">
              <input
                type="radio"
                name="type"
                value="Breakfast"
                checked={type === "Breakfast"}
                onChange={(e) => setType(e.target.value)}
                className="radio-input"
              />
              <span className="span-cancel-form">Breakfast</span>
            </label>
            <label className="cf-radio">
              <input
                type="radio"
                name="type"
                value="Lunch"
                checked={type === "Lunch"}
                onChange={(e) => setType(e.target.value)}
              />
              <span>Lunch</span>
            </label>
            <label className="cf-radio">
              <input
                type="radio"
                name="type"
                value="Dinner"
                checked={type === "Dinner"}
                onChange={(e) => setType(e.target.value)}
              />
              <span>Dinner</span>
            </label>
          </div>
          {errors.type && <div className="cf-error">{errors.type}</div>}
        </div>

        {/* Reason */}
        <div className="cf-row">
          <label htmlFor="reason">Reason (optional)</label>
          <textarea
            id="reason"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional — Describe your reason for cancellation"
          />
        </div>

        {/* Disclaimers */}
        <div className="cf-row cf-disclaimers">
          <div className="cf-disclaimer">     
            <strong>Before Deadline:</strong> 3 prior notice cancellations within 180 days may result in a red flag.            
          </div>
          <div className="cf-disclaimer">
            <strong>After Deadline:</strong> 3 unexcused last minute cancellations within 90 days may result in a red flag.
          </div>

          <label className="cf-checkbox ack">
            <input
              type="checkbox"
              checked={acknowledge}
              onChange={(e) => setAcknowledge(e.target.checked)}
            />
            <span>I acknowledge the policy and operational notes above. *</span>
          </label>

          {errors.acknowledge && <div className="cf-error">{errors.acknowledge}</div>}
        </div>

        {/* Actions */}
        <div className="cf-actions">
          <button type="submit" className="btn">
            Submit Cancellation
          </button>
          <button
            type="button"
            className="btn cancel-btn"
            onClick={() => {
              clearForm();
            }}
          >
            Reset
          </button>
        </div>
      </form>
      </div>
      
      {/* Confirmation modal */}
      {showConfirm && (
        <div
          className="cf-modal-overlay"
          onClick={() => setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancellation Recorded</h3>
            <p>Thanks — this cancellation has been saved. A manager will be notified if required.</p>
            <div className="cf-actions">
              <button onClick={() => setShowConfirm(false)} className="cf-submit">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
