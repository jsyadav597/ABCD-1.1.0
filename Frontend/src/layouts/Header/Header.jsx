import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ onToggleSidebar }) => {
  return (
    <header>
      <div className="header-left">
        <button
          className="hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>

        <div className="logo">
          {/* <Link to="/">ABCD</Link> */}
          <Link to="/">A</Link>
        </div>
      </div>

      <div className="header-right">
        <div className="search-container" id="searchBox" role="search">
          <input
            type="text"
            placeholder="Search the application..."
            aria-label="Search the application"
          />

          <div className="search-icon-container">
            <button
              type="button"
              id="searchToggle"
              className="material-icons search-icon"
              aria-label="Search"
            >
              search
            </button>
          </div>
        </div>

        <span className="search-icon-out" aria-hidden="true">
          &#128269;
        </span>
      </div>
    </header>
  );
};

export default Header;
