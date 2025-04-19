"use server";
const API_URL = "http://localhost:3002";

export const createEvent = async (event) => {
  try {
    console.log("Creating event:", event);

    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      body: JSON.stringify(event), 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Failed to create event. Response code: " + response.status
      );
    }

    const data = await response.json();
    console.log("Event created successfully:", data);
  } catch (error) {
    console.error("Error creating event:", error);
  }
};

export const getEvents = async () => {
  try {
    console.log("Fetching events from:", `${API_URL}/events`);

    const response = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Failed to fetch events. Response code: " + response.status
      );
    }

    const data = await response.json();
    console.log("Fetched events successfully:", data);

    return data.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
