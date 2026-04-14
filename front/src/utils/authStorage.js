const TOKEN_KEY = "token";
const USER_KEY = "user";
const USERNAME_KEY = "username";

const readStoredValue = (key) =>
  sessionStorage.getItem(key) || localStorage.getItem(key) || "";

export const getStoredToken = () => readStoredValue(TOKEN_KEY) || null;

export const getStoredUser = () => {
  const storedUser = readStoredValue(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

export const getStoredUsername = () => {
  const storedUser = getStoredUser();

  return (
    sessionStorage.getItem(USERNAME_KEY) ||
    storedUser?.name ||
    localStorage.getItem(USERNAME_KEY) ||
    ""
  );
};

export const setStoredAuth = ({ token, user }) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    if (user.name) {
      sessionStorage.setItem(USERNAME_KEY, user.name);
    } else {
      sessionStorage.removeItem(USERNAME_KEY);
    }
  } else {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
  }

  // Remove legacy shared-tab auth values so every tab keeps its own login.
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

export const setStoredUser = (user) => {
  if (!user) {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USERNAME_KEY);
    return;
  }

  sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  if (user.name) {
    sessionStorage.setItem(USERNAME_KEY, user.name);
  } else {
    sessionStorage.removeItem(USERNAME_KEY);
  }

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

export const clearStoredAuth = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

export const migrateLegacyAuthToSession = () => {
  const hasSessionAuth =
    sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(USER_KEY);

  if (hasSessionAuth) {
    return;
  }

  const legacyToken = localStorage.getItem(TOKEN_KEY);
  const legacyUser = localStorage.getItem(USER_KEY);
  const legacyUsername = localStorage.getItem(USERNAME_KEY);

  if (legacyToken) {
    sessionStorage.setItem(TOKEN_KEY, legacyToken);
  }

  if (legacyUser) {
    sessionStorage.setItem(USER_KEY, legacyUser);
  }

  if (legacyUsername) {
    sessionStorage.setItem(USERNAME_KEY, legacyUsername);
  } else if (legacyUser) {
    try {
      const parsedUser = JSON.parse(legacyUser);

      if (parsedUser?.name) {
        sessionStorage.setItem(USERNAME_KEY, parsedUser.name);
      }
    } catch (error) {
      console.error("Failed to migrate legacy auth:", error);
    }
  }

  if (legacyToken || legacyUser || legacyUsername) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }
};
