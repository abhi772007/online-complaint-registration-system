import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const data = response.data;
      if (data.token) {
        login(data.token, data.user);
        toast.success("Login successful.");

        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else if (data.user.role === "AGENT") {
          navigate("/agent");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">
                Login
              </h2>

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
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Login
              </button>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;