import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load complaints.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await api.put(`/complaints/${id}`, { status });
      toast.success(response.data.message || "Status updated successfully.");
      fetchComplaints();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update status.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

const pendingCount = complaints.filter(
(c) => c.status === "PENDING"
).length;

const progressCount = complaints.filter(
(c) => c.status === "IN_PROGRESS"
).length;

const resolvedCount = complaints.filter(
(c) => c.status === "RESOLVED"
).length;

return ( <div className="container mt-4"> <h1 className="mb-4">
Agent Dashboard </h1>

  <div className="row g-3 mb-4">

    <div className="col-md-4">
      <div className="card bg-warning">
        <div className="card-body text-center">
          <h5>Pending</h5>
          <h2>{pendingCount}</h2>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card bg-primary text-white">
        <div className="card-body text-center">
          <h5>In Progress</h5>
          <h2>{progressCount}</h2>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card bg-success text-white">
        <div className="card-body text-center">
          <h5>Resolved</h5>
          <h2>{resolvedCount}</h2>
        </div>
      </div>
    </div>

  </div>

  {complaints.map((complaint) => (
    <div
      key={complaint._id}
      className="card shadow-sm mb-3"
    >
      <div className="card-body">

        <h4>{complaint.title}</h4>

        <p>{complaint.description}</p>

        <p>
          <strong>Category:</strong>{" "}
          {complaint.category}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              complaint.status === "RESOLVED"
                ? "bg-success"
                : complaint.status === "IN_PROGRESS"
                ? "bg-primary"
                : "bg-warning text-dark"
            }`}
          >
            {complaint.status}
          </span>
        </p>

        <div className="mt-3">
          <button
            className="btn btn-warning me-2"
            onClick={() =>
              updateStatus(
                complaint._id,
                "IN_PROGRESS"
              )
            }
          >
            IN_PROGRESS
          </button>

          <button
            className="btn btn-success"
            onClick={() =>
              updateStatus(
                complaint._id,
                "RESOLVED"
              )
            }
          >
            RESOLVED
          </button>
        </div>

      </div>
    </div>
  ))}
</div>

);
}

export default AgentDashboard;
