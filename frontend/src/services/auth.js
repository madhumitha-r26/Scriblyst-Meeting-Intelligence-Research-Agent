
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";


async function authRequest(endpoint, payload) {

  const response = await fetch(
    `${API_URL}/api/auth/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Authentication failed."
    );
  }

  return data;
}


function saveAuthSession(data, rememberDevice = false) {

  // Remove any old session first.
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");

  const storage = rememberDevice
    ? localStorage
    : sessionStorage;

  storage.setItem(
    "access_token",
    data.access_token
  );

  return data;
}


export async function registerUser(formData) {

  const data = await authRequest(
    "register",
    formData
  );

  return saveAuthSession(data, false);
}


export async function loginUser(credentials) {

  const data = await authRequest(
    "login",
    {
      email: credentials.email,
      password: credentials.password,
      rememberDevice: credentials.rememberDevice
    }
  );

  return saveAuthSession(
    data,
    credentials.rememberDevice
  );
}

export async function getCurrentUser() {

  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in.");
  }

  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Could not retrieve user profile."
    );
  }

  return data.user;
}


export function logoutUser() {

  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
}
