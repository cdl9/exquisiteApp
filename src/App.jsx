import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardSidebar from './components/layout/DashboardSidebar.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App" style={{backgroundColor:"red",margin:"0"}}>
        <DashboardSidebar />
      </div>
    </>
  )
}

export default App
