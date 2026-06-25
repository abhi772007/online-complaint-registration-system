import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function Feedback() {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("/feedback", {
        complaint,
        rating,
        comment,
      });
      toast.success(response.data.message || "Feedback submitted.");
      setRating("");
      setComment("");
      setComplaint("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Feedback submission failed.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4">Submit Feedback</h2>
              <input
                className="form-control mb-3"
                type="text"
                placeholder="Complaint ID"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              />
              <input
                className="form-control mb-3"
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <textarea
                className="form-control mb-3"
                placeholder="Describe your experience"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;