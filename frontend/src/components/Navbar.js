import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { token, user, logout } = useContext(AuthContext);

  const getHomeLink = () => {
    if (user?.role === "ADMIN") return "/admin";
    if (user?.role === "AGENT") return "/agent";
    return "/dashboard";
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={token ? getHomeLink() : "/"}>
          Complaint System
        </Link>

        {token ? (
          <div className="position-relative" ref={menuRef}>
            <button
              className="btn btn-outline-light"
              onClick={() => setShowMenu(!showMenu)}
            >
              ☰
            </button>

            {showMenu && (
              <div
                className="card position-absolute end-0 mt-2 shadow"
                style={{ width: "220px", zIndex: 1000 }}
              >
                <div className="card-body p-2">
                  <h6 className="text-center mb-3">{user?.name || "User"}</h6>

                  <Link
                    className="dropdown-item"
                    to={getHomeLink()}
                    onClick={() => setShowMenu(false)}
                  >
                    Home
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/feedback"
                    onClick={() => setShowMenu(false)}
                  >
                    Feedback
                  </Link>

                  <hr />

                  <button
                    className="btn btn-danger w-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-light text-dark" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
