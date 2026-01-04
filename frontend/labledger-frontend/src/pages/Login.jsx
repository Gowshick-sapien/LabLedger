import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("LOGIN SUBMIT:", {
    email,
    password,
  });

  try {
    const data = await loginUser(email, password);
    console.log("LOGIN RESPONSE:", data);
    login(data.token);
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data || err);
    setError("Invalid credentials");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h1 className="text-xl font-semibold mb-4">LabLedger Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          className="w-full border p-2 mb-3 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 mb-4 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
