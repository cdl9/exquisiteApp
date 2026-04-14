
import React, { useEffect, useState } from "react";
import "../events/Event.css";

export default function EmployeesManager({ employees =[], setEmployees, groups =[]}) {

const [showAdd, setShowAdd] = useState(false);
const [editingEmployee, setEditingEmployee] = useState(null);

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [notes, setNotes] = useState("");

const [groupId, setGroupId] = useState("");
const [errors, setErrors] = useState({});

const validate = () => {
  const err = {};
  if (!firstName.trim()) err.firstName = "First name is required";
  if (!lastName.trim()) err.lastName = "Last name is required";
  if (!email.trim()) err.email = "Email is required";
  if (!phone.trim()) err.phone = "Phone number is required";
  if (!address.trim()) err.address = "Address is required";

  setErrors(err);
  return Object.keys(err).length === 0;
};

const handleSave = (e) => {
  e.preventDefault();
  if (!validate()) return;

  if (editingEmployee) {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              address: address.trim(),
              notes: notes.trim(),
              groupId: groupId ? Number(groupId) : null,
            }
          : emp
      )
    );
  } else {
    setEmployees((prev) => [
      ...prev,
      {
        id: Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        groupId: groupId ? Number(groupId) : null,
        active: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  resetForm();
};

const resetForm = () => {
  setFirstName("");
  setLastName("");
  setEmail("");
  setPhone("");
  setAddress("");
  setNotes("");
  setGroupId("");
  setErrors({});
  setEditingEmployee(null);
  setShowAdd(false);
};
const startEdit = (emp) => {
  setEditingEmployee(emp);
  setFirstName(emp.firstName);
  setLastName(emp.lastName);
  setEmail(emp.email);
  setPhone(emp.phone);
  setAddress(emp.address);
  setNotes(emp.notes);
  setGroupId(emp.groupId || "");
  setShowAdd(true);
};

return(
    <div className="ev-wrap">
        <div className="ev-header">
            <h2 className="formTitle">Employees</h2>
            <div className="ev-actions">
            <button className="btn" onClick={() => setShowAdd(true)}>
                + Add Employee
            </button>
            </div>
        </div>
        <div className="ev-list">
            {employees.length === 0 ? (
                <div className="ev-empty">No employees added yet.</div>
            ):([...employees]
                .sort((a, b) =>
                    a.lastName.localeCompare(b.lastName)
                ).map((emp) => {
                const group = groups.find((g) => g.id === emp.groupId);
                return (
                <div key={emp.id} className="location-card">
                    <div className="location-header">
                    <div className="location-left">
                        <span className="location-name">{emp.lastName}, {emp.firstName}</span>
                        <div style={{fontSize:"0.9rem", fontWeight:"400", color:"#949494"}}>
                            {group && (
                                <div className="employee-group">
                                <span
                                    className="color-dot"
                                    style={{ backgroundColor: group.color }}
                                />
                                {group.name}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="employee-actions">
                    <button className="link-btn" onClick={() => startEdit(emp)}>
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
                    <label>FirstName</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    {errors.firstName && <div className="ev-err">{errors.firstName}</div>}

                    <label>LastName</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    {errors.lastName && <div className="ev-err">{errors.lastName}</div>}

                    <label>Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <div className="ev-err">{errors.email}</div>}

                    <label>Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    {errors.phone && <div className="ev-err">{errors.phone}</div>}

                    <label>Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} />
                    {errors.address && <div className="ev-err">{errors.address}</div>}

                    <label>Notes</label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} />

                    <label>Group</label>
                    <select value={groupId} onChange={(e) => setGroupId(Number(e.target.value))}>
                    {/*<option value="">No group</option>*/}
                    {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                        {g.name}
                        </option>
                    ))}
                    </select>


                    <div className="ev-form-actions">
                        <button type="submit" className="btn">Save Employee</button>
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