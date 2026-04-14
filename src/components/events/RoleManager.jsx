import React, { useEffect, useState } from "react";
import "./Event.css";
import RoleCard from "./RoleCard";

export default function RoleManager({
  event,
  updateEvent,
  groups,
  employees
}){

const [showAdd, setShowAdd] = useState(false)

const [roleName, setRoleName] = useState("")
const [callTime, setCallTime] = useState("")
const [staffNeeded, setStaffNeeded] = useState(1)
const [selfNotes, setSelfNotes] = useState("")
const [staffNotes, setStaffNotes] = useState("")
const [groupsAllowed, setGroupsAllowed] = useState([])

const [radioSendJob, setRadioSendJob] = useState("");
const [radioAvailable, setRadioAvailable] = useState("");


const handleAdd = (e) => {
  e.preventDefault();   // ⭐ prevents browser submit
  const newRole = {
    id: Date.now(),
    name: roleName,
    callTime,
    staffNeeded: Number(staffNeeded),
    selfNotes,
    staffNotes,
    groupsAllowed,
    assignments: [],

    radioSendJob,
    radioAvailable
  }

  const updatedEvent = {
    ...event,
    roles: [...(event.roles || []), newRole]
  }

  updateEvent(updatedEvent)

  resetForm()
}

const resetForm = () => {
  setRoleName("")
  setCallTime("")
  setStaffNeeded(1)
  setSelfNotes("")
  setStaffNotes("")
  setGroupsAllowed([])
  setShowAdd(false)
  setRadioSendJob("")
  setRadioAvailable("")
}

return(
    <div className="ev-wrap">
        <div className="ev-header">
            <h2 className="formTitle">Roles</h2>
            <div className="ev-actions">
            <button className="btn" onClick={() => setShowAdd(true)}>
                + Add Job
            </button>
            </div>
        </div>
        <div className="ev-list">
            {(event.roles || []).length === 0 ? (
            <p>No jobs added</p>
            ) : (
            event.roles.map(role => (
                <RoleCard
                key={role.id}
                role={role}
                event={event}
                updateEvent={updateEvent}
                employees={employees}
                groups={groups}
                />
            ))
            )}
            {showAdd && (
            <div className="ev-modal-overlay" onClick={() => setShowAdd(false)}>
            <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>

                <h3>Add Role</h3>
                <form className="ev-form standard-form" onSubmit={handleAdd}>
                    <div style={{marginBottom: "10px", flexDirection:"column", display:"flex"}}>
                        <label>Position</label>
                        <input
                        required
                        value={roleName}
                        onChange={(e)=>setRoleName(e.target.value)}
                        className="input-form-field"
                    // style={{color:"red"}}
                        />
                    </div>
                    <div style={{marginBottom: "10px", flexDirection:"column", display:"flex"}}>
                        <label>Call Time</label>
                        <input
                        required
                        type="time"
                        value={callTime}
                        onChange={(e)=>setCallTime(e.target.value)}
                        />
                    </div>
                    <div style={{marginBottom: "10px", flexDirection:"column", display:"flex"}}>
                        <label>Staff Needed</label>
                        <input
                        type="number"
                        min="1"
                        value={staffNeeded}
                        onChange={(e)=>setStaffNeeded(e.target.value)}
                        />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <label>Self  Notes</label>
                        <textarea
                        value={selfNotes}
                        onChange={(e)=>setSelfNotes(e.target.value)}
                        />
                    </div>  
                    <div style={{marginBottom: "10px"}}>
                        <label>Staff Notes</label>
                        <textarea
                        value={staffNotes}
                        onChange={(e)=>setStaffNotes(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{marginBottom: "10px"}}>
                            <label>When should this go out?</label>
                            <label className="cf-radio">
                                <input
                                    type="radio"
                                    name="radioSendJob"
                                    value="Now"
                                    checked={radioSendJob === "Now"}
                                    onChange={(e) => setRadioSendJob(e.target.value)}
                                    className="radio-input"
                                />
                                <span className="span-cancel-form">Now</span>
                            </label>
                            <label className="cf-radio">
                                <input
                                    type="radio"
                                    name="radioSendJob"
                                    value="Later"
                                    checked={radioSendJob === "Later"}
                                    onChange={(e) => setRadioSendJob(e.target.value)}
                                />
                                <span>Later</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <div style={{marginBottom: "10px"}}>
                            <label>Available until?</label>
                            <label className="cf-radio">
                                <input
                                    type="radio"
                                    name="radioAvailable"
                                    value="Now"
                                    checked={radioAvailable === "Now"}
                                    onChange={(e) => setRadioAvailable(e.target.value)}
                                    className="radio-input"
                                />
                                <span className="span-cancel-form">Now</span>
                            </label>
                            <label className="cf-radio">
                                <input
                                    type="radio"
                                    name="radioAvailable"
                                    value="Later"
                                    checked={radioAvailable === "Later"}
                                    onChange={(e) => setRadioAvailable(e.target.value)}
                                />
                                <span>Later</span>
                            </label>
                        </div>
                    </div>

                    <div className="ev-form-actions">
                        <button type="submit" className="btn">Save Job</button>
                        <button type="button" className="btn cancel-btn" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</button>
                    </div>
                </form>
            </div>
            </div>

            )}
        </div>
    </div>
)
}