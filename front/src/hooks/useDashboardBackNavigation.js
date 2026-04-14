import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_EXIT_MESSAGE = "Do you want to exit the app?";

const normalizePath = (path) => {
  if (!path) return "/";
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};

const createGuardState = (state, path, stage) => ({
  ...(state || {}),
  appBackGuard: { path, stage },
});

const useDashboardBackNavigation = ({
  mainPaths = [],
  exitMessage = DEFAULT_EXIT_MESSAGE,
  exitTo = "/",
} = {}) => {
  const location = useLocation();

  const normalizedPathname = useMemo(
    () => normalizePath(location.pathname),
    [location.pathname],
  );

  const normalizedMainPaths = useMemo(
    () => mainPaths.map((path) => normalizePath(path)),
    [mainPaths],
  );

  const isMainPage = normalizedMainPaths.includes(normalizedPathname);

  useEffect(() => {
    if (!isMainPage || typeof window === "undefined") {
      return undefined;
    }

    const currentState = window.history.state || {};
    const currentGuard = currentState.appBackGuard;
    const hasActiveGuard =
      currentGuard?.path === normalizedPathname &&
      currentGuard?.stage === "sentinel";

    if (!hasActiveGuard) {
      const baseState = createGuardState(
        currentState,
        normalizedPathname,
        "base",
      );

      window.history.replaceState(baseState, "", window.location.href);
      window.history.pushState(
        createGuardState(baseState, normalizedPathname, "sentinel"),
        "",
        window.location.href,
      );
    }

    const handlePopState = (event) => {
      const guard = event.state?.appBackGuard;

      if (guard?.path !== normalizedPathname || guard?.stage !== "base") {
        return;
      }

      const shouldExit = window.confirm(exitMessage);

      if (!shouldExit) {
        window.history.pushState(
          createGuardState(event.state, normalizedPathname, "sentinel"),
          "",
          window.location.href,
        );
        return;
      }

      window.history.replaceState(
        createGuardState(event.state, normalizedPathname, "released"),
        "",
        window.location.href,
      );

      window.location.replace(exitTo);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [exitMessage, exitTo, isMainPage, normalizedPathname]);
};

export default useDashboardBackNavigation;
