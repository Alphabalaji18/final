import React, { useState } from "react";
import { FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const employees = [
  { id: 1, name: "Balaji", age: 21, gender: "Male", phNo: "9342874173" },
  { id: 2, name: "Sandy", age: 28, gender: "Male", phNo: "9362622255" },
  { id: 3, name: "Dhanush", age: 35, gender: "Male", phNo: "8838319686" },
  { id: 4, name: "Emily Davis", age: 32, gender: "Female", phNo: "9566319064" },
  { id: 5, name: "Chris Wilson", age: 29, gender: "Male", phNo: "333-444-5555" },
  { id: 6, name: "Sophia Martinez", age: 31, gender: "Female", phNo: "222-333-4444" },
];

const Call = () => {
  const [visiblePhones, setVisiblePhones] = useState([]);

  const togglePhoneVisibility = (id) => {
    setVisiblePhones((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center pt-20 px-4 pb-12">
      <h1 className="text-4xl font-extrabold text-white mb-12 drop-shadow-lg text-center">
        📞 Call an Employee
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-lg transform transition duration-300 hover:scale-[1.03] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 rounded-3xl transition duration-500 pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-2">👤 {employee.name}</h2>
            <p className="text-white/90">🎂 Age: {employee.age}</p>
            <p className="text-white/90">⚧ Gender: {employee.gender}</p>

            <div className="mt-2 flex items-center justify-between text-white/90">
              <span>
                📞 {visiblePhones.includes(employee.id) ? employee.phNo : "Hidden"}
              </span>
              <button
                onClick={() => togglePhoneVisibility(employee.id)}
                className="text-white hover:text-yellow-300 transition"
                title="Toggle phone number"
              >
                {visiblePhones.includes(employee.id) ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <a
              href={`tel:${employee.phNo}`}
              className="mt-5 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition duration-200 w-full justify-center"
            >
              <FaPhoneAlt />
              Call
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Call;
