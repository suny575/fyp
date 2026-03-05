import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
  const { login, register } = useContext(AuthContext);

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
      const res = await login(loginEmail.trim(), loginPassword.trim());

      if (res.success) {
        // Clear inputs
        setLoginEmail("");
        setLoginPassword("");

        // Redirect based on role
        switch (res.user.role) {
          case "maintenanceManager":
            navigate("/manager");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "pharmacyStore":
            navigate("/pharmacy");
            break;
          case "depStaff":
            navigate("/staff");
            break;
          case "technician":
            navigate("/technician");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Login failed");
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
      const res = await register(
        registerName.trim(),
        registerPassword.trim(),
        token,
      );

      if (res.success) {
        // Clear registration inputs
        setRegisterName("");
        setRegisterPassword("");

        setActiveTab("login");
        setError("Registration successful! Please login.");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Registration failed");
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
          {activeTab === "login" && (
            <form
              className="form-box show"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <h3 className="text-center mb-4">Welcome Back</h3>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="submit" className="btn btn-primary w-100 btnl">
                Login
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form
              className="form-box show"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
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
                    required
                  />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Password"
                    required
                  />
                  <button type="submit" className="btn btn-primary w-100 btnl">
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
