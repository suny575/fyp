import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AuthPage.css";
import axios from "axios";

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [invitationExists, setInvitationExists] = useState(false);
  const [registerRole, setRegisterRole] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [error, setError] = useState("");

  // ---- HANDLE INVITATION ----
  useEffect(() => {
    // Clear login inputs on mount to avoid stale data
    setLoginEmail("");
    setLoginPassword("");

    if (token) {
      // check invitation token
      const fetchInvitation = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/invitations/verify/${token}`,
          );
          setRegisterEmail(res.data.email);
          setRegisterRole(res.data.role);
          setInvitationExists(true);
          setActiveTab("register");
        } catch {
          setInvitationExists(false);
        }
      };
      fetchInvitation();
    }
  }, [token]);

  // ---- LOGIN ----
  const handleLogin = async () => {
  
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all login fields!");
      return;
    }

    try {
      setError("");
      const res = await axios.post("http://localhost:5000/api/login", {
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      });

      const { token: jwtToken, user } = res.data;

      // Store auth data
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("role", user.role);

      // Clear inputs
      setLoginEmail("");
      setLoginPassword("");

      // Redirect based on role
      if (user.role === "maintenanceManager") {
        navigate("/manager");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
      else if (user.role === "pharmacyStore") {
        navigate("/pharmacy");}
      
      else if (user.role === "depStaff") {
        navigate("/staff");
      } else if (user.role === "technician") {
        navigate("/technician");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // ---- REGISTER ----
  const handleRegister = async () => {
    if (!registerName || !registerPassword) {
      setError("Please fill in all registration fields!");
      return;
    }

    try {
      setError("");
      await axios.post("http://localhost:5000/api/register", {
        name: registerName.trim(),
        password: registerPassword.trim(),
        token,
      });

      // Clear registration inputs
      setRegisterName("");
      setRegisterPassword("");

      setActiveTab("login");
      setError("Registration successful! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        {/* Toggle Header */}
        <div className="auth-toggle">
          <div
            className={`toggle-indicator ${
              activeTab === "register" ? "right" : ""
            }`}
          ></div>

          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Display error */}
        {error && (
          <div
            className="text-center text-danger mb-3"
            style={{ fontWeight: "500" }}
          >
            {error}
          </div>
        )}

        {/* Forms Container */}
        <div className="form-wrapper">
          {/* Login Form */}
          <div className={`form-box ${activeTab === "login" ? "show" : ""}`}>
            <h3 className="text-center mb-4">Welcome Back</h3>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              className="btn btn-primary w-100 btnl"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          {/* Register Form */}
          {activeTab === "register" && (
            <div className={`form-box show`}>
              {invitationExists ? (
                <>
                  <input
                    type="email"
                    value={registerEmail}
                    readOnly
                    className="form-control mb-3"
                  />
                  <input
                    type="text"
                    value={registerRole}
                    readOnly
                    className="form-control mb-3"
                  />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Full Name"
                  />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Password"
                  />
                  <button
                    className="btn btn-primary w-100 btnl"
                    onClick={handleRegister}
                  >
                    Register
                  </button>
                </>
              ) : (
                <div
                  className="text-center text-muted"
                  style={{
                    padding: "2rem",
                    borderRadius: "0.75rem",
                    fontWeight: "500",
                    boxShadow: "0 0 15px 3px #ff1493",
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  <h3 className="mb-3">Join The System</h3>
                  <p>Registration is only available via invitation.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
