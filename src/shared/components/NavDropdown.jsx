import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavDropdown.css';

/**
 * NavDropdown Component
 * Reusable dropdown menu for navbar
 * Used for Math ▼, Language Arts ▼, Lab ▼
 */
export default function NavDropdown({ label, icon, items = [], activeSubject = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubject, setOpenSubject] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
    setOpenSubject(itemLabel);
  };

  return (
    <div className="nav-dropdown" ref={dropdownRef}>
      <button
        className={`nav-dropdown-button ${activeSubject === label.toLowerCase() ? 'active' : ''}`}
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {icon && <span className="nav-dropdown-icon">{icon}</span>}
        <span>{label}</span>
        <span className={`nav-dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="nav-dropdown-menu" role="menu">
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

                  {isDisabled && <span className="disabled-badge">🔒</span>}
                  {hasSubitems && <span className="arrow-right">→</span>}
                </button>

                {/* Submenu (nested kingdoms) */}
                {hasSubitems && isOpen && openSubject === item.label && (
                  <div className="nav-sub-menu">
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
                        {subitem.disabled && <span className="disabled-badge">🔒</span>}
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
