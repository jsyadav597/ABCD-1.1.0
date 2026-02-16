import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
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

  return (
    <nav className={collapsed ? "menu-bar collapsed" : "menu-bar"}>
      <ul className="menu">
        <li>
          <Link to="/users">
            <span className="material-icons">person</span>
            User
          </Link>
        </li>

        {/* INVENTORY (HOVER) */}
        <li className="dropdown has-submenu">
          <Link type="button" className="menu-btn menu-link">
           
            <span className="material-icons">inventory</span>
            Assets
          </Link>

          <ul className="dropdown-menu">
            <li>
              <Link to="/inventory">
                <span className="material-icons">inventory_2</span> Inventory
              </Link>
            </li>
            <li>
              <Link to="/accessory">
                <span className="material-icons">devices_other</span> Accessories
              </Link>
            </li>
            <li>
              <Link to="/peripheral">
                <span className="material-icons">keyboard</span> Peripherals
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/issue-item">
            <span className="material-icons">assignment_ind</span> Issue To
          </Link>
        </li>

        <li>
          <Link to="/repair">
            <span className="material-icons">build</span> Repair
          </Link>
        </li>

        <li>
          <Link to="/upgrade">
            <span className="material-icons">upgrade</span> Upgrade
          </Link>
        </li>

        <li>
          <Link to="/report">
            <span className="material-icons">bar_chart</span> Report
          </Link>
        </li>
        <li>
          <Link to="/setup">
            <span className="material-icons">settings</span> Setup
          </Link>
        </li>

      </ul>

      {/* USER DETAILS (HOVER) */}
      {userName && (
        <div
          ref={userRef}
          className={`user-details ${userOpen ? "active" : ""}`}
        >
          <button
            className="user-toggle"
            onClick={() => setUserOpen((prev) => !prev)}
          >
            {/* <span className="material-icons">account_circle</span> */}
            {userName}
          </button>

          <div className="user-panel">
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
