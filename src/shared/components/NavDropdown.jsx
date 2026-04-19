import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavDropdown.css';

/**
 * NavDropdown Component
 * Reusable dropdown menu for navbar
 * Used for Math ▼, Language Arts ▼, Lab ▼
 */
export default function NavDropdown({ label, icon, items = [], activeSubject = null, hideIcon = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubject, setOpenSubject] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const submenuCloseTimerRef = useRef(null);
  const navigate = useNavigate();

  // Calculate menu position based on button location
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: buttonRect.bottom + 4,
        left: buttonRect.left,
      });
    }
  }, [isOpen]);

  // Calculate submenu position
  useEffect(() => {
    if (openSubject && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewport = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position to the right, but check if it fits
      let left = menuRect.right + 8;
      if (left + 200 > viewport) {
        // Not enough space, position to the left instead
        left = Math.max(8, menuRect.left - 200 - 8);
      }
      
      // Ensure top position respects safe areas
      let top = Math.max(menuRect.top, 56);
      
      // Check if menu would exceed viewport height
      if (top + 300 > viewportHeight) {
        top = Math.max(56, viewportHeight - 300 - 8);
      }
      
      setSubmenuPosition({
        top: top,
        left: left,
      });
    }
  }, [openSubject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Also check if we're not clicking on any submenus
        const submenus = document.querySelectorAll('.nav-sub-menu');
        let clickedSubmenu = false;
        submenus.forEach(submenu => {
          if (submenu.contains(event.target)) {
            clickedSubmenu = true;
          }
        });
        if (!clickedSubmenu) {
          setIsOpen(false);
          setOpenSubject(null);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (submenuCloseTimerRef.current) {
        clearTimeout(submenuCloseTimerRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
      setIsOpen(false);
      setOpenSubject(null);
    }
  };

  const handleSubjectHover = (itemLabel) => {
    // Cancel any pending close when hovering
    if (submenuCloseTimerRef.current) {
      clearTimeout(submenuCloseTimerRef.current);
      submenuCloseTimerRef.current = null;
    }
    
    if (itemLabel) {
      setOpenSubject(itemLabel);
    } else {
      // Only delay closing if we're moving away from an item with subitems
      submenuCloseTimerRef.current = setTimeout(() => {
        setOpenSubject(null);
        submenuCloseTimerRef.current = null;
      }, 200); // Increased delay to 200ms for better UX
    }
  };

  return (
    <div className={`nav-dropdown ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={`nav-dropdown-button ${activeSubject === label.toLowerCase() ? 'active' : ''}`}
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {!hideIcon && icon && <span className="nav-dropdown-icon">{icon}</span>}
        <span>{label}</span>
        <span className={`nav-dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="nav-dropdown-menu" 
          role="menu"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          {items.map((item, index) => {
            const isDisabled = item.disabled;
            const hasSubitems = item.items && item.items.length > 0;

            return (
              <div key={`${item.label}-${index}`} className="nav-dropdown-item-wrapper">
                <button
                  className={`nav-dropdown-item ${isDisabled ? 'disabled' : ''} ${
                    openSubject === item.label ? 'hovered' : ''
                  }`}
                  onClick={() => !isDisabled && handleItemClick(item)}
                  onMouseEnter={() => hasSubitems && handleSubjectHover(item.label)}
                  onMouseLeave={() => hasSubitems && handleSubjectHover(null)}
                  disabled={isDisabled}
                  role="menuitem"
                  aria-disabled={isDisabled}
                >
                  <span className="nav-dropdown-item-iconlabel">
                    {item.icon && <span className="item-icon">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>

                  {hasSubitems && <span className="arrow-right">→</span>}
                </button>

                {/* Submenu (nested kingdoms) */}
                {hasSubitems && isOpen && openSubject === item.label && (
                  <div 
                    className="nav-sub-menu"
                    style={{
                      top: `${submenuPosition.top}px`,
                      left: `${submenuPosition.left}px`,
                    }}
                    onMouseEnter={() => {
                      if (submenuCloseTimerRef.current) {
                        clearTimeout(submenuCloseTimerRef.current);
                        submenuCloseTimerRef.current = null;
                      }
                    }}
                    onMouseLeave={() => handleSubjectHover(null)}
                  >
                    {item.items.map((subitem, subindex) => (
                      <button
                        key={`${subitem.label}-${subindex}`}
                        className={`nav-sub-item ${subitem.disabled ? 'disabled' : ''}`}
                        onClick={() => !subitem.disabled && handleItemClick(subitem)}
                        disabled={subitem.disabled}
                        role="menuitem"
                      >
                        <span className="sub-item-label">
                          {subitem.icon && <span className="item-icon">{subitem.icon}</span>}
                          {subitem.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
