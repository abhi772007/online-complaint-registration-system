import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      const data = response.data;
      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        console.log(data);
        setComplaints([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load complaints.");
    }
  };

  const handleComplaint = async () => {
    try {
      const response = await api.post("/complaints", {
        title,
        description,
        category,
      });

      const data = response.data;
      toast.success(data.message || "Complaint submitted.");
      setTitle("");
      setDescription("");
      setCategory("");
      fetchComplaints();
    } catch (error) {
      console.error(error);
      toast.error("Complaint submission failed.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="container mt-4">

      <div className="mb-4">
  <h1>User Dashboard</h1>
</div>

      <div className="card shadow mb-4">
        <div className="card-body">

          <h3>Create Complaint</h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Complaint Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Complaint Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button className="btn btn-primary" onClick={handleComplaint}>
            Submit Complaint
          </button>
        </div>
      </div>

      <h2 className="mb-3">
        My Complaints
      </h2>

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
              <span className="badge bg-warning text-dark">
                {complaint.status}
              </span>
            </p>

            <p>
              <strong>Assigned Agent:</strong>{" "}
              {complaint.assignedAgent
                ? complaint.assignedAgent.name
                : "Not Assigned"}
            </p>

            <p>
              <strong>Feedback:</strong>{" "}
              {complaint.feedback || "No Feedback"}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              {complaint.rating || 0}
            </p>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;