import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  // eslint-disable-next-line no-unused-vars
const [invitationExists, setInvitationExists] = useState(false);
  const [registerRole, setRegisterRole] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Error message state
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        setRegisterEmail(decoded.email);
        setRegisterRole(decoded.role);
        setInvitationExists(true);
        setActiveTab("register"); // auto switch to register
      } catch (error) {
        setInvitationExists(false);
      }
    }
  }, [token]);

  // Handle Login
  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all login fields!");
      return;
    }
    setError("");
    // Call your login API here
    console.log("Login:", { email: loginEmail, password: loginPassword });
  };

  // Handle Register
  const handleRegister = () => {
    if (!registerName || !registerPassword) {
      setError("Please fill in all registration fields!");
      return;
    }

    setError("");

    console.log("Register:", {
      name: registerName,
      password: registerPassword,
      token,
    });

    // After successful API call:
    setActiveTab("login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        {/* Toggle Header */}
        <div className="auth-toggle">
          <div
            className={`toggle-indicator ${activeTab === "register" ? "right" : ""} `}
          ></div>

          <button
            className={activeTab === "login" ? "active"  : "" }
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
              value={loginEmail} // <- controlled value
              onChange={(e) => setLoginEmail(e.target.value)} // <- update state
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>
          </div>

          {/* Register Section */}
          <div>
            <h3 className="text-center mb-4">Join The System</h3>

            <input
              type="email"
              placeholder="emailI"
              className="form-control mb-3"
              value={registerEmail}
              readOnly
            />
<input
              type="text"
              placeholder="roleI"
              className="form-control mb-3"
              value={registerRole}
              readOnly
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;