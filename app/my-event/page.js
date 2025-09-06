"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");

    // Map only current user's events with original index
    const userEvents = allEvents
      .map((e, idx) => ({ ...e, originalIndex: idx }))
      .filter((e) => e.creator === currentUser);

    setEvents(userEvents);

    // Fetch weather
    userEvents.forEach(async (event, index) => {
      if (!event.date || !event.location) return;
      const match = event.location.match(/Lat:\s*([\d.-]+).*Lng:\s*([\d.-]+)/);
      if (!match) return;

      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode&timezone=auto&start_date=${event.date}&end_date=${event.date}`
        );
        const data = await res.json();
        if (data.daily && data.daily.weathercode) {
          const code = data.daily.weathercode[0];
          setWeatherData((prev) => ({
            ...prev,
            [event.originalIndex]: mapWeather(code),
          }));
        }
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    });
  }, []);

  const mapWeather = (code) => {
    if (code === 0) return "☀️ Sunny";
    if ([1, 2].includes(code)) return "⛅ Partly Cloudy";
    if (code === 3) return "☁️ Cloudy";
    if ([61, 63, 65].includes(code)) return "🌧 Rainy";
    return "🌍 Unknown";
  };

  const handleRSVP = (event) => {
    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const idx = event.originalIndex;

    allEvents[idx].attendees = (allEvents[idx].attendees || 0) + 1;
    localStorage.setItem("events", JSON.stringify(allEvents));

    // update local state
    const currentUser = localStorage.getItem("currentUser");
    const userEvents = allEvents
      .map((e, idx) => ({ ...e, originalIndex: idx }))
      .filter((e) => e.creator === currentUser);
    setEvents(userEvents);
  };

  const handleEdit = (event) => {
    localStorage.setItem("editEventIndex", event.originalIndex);
    router.push("/create-event");
  };

  const handleDelete = (event) => {
    if (!confirm("Delete this event?")) return;
    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
    allEvents.splice(event.originalIndex, 1);
    localStorage.setItem("events", JSON.stringify(allEvents));

    const currentUser = localStorage.getItem("currentUser");
    const userEvents = allEvents
      .map((e, idx) => ({ ...e, originalIndex: idx }))
      .filter((e) => e.creator === currentUser);
    setEvents(userEvents);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-white tracking-wide">
        My Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">No events found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((e) => (
            <div
              key={e.originalIndex}
              className="p-6 rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-amber-300 hover:text-amber-400 transition mb-2">
                    <Link href={`/events/${e.originalIndex}`}>{e.title}</Link>
                  </h2>
                  <p className="text-gray-200 text-base mb-3">{e.description}</p>
                  <p className="text-gray-300 text-sm mb-1">📅 {e.date}</p>
                  <p className="text-gray-300 text-sm mb-1">🏷 {e.category}</p>
                  <p className="text-gray-300 text-sm mb-1">📍 {e.location}</p>
                  <p className="text-blue-400 text-sm mb-1">
                    🌦 {weatherData[e.originalIndex] || "Loading weather..."}
                  </p>
                  <p className="text-green-400 text-sm">✅ {e.attendees || 0} people attending</p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleRSVP(e)}
                    className="flex-1 px-4 py-2 bg-green-600 rounded-xl hover:bg-green-500 transition text-white font-semibold"
                  >
                    RSVP
                  </button>
                  <button
                    onClick={() => handleEdit(e)}
                    className="flex-1 px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition text-white font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e)}
                    className="flex-1 px-4 py-2 bg-red-600 rounded-xl hover:bg-red-500 transition text-white font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
