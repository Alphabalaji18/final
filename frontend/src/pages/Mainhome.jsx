import React from "react";
import { FaHeadphones, FaPhoneAlt, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link } from "react-router-dom";

const Card = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 0.5 }}
    whileTap={{ scale: 0.97 }}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="bg-white/10 backdrop-blur-xl border border-white/30 p-5 sm:p-6 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 group relative overflow-hidden hover:shadow-[0_0_60px_10px_rgba(255,255,255,0.2)]"
  >
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
    <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 flex items-center justify-center gap-3 text-white drop-shadow-lg text-center">
      <Icon className={`${color} drop-shadow-glow text-xl sm:text-2xl`} /> {title}
    </h2>
    <p className="text-base sm:text-lg text-gray-200 text-center leading-relaxed">{description}</p>
  </motion.div>
);

const particlesInit = async (main) => {
  await loadFull(main);
};

const Mainhome = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 overflow-hidden px-2 sm:px-4 py-10 sm:py-20 pt-24 text-white">

      {/* Particle background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { value: 50 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.05 },
            size: { value: 3 },
            move: { enable: true, speed: 0.5 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <div className="z-10 text-center max-w-6xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-10 sm:mb-14 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          🌟 Welcome to <span className="text-yellow-400">SafeSpace</span>
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link to='/list'><Card
            icon={FaHeadphones}
            title="Listener"
            description="Talk to someone who will listen without judgment and provide mental suport. 💙"
            color="text-yellow-300"
          /></Link>
          <Link to='/call'><Card
            icon={FaPhoneAlt}
            title="Call"
            description="Randomly connect with someone online users via voice call who are in online. 🗣️"
            color="text-green-300"
          /></Link>
          <div className="sm:col-span-2">
            <Link to='/home'><Card
              icon={FaComments}
              title="Chat"
              description="A safe place for open and anonymous conversations. 🫂"
              color="text-pink-300"
            /></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainhome;
