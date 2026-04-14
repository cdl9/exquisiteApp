import { useEffect, useRef } from "react"
import "./Dropdown.css"

export default function Dropdown({ trigger, isOpen, setIsOpen, children, fullWidth = false, animationKey }) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsOpen])

  return (
    <div className={`dropdown ${fullWidth ? "dropdown-full" : ""}`} ref={dropdownRef}>
      <div 
        className="dropdown-trigger"
        key={animationKey}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(prev => !prev)
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className="role-menu"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}