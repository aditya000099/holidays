"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function SearchBox({ cities }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setSearchTerm(city.name);
    setShowCities(false);

    // Navigate to the country page based on the city's country
    router.push(`/countries/${city.country.name.replace(/\s+/g, "-")}`);
  };

  // Calendar helper functions
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    setShowCalendar(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(day)}
          disabled={isPast}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isToday ? "bg-blue-500 text-white" : "text-gray-900"} 
            ${!isPast ? "hover:bg-blue-100" : "text-gray-300"}
            ${isPast ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full mx-auto bg-white/90 backdrop-blur-sm p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
            <CiLocationOn className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <input
            type="text"
            placeholder="Where to go?"
            className="w-full text-black text-sm sm:text-base pl-8 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-0 ring-1 ring-gray-200 focus:ring-blue-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowCities(true);
            }}
            onFocus={() => setShowCities(true)}
          />

          {/* City suggestions dropdown */}
          {showCities && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white text-black rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                    onClick={() => handleCityClick(city)}
                  >
                    <CiLocationOn className="mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-gray-500">
                        {city.country.name}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No cities found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-indigo-600">
            <CiCalendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <input
            type="text"
            placeholder="When?"
            className="w-full text-sm sm:text-base pl-8 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-0 ring-1 ring-gray-200 focus:ring-blue-500 transition-all duration-300"
            value={selectedDate}
            onClick={() => setShowCalendar(!showCalendar)}
            readOnly
          />

          {/* Calendar Dropdown */}
          {showCalendar && (
            <div className="absolute z-20 mt-1 w-72 bg-white rounded-xl text-black shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
                  }
                  className="p-1 hover:bg-gray-100 rounded-full text-black"
                >
                  <IoIosArrowBack className="text-zinc-800" />
                </button>
                <span className="font-medium text-zinc-900">
                  {months[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={() =>
                    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
                  }
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <IoIosArrowForward className="text-zinc-800" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>
          )}
        </div>

        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
          <BsSearch className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
