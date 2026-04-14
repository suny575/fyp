export const getRequestFeedbackMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Connection problem. Please check your internet and try again.";
  }

  if (error?.response?.status >= 500) {
    return "The server is taking too long to respond right now. Please try again in a moment.";
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};
