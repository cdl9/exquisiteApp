import { useState,useEffect, useRef } from 'react';
import "./RoleManager.css";
import Dropdown from '../shared/Dropdown';

export default function RoleCard({ role, event, updateEvent, employees, groups }) {

  const [selectedEmployee, setSelectedEmployee] = useState("");
  //const containerRef = useRef(null);
  //const roleMenuRef = useRef(null)

  const assignedIds = (role.assignments || []).map(a => a.employeeId);
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [showInlineAssign, setShowInlineAssign] = useState(false);
  const [roleEditModalOpen, setRoleEditModalOpen] = useState(false);
  const counter=0;
  const confirmedCount = (role.assignments || []).filter(
    a => a.status === "confirmed"
  ).length
  const assignments = role.assignments || []

  const [animationKey, setAnimationKey] = useState(0)

  const groupedAssignments = {
    confirmed: assignments.filter(a => a.status === "confirmed"),
    pending: assignments.filter(a => a.status === "pending"),
    scheduled: assignments.filter(a => a.status === "scheduled"),
    declined: assignments.filter(a => a.status === "declined"),
  }

  // helper to assign employee by id
  const assignEmployee = (employeeId, status ="scheduled") => {
    //This could be removed if we want to allow overbooking, but for now let's enforce staffNeeded limit
    if (confirmedCount >= role.staffNeeded) {
      alert("Role is already fully staffed")
      return
    }

    const alreadyAssigned = (role.assignments || []).some(
      a => a.employeeId === employeeId
    )

    if (alreadyAssigned) {
      alert("Employee already assigned to this role")
      return
    }



    const newAssignment = {
      id: Date.now(),
      employeeId,
      status //"scheduled" //confirmed" | "pending" | "declined"
    }

    const updatedRole = {
      ...role,
      assignments: [
        ...(role.assignments || []),
        newAssignment
      ]
    }

    const updatedRoles = event.roles.map(r =>
      r.id === role.id ? updatedRole : r
    )

    updateEvent({
      ...event,
      roles: updatedRoles
    })

  }
  // helper to remove assignment by id
  const removeAssignment = (assignmentId) => {
  const updatedRole = {
    ...role,
    assignments: (role.assignments || []).filter(
      a => a.id !== assignmentId
    )
  }

  const updatedRoles = event.roles.map(r =>
    r.id === role.id ? updatedRole : r
  )

  updateEvent({
    ...event,
    roles: updatedRoles
  })
}
  
//helper to update assignment status

const updateAssignmentStatus = (assignmentId, status) => {
  const updatedRole = {
    ...role,
    assignments: role.assignments.map(a =>
      a.id === assignmentId ? { ...a, status } : a
    )
  }

  updateEvent({
    ...event,
    roles: event.roles.map(r =>
      r.id === role.id ? updatedRole : r
    )
  })
}
//helper to send job offer (set all scheduled to pending)

const sendJobOffer = () => {
  const updatedRole = {
    ...role,
    assignments: (role.assignments || []).map(a =>
      a.status === "scheduled" ? { ...a, status: "pending" } : a
    )
  }

  const updatedRoles = event.roles.map(r =>
    r.id === role.id ? updatedRole : r
  )

  updateEvent({ ...event, roles: updatedRoles })
  setRoleMenuOpen(false)
}

const removeRole = (roleId) => {
  const updatedRoles = event.roles.filter(r => r.id !== roleId)
  updateEvent({ ...event, roles: updatedRoles })
}

const editRole = () => {
  setRoleEditModalOpen(true)
}

//helper to render employees

const renderAssignmentGroup = (title, list) => {
  if (!list.length) return null

  return (
    <div className="assignment-group">
      <div className="group-title">{title}</div>

      {list.map(a => {
        const emp = employees.find(e => e.id === a.employeeId)
        const isActive = activeAssignmentId === a.id
        const group = groups.find(g => g.id === emp?.groupId)
        return (
          <div key={a.id || a.employeeId}>
            <Dropdown
              isOpen={isActive}
              animationKey={animationKey}
              setIsOpen={(open) => {
                if (open) {
                  if (activeAssignmentId === a.id) {
                    // 🔥 force reset
                    setActiveAssignmentId(null)

                    setTimeout(() => {
                      setActiveAssignmentId(a.id)
                    }, 0)
                  } else {
                    setActiveAssignmentId(a.id)

                  }
                } else {
                  if (activeAssignmentId === a.id) {
                  setActiveAssignmentId(null)
                  }
                }
              }}
              fullWidth={true}
              trigger={<div className="assignment-item gap" style={{ cursor: "pointer" }}>
                          <div>{emp ? `${emp.lastName} ${emp.firstName}` : "Unknown"}</div>
                          <div>{group? ` ${group.name}` : ""}</div>
                        </div>}
            >
                <button
                      onClick={(e) => {
                        if (confirm("Remove this employee from role?")) {
                          removeAssignment(a.id)
                          setActiveAssignmentId(null)
                        }
                      }}
                    >
                      Remove
                    </button>

                    <button
                      onClick={(e) => {
                        updateAssignmentStatus(a.id, "confirmed")
                        setActiveAssignmentId(null)
                      }}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={(e) => {
                        updateAssignmentStatus(a.id, "declined")
                        setActiveAssignmentId(null)
                      }}
                    >
                      Decline
                    </button>

                    <button
                      onClick={(e) => {
                        console.log("View profile for employee id:", a.employeeId)

                        setActiveAssignmentId(null)
                      }}>
                      View Profile
                    </button>
            </Dropdown>
          </div>
        )
      })}
    </div>
  )
}

  return (
    <div className="role-card">

      <div className="role-header">
        <div className="role-info">
          <div><strong>{role.name}</strong></div>
          <div><strong>{role.callTime}</strong></div>
        </div>
        <div>
          Assigned: {confirmedCount} / {role.staffNeeded}
        </div>
        {/* Role Actions Dropdown */}
        <Dropdown
          isOpen={roleMenuOpen}
          setIsOpen={setRoleMenuOpen}
          trigger={<button className="role-menu-trigger">⋮</button>}
        >
          <button onClick={() => {
            setShowInlineAssign(true)
            setRoleMenuOpen(false)
          }}>
            Schedule Staff
          </button>

          <button onClick={() => {
            setShowInlineAssign(true)
            setRoleMenuOpen(false)
          }}>
            Book Staff
          </button>

          <button onClick={() => sendJobOffer()}>
            Send Job Offer
          </button>

          <button onClick={() => {
            editRole()
            setRoleMenuOpen(false)
          }}>
            Edit Role
          </button>

          <button
            onClick={() => {
              if (confirm("Remove this role?")) removeRole(role.id)
            }}
          >
            Remove Role
          </button>
        </Dropdown>
      </div>

      <div className='flex-row gap'>
        <div> Self Notes: {role.selfNotes && 
          <div>{role.selfNotes}</div>
          }
        </div>
        
        <div>Staff Notes: {role.staffNotes && 
          <div>{role.staffNotes}</div>
          }
        </div>
      </div>

      <div className="assignments-list">
        {renderAssignmentGroup("Confirmed", groupedAssignments.confirmed)}
        {renderAssignmentGroup("Pending", groupedAssignments.pending)}
        {renderAssignmentGroup("Scheduled", groupedAssignments.scheduled)}
        {renderAssignmentGroup("Declined", groupedAssignments.declined)}
      </div>
{
      showInlineAssign && (<div className="assign-controls">

        <select
            value={selectedEmployee}
            onChange={(e)=>setSelectedEmployee(e.target.value)}
        >
            <option value="" style={{ background: "lightgray"}}>Select employee</option>


            {employees
              .filter(emp => !assignedIds.includes(emp.id))
              .map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.lastName} {emp.firstName}
                </option>
            ))}

        </select>

        <button
            onClick={()=>{
            if(selectedEmployee){
                assignEmployee(Number(selectedEmployee),"scheduled")
                setSelectedEmployee("")
            }
            }}
        >
            Schedule
        </button>
        <button
          onClick={()=>{
            if(selectedEmployee){
              assignEmployee(Number(selectedEmployee), "confirmed")
              setSelectedEmployee("")
            }
          }}
        >
          Book
        </button>    
      </div>
      )
}
    </div>
  )
}