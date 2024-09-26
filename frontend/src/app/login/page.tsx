"use client";
import { AppDispatch } from "@/store/store";
import { login } from "@/store/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData, // Automatically stringifies and sends as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Allows sending cookies if needed
        }
      );
      if (!response) {
        console.log("no response");
      } else {
        const { userID, firstName, lastName, token, email } = response.data;
        console.log(response.data);

        // Dispatch the login action
        dispatch(
          login({
            userID,
            firstName,
            lastName,
            token,
            email,
          })
        );
        // console.log("Login successful:", response.data);
        router.push("/");
      }
    } catch (error) {
      setError("Login failed. Please check your email or password.");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-white">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-third shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-white text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none bg-third text-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-white text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-third text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full max-w-[150px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3 
              border cursor-pointer bg-red-400 border-red-500 hover:bg-red-500 text-white`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
