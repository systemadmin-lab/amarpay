"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../../../components/MapPicker"), { ssr: false });

export default function EventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [coords, setCoords] = useState([23.8103, 90.4125]);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const e = events[params.id];
    if (e) {
      setEvent(e);
      if (e.location) {
        const matches = e.location.match(/Lat: ([\d.]+), Lng: ([\d.]+)/);
        if (matches) setCoords([parseFloat(matches[1]), parseFloat(matches[2])]);
      }
    }
  }, [params.id]);

  if (!event) return <p className="text-white py-10 text-center">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="text-sm text-gray-400 mb-2">
        📅 {event.date} | 🏷 {event.category} | 📍 {event.location}
      </p>
      <div className="mt-4">
        <MapPicker onLocationSelect={() => {}} initialPosition={coords} />
      </div>
    </div>
  );
}
