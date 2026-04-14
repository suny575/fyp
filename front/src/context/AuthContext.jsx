// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  migrateLegacyAuthToSession,
  setStoredAuth,
  setStoredUser,
} from "../utils/authStorage.js";

export const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return null;

  const normalizedId = user._id || user.id || null;

  return {
    ...user,
    id: normalizedId,
    _id: normalizedId,
    profileImage: user.profileImage || "",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return normalizeUser(getStoredUser());
  });

  const [token, setToken] = useState(() => {
    return getStoredToken();
  });

  const [loading, setLoading] = useState(true);

  // Initialize user & token on app load
  useEffect(() => {
    migrateLegacyAuthToSession();

    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      const normalizedUser = normalizeUser(storedUser);
      setUser(normalizedUser);
      setStoredUser(normalizedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      return;
    }

    delete axios.defaults.headers.common.Authorization;
  }, [token]);

  // ---- LOGIN ----
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const normalizedUser = normalizeUser(res.data.user);

      // Update context state
      setToken(res.data.token);
      setUser(normalizedUser);

      // Save auth per tab so different roles can stay open in different tabs.
      setStoredAuth({ token: res.data.token, user: normalizedUser });

      return { success: true, user: normalizedUser };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ---- REGISTER (via invitation) ----
  const register = async (name, password, token) => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        password,
        token,
      });

      // Optionally, auto-login user after registration
      // setToken(res.data.token);
      // setUser(res.data.user);
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      return { success: true, user: normalizeUser(res.data.user) };
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const updateUser = (nextUser) => {
    const normalizedUser = normalizeUser(nextUser);
    setUser(normalizedUser);
    setStoredUser(normalizedUser);
  };

  // ---- LOGOUT ----
  const logout = ({ loggedOut = false, notice = "" } = {}) => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
    sessionStorage.removeItem("auth_logged_out");
    sessionStorage.removeItem("auth_notice");
    if (loggedOut) {
      sessionStorage.setItem("auth_logged_out", "true");
    }
    if (notice) {
      sessionStorage.setItem("auth_notice", notice);
    }
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
