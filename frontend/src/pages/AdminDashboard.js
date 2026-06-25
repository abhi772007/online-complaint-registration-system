import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "PENDING",
    adminRemark: "",
  });

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      const data = response.data;
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load complaints.");
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get("/agents");
      const data = response.data;
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load agents.");
    }
  };

  const assignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      const response = await api.post("/assign-agent", {
        complaintId,
        agentId,
      });
      toast.success(response.data.message || "Agent assigned successfully.");
      fetchComplaints();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign agent.");
    }
  };

  const startEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditForm({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      adminRemark: complaint.adminRemark || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const response = await api.put(`/complaints/edit/${id}`, editForm);
      toast.success(response.data.message || "Complaint updated successfully.");
      setEditingId(null);
      fetchComplaints();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update complaint.");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchAgents();
  }, []);

  const pendingCount = complaints.filter(
    (c) => c.status === "PENDING"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  return (
    <div className="container mt-4">

      <h1 className="mb-4">
        Admin Dashboard
      </h1>

      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5>Total Complaints</h5>
              <h2>{complaints.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5>Total Agents</h5>
              <h2>{agents.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning">
            <div className="card-body text-center">
              <h5>Pending</h5>
              <h2>{pendingCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-white">
            <div className="card-body text-center">
              <h5>Resolved</h5>
              <h2>{resolvedCount}</h2>
            </div>
          </div>
        </div>

      </div>

      <h2>Agents</h2>

      {agents.map((agent) => (
        <div
          key={agent._id}
          className="card shadow-sm mb-3"
        >
          <div className="card-body">
            <h4>{agent.name}</h4>
            <p>{agent.email}</p>
          </div>
        </div>
      ))}

      <h2 className="mt-4">
        Complaints
      </h2>

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className="card shadow-sm mb-3"
        >
          <div className="card-body">

            {editingId === complaint._id ? (
              <>
                <input
                  className="form-control mb-2"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-2"
                  value={
                    editForm.description
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={
                    editForm.category
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category:
                        e.target.value,
                    })
                  }
                />

                <select
                  className="form-select mb-2"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="PENDING">
                    PENDING
                  </option>
                  <option value="IN_PROGRESS">
                    IN_PROGRESS
                  </option>
                  <option value="RESOLVED">
                    RESOLVED
                  </option>
                  <option value="DUPLICATE">
                    DUPLICATE
                  </option>
                </select>

                <textarea
                  className="form-control mb-2"
                  placeholder="Admin Remark"
                  value={
                    editForm.adminRemark
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      adminRemark:
                        e.target.value,
                    })
                  }
                />

                <button
                  className="btn btn-success me-2"
                  onClick={() =>
                    saveEdit(
                      complaint._id
                    )
                  }
                >
                  Save Changes
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setEditingId(null)
                  }
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4>
                  {complaint.title}
                </h4>

                <p>
                  {
                    complaint.description
                  }
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {complaint.status}
                </p>

                <p>
                  <strong>
                    Assigned Agent:
                  </strong>{" "}
                  {complaint
                    .assignedAgent
                    ? complaint
                        .assignedAgent
                        .name
                    : "Not Assigned"}
                </p>

                <p>
                  <strong>
                    Admin Remark:
                  </strong>{" "}
                  {complaint.adminRemark ||
                    "None"}
                </p>

                <select
                  className="form-select mb-2"
                  defaultValue=""
                  onChange={(e) =>
                    assignAgent(
                      complaint._id,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Agent
                  </option>

                  {agents.map(
                    (agent) => (
                      <option
                        key={
                          agent._id
                        }
                        value={
                          agent._id
                        }
                      >
                        {agent.name}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="btn btn-primary mt-2"
                  onClick={() =>
                    startEdit(
                      complaint
                    )
                  }
                >
                  Edit Complaint
                </button>
              </>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;