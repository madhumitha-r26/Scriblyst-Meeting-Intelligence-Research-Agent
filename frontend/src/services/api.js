
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function call(
  path,
  options = {},
  fallbackMessage = "API request failed"
) {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || fallbackMessage);
  }

  return data;
}


// Research APIs
export const createResearch = (payload) =>
  call("/api/research", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const askResearch = (id, question) =>
  call(`/api/research/${id}/chat`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });

export const exportResearch = (id, payload = {}) =>
  call(`/api/research/${id}/export`, {
    method: "POST",
    body: JSON.stringify(payload),
  });


// Google Calendar connection
export async function connectGoogleCalendar() {
  const data = await call(
    "/api/calendar/auth-url",
    {},
    "Could not start Google authorization"
  );

  window.location.href = data.authorization_url;
}

export async function getCalendarStatus() {
  return call(
    "/api/calendar/status",
    {},
    "Could not check Calendar connection"
  );
}


// Retrieve upcoming Google Meet meetings
export async function getMeetings(maxResults = 20) {
  return call(
    `/api/meetings?max_results=${maxResults}`,
    {},
    "Could not retrieve meetings"
  );
}


// Create a Google Calendar event with a Google Meet link
export async function scheduleCalendarEvent(eventData) {
  return call(
    "/api/meetings/create",
    {
      method: "POST",
      body: JSON.stringify({
        ...eventData,
        create_meet_link: true,
      }),
    },
    "Meeting scheduling failed"
  );
}


// Start meeting research
export async function startMeetingResearch(researchData) {
  return call(
    "/api/research",
    {
      method: "POST",
      body: JSON.stringify(researchData),
    },
    "Research could not be started"
  );
}
