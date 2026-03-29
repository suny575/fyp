// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

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
    const storedUser = localStorage.getItem("user");
    return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Initialize user & token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      const normalizedUser = normalizeUser(JSON.parse(storedUser));
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }
    setLoading(false);
  }, []);

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

      // Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

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

    if (normalizedUser) {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
