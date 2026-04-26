import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ActionStatus from "../components/feedback/ActionStatus.jsx";
import { getRequestFeedbackMessage } from "../utils/requestFeedback.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AuthPage.css";
import axios from "axios";
import { API_URL } from "../services/api.js";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [invitationExists, setInvitationExists] = useState(false);
  const [registerRole, setRegisterRole] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerHospital, setRegisterHospital] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  const { login, register } = useContext(AuthContext);

  // Input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loggedOutState, setLoggedOutState] = useState(false);

  const [error, setError] = useState("");
  const logoutParam =
    new URLSearchParams(location.search).get("logout") === "1";
  const isLoggedOutView = loggedOutState && activeTab === "login";
  const logoutMessage = "Successfully logged out. You can log in again.";

  // ---- HANDLE INVITATION ----
  useEffect(() => {
    // Clear login inputs on mount to avoid stale data
    setLoginEmail("");
    setLoginPassword("");

    const invitationToken = new URLSearchParams(location.search).get("token");

    if (!invitationToken) {
      setInvitationExists(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/invitations/verify/${invitationToken}`,
        );
        setRegisterEmail(res.data.email);
        setRegisterRole(res.data.role);
        setRegisterHospital(res.data.hospital || "");
        setInvitationExists(true);
        setActiveTab("register");
      } catch {
        setInvitationExists(false);
      }
    };

    fetchInvitation();
  }, [location.search]);

  useEffect(() => {
    const storedLoggedOut = sessionStorage.getItem("auth_logged_out") === "true";
    const storedNotice = sessionStorage.getItem("auth_notice");

    if (location.state?.loggedOut || storedLoggedOut || logoutParam) {
      setActiveTab("login");
      setLoggedOutState(true);
      setError("");
      setAuthNotice(
        location.state?.authNotice ||
          storedNotice ||
          logoutMessage,
      );
      sessionStorage.removeItem("auth_logged_out");
      sessionStorage.removeItem("auth_notice");
      return;
    }

    setLoggedOutState(false);
    setAuthNotice("");
  }, [location.state, logoutMessage, logoutParam]);
  // ---- LOGIN ----
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all login fields!");
      return;
    }

    try {
      setError("");
      setAuthNotice("Signing you in. This can take a few seconds depending on your connection.");
      setLoginLoading(true);
      const res = await login(loginEmail.trim(), loginPassword.trim());

      if (res.success) {
        // Clear inputs
        setLoginEmail("");
        setLoginPassword("");

        // Redirect based on role
        switch (res.user.role) {
          case "maintenanceManager":
            navigate("/manager", { replace: true });
            break;
          case "admin":
            navigate("/admin", { replace: true });
            break;
          case "pharmacyStore":
            navigate("/pharmacy", { replace: true });
            break;
          case "depStaff":
            navigate("/staff", { replace: true });
            break;
          case "technician":
            navigate("/technician", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      } else {
        setError(res.message);
        setAuthNotice("");
      }
    } catch (err) {
      setError(getRequestFeedbackMessage(err, "Login failed"));
      setAuthNotice("");
    } finally {
      setLoginLoading(false);
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
      setAuthNotice(
        "Creating your account. This can take a few seconds depending on your connection.",
      );
      setRegisterLoading(true);
      const invitationToken = new URLSearchParams(location.search).get("token");
      const res = await register(
        registerName.trim(),
        registerPassword.trim(),
        invitationToken,
      );

      if (res.success) {
        // Clear registration inputs
        setRegisterName("");
        setRegisterPassword("");

        setActiveTab("login");
        setError("");
        setAuthNotice("Registration successful. You can now log in.");
      } else {
        setError(res.message);
        setAuthNotice("");
      }
    } catch (err) {
      setError(getRequestFeedbackMessage(err, "Registration failed"));
      setAuthNotice("");
    } finally {
      setRegisterLoading(false);
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
            onClick={() => {
              setActiveTab("login");
            }}
          >
            {isLoggedOutView ? "Logged Out" : "Login"}
          </button>

          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => {
              setActiveTab("register");
              setLoggedOutState(false);
              setAuthNotice("");
            }}
          >
            Register
          </button>
        </div>

        <ActionStatus
          status={loginLoading || registerLoading ? "info" : "success"}
          message={authNotice || (isLoggedOutView ? logoutMessage : "")}
          style={{ marginBottom: authNotice || isLoggedOutView ? "1rem" : 0 }}
        />

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
              <h3 className="text-center mb-4">
                {isLoggedOutView ? "You Are Logged Out" : "Welcome Back"}
              </h3>
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
              <button
                type="submit"
                className="btn btn-primary w-100 btnl"
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Signing In..."
                  : isLoggedOutView
                    ? "Sign In Again"
                    : "Login"}
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
                    value={registerHospital}
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
                  <button
                    type="submit"
                    className="btn btn-primary w-100 btnl"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Registering..." : "Register"}
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

