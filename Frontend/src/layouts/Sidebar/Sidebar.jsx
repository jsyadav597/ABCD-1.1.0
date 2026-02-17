import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = ({ collapsed, onCloseSidebar }) => {
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  // Try to fetch user name; if backend not available, keep 'User'
  // 
  const userRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle menu item click
  const handleMenuItemClick = () => {
    // Close user panel when menu item is clicked
    setUserOpen(false);
    // Close sidebar on mobile when menu item is clicked
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  // Handle user panel outside click
  const handleUserPanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <nav className={`menu-bar ${collapsed ? "open" : ""}`}>
      <ul className="menu">
        <li>
          <Link to="/users" onClick={handleMenuItemClick}>
            <span className="material-icons">person</span>
            <span className="menu-text">User</span>
          </Link>
        </li>

        {/* INVENTORY (HOVER) */}
        <li className="dropdown has-submenu">
          <Link type="button" className="menu-btn menu-link">
           
            <span className="material-icons">inventory</span>
            <span className="menu-text">Assets</span>
          </Link>

          <ul className="dropdown-menu">
            <li>
              <Link to="/inventory" onClick={handleMenuItemClick}>
                <span className="material-icons">inventory_2</span> 
                <span className="menu-text">Inventory</span>
              </Link>
            </li>
            <li>
              <Link to="/accessory" onClick={handleMenuItemClick}>
                <span className="material-icons">devices_other</span> 
                <span className="menu-text">Accessories</span>
              </Link>
            </li>
            <li>
              <Link to="/peripheral" onClick={handleMenuItemClick}>
                <span className="material-icons">keyboard</span> 
                <span className="menu-text">Peripherals</span>
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/issue-item" onClick={handleMenuItemClick}>
            <span className="material-icons">assignment_ind</span> 
            <span className="menu-text">Issue To</span>
          </Link>
        </li>

        <li>
          <Link to="/repair" onClick={handleMenuItemClick}>
            <span className="material-icons">build</span> 
            <span className="menu-text">Repair</span>
          </Link>
        </li>

        <li>
          <Link to="/upgrade" onClick={handleMenuItemClick}>
            <span className="material-icons">upgrade</span> 
            <span className="menu-text">Upgrade</span>
          </Link>
        </li>

        <li>
          <Link to="/report" onClick={handleMenuItemClick}>
            <span className="material-icons">bar_chart</span> 
            <span className="menu-text">Report</span>
          </Link>
        </li>
        <li>
          <Link to="/setup" onClick={handleMenuItemClick}>
            <span className="material-icons">settings</span> 
            <span className="menu-text">Setup</span>
          </Link>
        </li>

      </ul>

      {/* USER DETAILS (BOTTOM SECTION) */}
      {userName && (
        <div
          ref={userRef}
          className={`user-details ${userOpen ? "active" : ""}`}
        >
          <button
            className="user-toggle"
            onClick={() => setUserOpen((prev) => !prev)}
            title="User menu"
          >
            <span className="material-icons">account_circle</span>
            <span className="menu-text">{userName}</span>
          </button>

          <div className="user-panel" onClick={handleUserPanelClick}>
            <button
              onClick={() => {
                navigate("/profile");
                setUserOpen(false);
              }}
            >
              <span className="material-icons">person</span> Profile
            </button>
            <button onClick={() => setUserOpen(false)}>
              <span className="material-icons">image</span> Change Image
            </button>
            <button
              onClick={() => {
                setUserOpen(false);
                // password change modal will be added later
              }}
            >
              <span className="material-icons">lock</span> Change Password
            </button>
            <button
              onClick={() => {
                setUserOpen(false);
                // logout not wired yet — navigate to home for now
                navigate("/");
              }}
            >
              <span className="material-icons">logout</span> Logout
            </button>
          </div>
        </div>
      )}
      
      {/* PasswordChangeModal will be reintroduced later when auth is integrated */}
    </nav>
  );
};

export default Sidebar;
