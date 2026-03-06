// AddLocation.jsx

import React, { useEffect, useState } from "react";
import "./Event.css";

const COLOR_PALETTE = [
  "#8181ff", // soft blue
  "#34bfa3", // teal
  "#ff8e8e", // coral
  "#f6c344", // yellow
  "#78beff", // light blue
  "#a18aff", // lavender
  "#ffb347", // warm orange
];


function LocationCard({ location, onEdit, onDelete, onUpdateLocation }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="location-card">
      {/* Header */}
      <div
        className="location-header"
        onClick={() => setOpen(!open)}
      >
        <div className="location-left">
          <span
            className="color-dot"
            style={{ backgroundColor: location.color }}
          />
          <span className="location-name">{location.name}</span>
          <div >
              <span style={{fontSize:"0.9rem", fontWeight:"400", color:"#949494"}}>{location.address?location.address:"No Address"}</span>
          </div>
        </div>

        <span className="chevron">
          {open ? "▴" : "▾"}
        </span>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="location-details">
          <div className="location-meta" style={{color:"black"}}>
            <div>
              <span>{location.address?location.address:"No Address"}</span>
            </div>
            {/*<div className="location-color-row">
              <label>Color</label>
              <input
                type="color"
                value={location.color}
                onChange={(e) =>
                  onUpdateLocation(location.id, { color: e.target.value })
                }
              />
            </div>
*/}
            {/* future-proofing */}
            {location.notes && (
              <div>
                <strong>Notes:</strong> {location.notes}
              </div>
            )}
          </div>

          <div className="location-actions">
            <button
              className="link-btn"
              onClick={() => onEdit(location)}
            >
              Edit
            </button>
            <button
              className="link-btn danger"
              onClick={() => onDelete(location)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




export default function AddLocation({
  locations,
  setLocations,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0]);

  const [errors, setErrors] = useState({});
  const [editingLocation, setEditingLocation] = useState(null);

 
  const startEdit = (loc) => {
  setEditingLocation(loc);
  setName(loc.name);
  setAddress(loc.address || "");
  setColor(loc.color || COLOR_PALETTE[0]);
  setShowAdd(true);
};


  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Location name is required.";
    if (!address.trim()) err.address = "Address is required.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setColor(COLOR_PALETTE[0]);
    setErrors({});
    setEditingLocation(null);
  };

const handleSave = (e) => {
  e.preventDefault();
  if (!validate()) return;

  if (editingLocation) {
    // EDIT
    const updated = locations.map((l) =>
      l.id === editingLocation.id
        ? { ...l, name: name.trim(), address: address.trim(), color: color}
        : l
    );

    setLocations(updated);
  } else {
    // ADD
    const newLocation = {
      id: Date.now(),
      name: name.trim(),
      address: address.trim(),
      color,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setLocations([...locations, newLocation]);
  }

  resetForm();
  setEditingLocation(null);
  setShowAdd(false);
};

const handleDelete = (loc) => {
  console.log("Delete clicked)");
  const confirmed = window.confirm(
    `Delete "${loc.name}"? This cannot be undone.`
  );
  if (!confirmed) return;

  setLocations(locations.filter((l) => l.id !== loc.id));
};

const onUpdateLocation = (id, updates) => {
  setLocations((prev) =>
    prev.map((l) =>
      l.id === id ? { ...l, ...updates } : l
    )
  );
};

  return (
    <div className="ev-wrap">
      <div className="ev-header">
        <h2 className="formTitle">Locations</h2>
        <div className="ev-actions">
          <button className="btn" onClick={() => setShowAdd(true)}>
            + Add Location
          </button>
        </div>
      </div>

      {locations.length === 0 ?(
        <div className="ev-empty">
          No locations yet. Click “Add Location” to create one.
        </div>
      ):
      (
        <div className="ev-list">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={startEdit}
              onDelete={handleDelete}
              onUpdateLocation={onUpdateLocation}
            />
          ))}
        </div>
      )
      }

      {showAdd && (
        <div className="ev-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>

            <h3>{editingLocation ? "Edit Location" : "Create Location"}</h3>


            <form className="ev-form standard-form" onSubmit={handleSave}>
              <label>Location name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div className="ev-err">{errors.name}</div>}

              <label>Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} />
              {errors.address && <div className="ev-err">{errors.address}</div>}

              <div className="color-palette">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch ${c === color ? "selected" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>

              <div className="ev-form-actions">
                <button type="submit" className="btn">Save Location</button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => {
                    setShowAdd(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
