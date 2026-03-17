let csrfToken = null;

// CSRF
async function initCsrfToken() {
  const response = await fetch("/api/csrf-token", {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF Token")
  }

  const data = await response.json();
  csrfToken = data.csrfToken;
};

// Fetch
async function apiFetch(url, options = {}) {
  const method = options.method || "GET"

  const headers = {
    ...(options.headers || {})
  };

  const shouldSendJson = options.body !== undefined && !headers["Content-Type"];

  if (shouldSendJson) {
    headers["Content-Type"] = "application/json";
  }

  // Send CSRF token only if method "POST", "PUT", "PATCH", "DELETE"
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!csrfToken) {
      throw new Error("CSRF token not initialized");
    }

    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: "include"
  });

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  return {response, data};
}

export {apiFetch, initCsrfToken}