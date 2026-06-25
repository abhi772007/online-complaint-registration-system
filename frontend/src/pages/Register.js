import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });
      toast.success(response.data.message || "Registration successful.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">
                Register
              </h2>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                className="btn btn-success w-100"
                onClick={handleRegister}
              >
                Register
              </button>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;