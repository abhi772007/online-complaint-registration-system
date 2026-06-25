import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await api.put("/profile", {
        name,
        phone,
      });

      updateUser(response.data.user);
      toast.success(response.data.message || "Profile updated.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save profile.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-4">My Profile</h2>
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control mb-3"
            value={user?.email || ""}
            disabled
          />
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control mb-4"
            value={user?.role || ""}
            disabled
          />
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;