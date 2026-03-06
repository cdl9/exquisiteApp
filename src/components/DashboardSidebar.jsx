import { useState,useEffect } from 'react';
import News from './News';
import CancelForm from './CancelForm';

import { Menu, MessageSquare, User, Users, Calendar, Settings, BookOpenText, Newspaper, HandCoins } from "lucide-react";

import './DashboardSidebar.css';
import exqlogo from '../assets/exqlogo.png';
import EventManager from './EventManager';
import CalendarView from './CalendarView';
import EventsProvider from './EventsProvider';
import AddLocation from './AddLocation.jsx';
import EmployeesManager from './EmployeesManager.jsx';

const menuItems = [
  {
    title: 'Communication',
    items: ['News', 'Referral Incentive', 'HR Updates', 'Guest Comments', 'Send Message'],
    icon: MessageSquare,
  },
  {
    title: 'Policies & Manuals',
    items: ['Employee Handbook', 'Safety Manual', 'Banquet Manual', 'Booking Rules'],
    icon: BookOpenText,
  },
  {
    title: 'Staff Management',
    items: ['Staff List', 'Search Staff', 'Add Staff', 'Groups', 'Cancellation Form'],
    icon: Users,
  },
  {
    title: 'Payroll & Finances',
    items: ['Payroll Info', 'Payroll Forms', 'Buy and Sell'],
    icon: HandCoins,
  },
  {
    title: 'Events & Locations',
    items: ['Calendar', 'Add Event', 'Locations'],
    icon: Calendar,
  },
  {
    title: 'Admin & Account',
    items: ['Admins', 'Settings', 'My Profile', 'Log Out'],
    icon: Settings,
  },
];

function DashboardSidebar() {
  const DEFAULT_LOCATIONS = [
  {
    id: 1,
    name: "42nd St",
    address: "42nd Street, NYC",
    color: "#8181ff",
    active: true,
    notes: ""
  },
  {
    id: 2,
    name: "Wall St",
    address: "Wall Street, NYC",
    color: "#34bfa3",
    active: true,
    notes: ""
  },
  {
    id: 3,
    name: "25 Broadway",
    address: "25 Broadway, NYC",
    color: "#ff8e8e",
    active: true,
    notes: ""
  },
  {
    id: 4,
    name: "South St",
    address: "South Street, NYC",
    color: "#f6c344",
    active: true,
    notes: ""
  },
  {
    id: 5,
    name: "Off-Premise",
    address: "",
    color: "#78beff",
    active: true,
    notes: ""
  }
];

const [employees, setEmployees] = useState([]);
const [groups, setGroups] = useState([]);


const [locations, setLocations] = useState(() => {
  const saved = localStorage.getItem("locations");
  return saved ? JSON.parse(saved) : DEFAULT_LOCATIONS;
});


  useEffect(() => {
    localStorage.setItem("locations", JSON.stringify(locations));
  }, [locations]);



  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [events, setEvents] = useState([]);


  let hoverTimeout = null;

  const handleMouseEnter = (title) => {
    clearTimeout(hoverTimeout);
    setHoveredSection(title);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => setHoveredSection(null), 150);
  };
  
  return (
    <div className="dashboard-container flex-column" >
      <div className="dashboard-header flex-row" style={{ justifyContent:"left",  width:"100%", padding:"1rem"}}>
        <button
          className="btn sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={22} />
        </button>
        <span className="header-title">
          Exquisite Staffing
        </span>
        <img src={exqlogo} alt="Logo" style={{width:"3rem", height:"3rem", marginLeft:"0.5rem"}}/>
        <div className="round-icon" style={{justifySelf:"flex-end", marginLeft:"auto", marginRight:"4.5rem"}}>
          <User size={22} />
        </div>
      </div>

      <div className="flex-row"> 
      <aside 
        className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
     >
        
        
        <nav>
          {menuItems.map((section) => {
          const Icon = section.icon;
          return(
            <div
              key={section.title}
              className={`menu-section ${
                    hoveredSection === section.title ? "active-section" : ""
                }`}
              onMouseEnter={() => handleMouseEnter(section.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="menu-button">
                <Icon size={20}/>
                
                <span>{section.title}</span>
              </button>

              {isSidebarOpen && hoveredSection === section.title && (
                <ul className="submenu">
                  {section.items.map((item) => (
                    <li key={item} className="submenu-item" onClick={() => {setSelectedSection(item)}}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          )}
        </nav>
      </aside>

      <main className="main-content">
        {selectedSection === "News" && <News />}
        {selectedSection === "Cancellation Form" && <CancelForm/>}
        {(selectedSection === "Add Event" || selectedSection === "Calendar") && (
          <EventsProvider locations={locations} activeView={selectedSection} />
        )}
        {selectedSection === "Locations" && <AddLocation locations={locations} setLocations={setLocations} />}

        {selectedSection === "Staff List" && <EmployeesManager 
          employees={employees}
          setEmployees={setEmployees}
          groups={groups}
        />}
      </main>
      </div>
    </div>
  );
}

export default DashboardSidebar;
