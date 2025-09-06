"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center py-16 text-center space-y-6 min-h-screen bg-gray-900 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient font-mono leading-tight">
        aamar_Pay <br /> Event Management System
      </h1>

      <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-mono font-bold">
        Streamline your events with ease. From planning to execution — <br />
        we make every occasion organized, seamless, and hassle-free.
      </p>

      <div className="flex gap-6 mt-6">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
