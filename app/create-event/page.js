"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../../components/MapPicker"), { ssr: false });
const WEATHER_API_KEY = "abcde72adcb747262320e963e8747b8c";

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    city: "",
    country: "BD",
    phone: "",
  });
  const [locationCoords, setLocationCoords] = useState([23.8103, 90.4125]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherSuggestion, setWeatherSuggestion] = useState(null);

  // Protected route & edit
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) router.push("/login");

    const editIndex = localStorage.getItem("editEventIndex");
    if (editIndex !== null) {
      const events = JSON.parse(localStorage.getItem("events") || "[]");
      const eventToEdit = events[editIndex];
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title || "",
          description: eventToEdit.description || "",
          date: eventToEdit.date || "",
          category: eventToEdit.category || "",
          city: eventToEdit.city || "",
          country: eventToEdit.country || "BD",
          phone: eventToEdit.phone || "",
        });
        if (eventToEdit.location) {
          const match = eventToEdit.location.match(/Lat:\s*([\d.-]+),\s*Lng:\s*([\d.-]+)/);
          if (match) setLocationCoords([parseFloat(match[1]), parseFloat(match[2])]);
        }
        setEditingIndex(Number(editIndex));
      }
    }
  }, [router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchForecast = async (city, country) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return await res.json();
    } catch {
      return null;
    }
  };

  const fetchWeather = async (city, country) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.weather && data.weather.length > 0) {
        const current = {
          main: data.weather[0].main,
          description: data.weather[0].description,
          temp: data.main.temp,
        };
        setWeatherData(current);

        const forecast = await fetchForecast(city, country);
        if (forecast?.list?.length > 0) {
          const suggestion = forecast.list.find((f) => f.weather[0].main === current.main);
          if (suggestion) {
            setWeatherSuggestion({
              date: suggestion.dt_txt,
              main: suggestion.weather[0].main,
            });
          }
        }
        return current.main;
      }
      return "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.category ||
      !formData.city ||
      !formData.country ||
      !formData.phone ||
      !locationCoords
    ) {
      setError("⚠️ Please fill out all fields including map location.");
      return;
    }

    setLoading(true);
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const currentUser = localStorage.getItem("currentUser");
    const duplicate = events.find(
      (ev, idx) => ev.date === formData.date && idx !== editingIndex && ev.creator === currentUser
    );
    if (duplicate) {
      setError("⚠️ You already have an event on this date!");
      setLoading(false);
      return;
    }

    const weather = await fetchWeather(formData.city, formData.country);

    const newEvent = {
      ...formData,
      location: `Lat: ${locationCoords[0].toFixed(4)}, Lng: ${locationCoords[1].toFixed(4)}`,
      weather,
      creator: currentUser,
    };

    if (editingIndex !== null) {
      events[editingIndex] = newEvent;
      localStorage.removeItem("editEventIndex");
    } else {
      events.push(newEvent);
    }

    localStorage.setItem("events", JSON.stringify(events));

    // Redirect
    router.push("/my-event");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const renderWeatherWidget = () => {
    if (!weatherData) return null;
    let icon = "🌤️";
    let warning = null;

    switch (weatherData.main) {
      case "Rain":
        icon = "🌧️";
        break;
      case "Clouds":
        icon = "☁️";
        break;
      case "Clear":
        icon = "☀️";
        break;
      case "Snow":
        icon = "❄️";
        break;
      case "Thunderstorm":
        icon = "⛈️";
        warning = <p className="mt-2 p-2 bg-red-600 text-white text-sm rounded">⚠️ Thunderstorm Alert!</p>;
        break;
      default:
        icon = "🌍";
    }

    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-2xl text-center backdrop-blur-lg border border-white/20 w-full md:w-80">
        <p className="text-6xl">{icon}</p>
        <h3 className="text-xl font-semibold mt-3">{weatherData.main}</h3>
        <p className="text-base capitalize">{weatherData.description}</p>
        <p className="mt-2 text-lg">🌡 {weatherData.temp}°C</p>
        {warning}
        {weatherSuggestion && (
          <p className="mt-4 p-2 bg-blue-600 text-white text-sm rounded">
            💡 Next {weatherSuggestion.main} expected on {weatherSuggestion.date}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900/80 px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="flex flex-col items-center justify-center w-full md:w-2/3 gap-10">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
              {editingIndex !== null ? "Edit Event" : "Create Event"}
            </h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-900/80 backdrop-blur-md border border-white/10"
            >
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Category</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country Code"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-32 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <div className="w-full">
                <label className="text-white mb-2 block font-medium">Select Location on Map:</label>
                <MapPicker onLocationSelect={setLocationCoords} initialPosition={locationCoords} />
              </div>
              <button
                type="submit"
                className="bg-amber-500 text-black font-semibold py-3 rounded-lg hover:bg-amber-400 transition duration-300 mt-4"
              >
                {editingIndex !== null ? "Update Event" : "Create Event"}
              </button>
            </form>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-red-500 hover:scale-105 transition transform duration-300 mt-4"
            >
              Logout
            </button>
          </div>

          <div className="w-full flex justify-center">{renderWeatherWidget()}</div>
        </div>

        <div className="md:w-1/3 hidden md:block"></div>
      </div>
    </div>
  );
}
