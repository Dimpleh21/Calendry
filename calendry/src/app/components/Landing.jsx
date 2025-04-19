"use client";
import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Notify from "./Notify";
import { FaTrash } from "react-icons/fa";
import { createEvent, getEvents } from "@/app/api/actions";
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Landing() {
  const [myEvents, setMyEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showNotCard, setShowNotCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);
  const [isSnoozed, setisSnoozed] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [eventVideo, setEventVideo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTime, setisTime] = useState(false);
  const [showSnoozeCard, setShowSnoozeCard] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      const parsed = JSON.parse(stored).map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
        _id: e._id || `${e.title}-${new Date(e.start).getTime()}`,
      }));
      setMyEvents(parsed);
    }
  }, []);

  const handleAddEvent = () => {
    if (!newTitle.trim() || !eventStart || !eventEnd) return;

    const eventObj = {
      _id: Date.now().toString(),
      title: newTitle.trim(),
      start: eventStart,
      end: eventEnd,
      image: eventImage,
      video: eventVideo,
    };

    const updatedEvents = [...myEvents, eventObj];
    setMyEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setNotification(eventObj);
    setShowNotification(true);
    createEvent(eventObj);
    setNewEvent(null);
    setNewTitle("");
    setEventImage(null);
    setEventVideo(null);
    setShowModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      myEvents.forEach((event) => {
        const eventStart = new Date(event.start);
        const diff = eventStart - now;
        const isWithinReminderWindow = diff >= 0 && diff <= 30 * 60 * 1000;
        if (isWithinReminderWindow) {
          setNotification(event);
          setShowNotification(true);
          setisTime(true);
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [myEvents]);
  const handleLoop = (snoozeStartTime, event) => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diff = snoozeStartTime - now;

      const isWithinReminderWindow = diff >= 0 && diff <= 30 * 60 * 1000;
      if (isWithinReminderWindow) {
        setShowNotCard(true);
      }
    }, 5000);
  };

  const handleSnooze = (event) => {
    setisSnoozed(true);
    const snoozeStartTime = new Date(
      new Date(event.start).getTime() + 2 * 60 * 1000
    ); // +2 mins
    handleLoop(snoozeStartTime, event);
    console.log("Snoozed until:", snoozeStartTime.toLocaleTimeString());
  };

  const handleSlot = (slotInfo) => {
    setEventStart(slotInfo.start);
    setEventEnd(slotInfo.end);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTitle("");
    setEventStart(null);
    setEventEnd(null);
    setEventImage(null);
    setEventVideo(null);
  };

  const handleDeleteEvent = async (eventToDelete) => {
    try {
      const updatedEvents = myEvents.filter((event) => {
        if (event._id && eventToDelete._id) {
          return event._id !== eventToDelete._id;
        }
        return !(
          event.title === eventToDelete.title &&
          new Date(event.start).getTime() ===
            new Date(eventToDelete.start).getTime()
        );
      });

      setMyEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const CustomEvent = ({ event }) => {
    return (
      <div className="flex items-center justify-between">
        <span>{event.title}</span>
        <button
          onClick={() => handleDeleteEvent(event)}
          className="cursor-pointer"
        >
          <FaTrash size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-indigo-100">
      <div className="w-full max-w-6xl h-[600px] shadow-lg rounded-lg p-4 bg-white">
        <BigCalendar
          localizer={localizer}
          events={[...myEvents, ...(newEvent ? [newEvent] : [])]}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSlot}
          onSelectEvent={handleEventClick}
          components={{ event: CustomEvent }}
          className="h-full w-full text-indigo-800 "
          step={15}
          timeslots={4}
          resizable
        />
      </div>

      {showNotification && notification && (
        <Notify
          data={notification}
          onClose={() => setShowNotification(false)}
        />
      )}

      {(isTime || showNotCard) && (
        <div
          className="flex items-center justify-between bg-indigo-500 text-white rounded-lg p-4 shadow-md"
          style={{
            width: "300px",
            position: "fixed",
            bottom: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <div>
            <h4 className="font-semibold">Reminder!</h4>
            <p>{notification.title}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSnooze(notification)}
              className="text-sm bg-yellow-400 text-white rounded px-2 py-1"
            >
              Snooze
            </button>
            <button
              onClick={() => setShowNotCard(false)}
              className="text-sm bg-red-400 text-white rounded px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>

            <div className="mb-4">
              <p className="text-sm font-medium">Event Title:</p>
              <p>{selectedEvent.title}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium">Start Time:</p>
              <p>{format(selectedEvent.start, "yyyy-MM-dd HH:mm")}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium">End Time:</p>
              <p>{format(selectedEvent.end, "yyyy-MM-dd HH:mm")}</p>
            </div>

            {selectedEvent.image && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Image:</p>
                <img
                  src={selectedEvent.image}
                  alt="Event"
                  className="w-full max-h-48 object-contain rounded mt-1"
                />
              </div>
            )}

            {selectedEvent.video && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Video:</p>
                <video
                  src={selectedEvent.video}
                  controls
                  className="w-full max-h-48 object-contain rounded mt-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedEvent(null)} // Close the modal
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium">Event Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter event title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="datetime-local"
                value={
                  eventStart ? format(eventStart, "yyyy-MM-dd'T'HH:mm") : ""
                }
                onChange={(e) => setEventStart(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">End Time</label>
              <input
                type="datetime-local"
                value={eventEnd ? format(eventEnd, "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={(e) => setEventEnd(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Attach Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEventImage(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>

            {eventImage && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Image Preview:
                </p>
                <img
                  src={eventImage}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded mt-1"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium">Attach Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setEventVideo(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>

            {eventVideo && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Video Preview:
                </p>
                <video
                  src={eventVideo}
                  controls
                  className="w-full max-h-48 object-contain rounded mt-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-indigo-500 text-white rounded"
              >
                Save Event
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
