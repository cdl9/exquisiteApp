
import React, { useEffect, useState } from "react";
import "../events/Event.css";

export default function GroupsManager({ groups =[], setGroups}) {

const [showAdd, setShowAdd] = useState(false);
const [editingGroup, setEditingGroup] = useState(null);

const [name, setName] = useState("");
const [notes, setNotes] = useState("");

const [errors, setErrors] = useState({});

const validate = () => {
  const err = {};
  if (!name.trim()) err.name = "Name is required";

  setErrors(err);
  return Object.keys(err).length === 0;
};

const handleSave = (e) => {
  e.preventDefault();
  if (!validate()) return;

  if (editingGroup) {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === editingGroup.id
          ? {
              ...group,
              name: name.trim(),
              notes: notes.trim(),
            }
          : group
      )
    );
  } else {
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        notes: notes.trim(),
        active: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  resetForm();
};

const resetForm = () => {
  setName("");
  setNotes("");
  setErrors({});
  setEditingGroup(null);
  setShowAdd(false);
};
const startEdit = (group) => {
  setEditingGroup(group);
  setName(group.name);
  setNotes(group.notes);
  setShowAdd(true);
};

return(
    <div className="ev-wrap">
        <div className="ev-header">
            <h2 className="formTitle">Groups</h2>
            <div className="ev-actions">
            <button className="btn" onClick={() => setShowAdd(true)}>
                + Add Group
            </button>
            </div>
        </div>
        <div className="ev-list">
            {groups.length === 0 ? (
                <div className="ev-empty">No groups added yet.</div>
            ):(groups.map((group) => {
                //const group = groups.find((g) => g.id === emp.groupId);
                return (
                <div key={group.id} className="location-card">
                    <div className="location-header">
                        <div className="location-left">
                            <span className="location-name">{group.name}</span>
                            <div style={{fontSize:"0.9rem", fontWeight:"400", color:"#949494"}}>{group.notes}</div>
                        
                        </div>

                        <div className="employee-actions">
                        <button className="link-btn" onClick={() => startEdit(group)}>
                            Edit
                        </button>
                        </div>
                    </div>
                </div>
                );
            })
            )}
            {showAdd && (
                <div className="ev-modal-overlay" onClick={() => setShowAdd(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>

                    {/*<h3>{editingLocation ? "Edit Location" : "Create Location"}</h3>*/}


                    <form className="ev-form standard-form" onSubmit={handleSave}>
                    <label>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <div className="ev-err">{errors.name}</div>}
                   
                    <label>Notes</label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} />


                    <div className="ev-form-actions">
                        <button type="submit" className="btn">Save Group</button>
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
    </div>


)


}