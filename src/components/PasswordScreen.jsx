import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

function PasswordScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://koshank-invoice.onrender.com/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        onUnlock(); // Unlock the website
      } else {
        setError("❌ Incorrect password! Please try again.");
      }
    } catch (err) {
      setError("⚠️ Server error, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-orange-500 to-orange-600">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Welcome Section */}
        <motion.h1
          className="text-4xl font-extrabold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Koshank Invoice Generator 🔐
        </motion.h1>
        <p className="text-lg text-gray-200 max-w-lg mx-auto">
        Generate the invoice for our client
        </p>
      </div>

      {/* Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white p-8 rounded-lg shadow-2xl text-center w-96 mt-6"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Company Logo"
          className="w-28 h-auto mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        />

        <h2 className="text-xl font-bold mb-2 text-gray-800">Secure Access</h2>
        <p className="text-gray-600 text-sm mb-4">Please enter the password to continue.</p>

        {/* Password Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ x: 0 }}
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <motion.input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full text-center focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-lg"
            whileFocus={{ scale: 1.05 }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded w-full font-semibold tracking-wide shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={isLoading}
          >
            {isLoading ? "Unlocking..." : "Unlock 🔓"}
          </motion.button>
        </motion.form>
        
      </motion.div>

      {/* Footer Section */}
      <footer className="relative z-10 mt-8 text-center text-gray-300 text-sm">
      <p>
  <span className="font-bold">© {new Date().getFullYear()} Koshank.</span> All rights reserved.
</p>

        <p>
  Developed By{" "}
  <a
    href="https://www.linkedin.com/in/dineshpawar07/"
    className="text-white font-semibold hover:underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    Dinesh Pawar
  </a>
</p>

      </footer>
    </div>
  );
}

export default PasswordScreen;
