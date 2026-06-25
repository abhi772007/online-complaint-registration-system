import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="display-5 fw-bold">Online Complaint Registration</h1>
          <p className="lead">
            Manage complaints faster with role-based tracking for users,
            agents and admins. Submit, assign, and resolve issues from one
            centralized platform.
          </p>
          <div className="d-flex gap-2 mt-4">
            <Link className="btn btn-primary btn-lg" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-secondary btn-lg" to="/register">
              Register
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="mb-3">System Features</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Secure role-based dashboard</li>
                <li className="list-group-item">Complaint assignment and tracking</li>
                <li className="list-group-item">Agent status updates and reporting</li>
                <li className="list-group-item">Feedback collection and rating</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
