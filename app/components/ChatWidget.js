"use client";

// Update imports - remove unnecessary ones
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { RiRobot2Fill } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = {
  NAME: 0,
  MOBILE: 1,
  EMAIL: 2,
  TRIP_DURATION: 3,
  ARRIVAL_DATE: 4,
  TRAVELING_FROM: 5,
  HOTEL_CATEGORY: 6,
  GUESTS: 7,
  REQUIREMENTS: 8,
  COMPLETE: 9,
};

const hotelCategories = ["5 Star", "4 Star", "3 Star", "Heritage"];
const tripDurations = ["3-5", "6-8", "9-12", "13-15", "15+"];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm your travel assistant. What's your name?",
      type: "received",
    },
  ]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const messagesEndRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasNotification, setHasNotification] = useState(true); // Add notification state

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { content: message, type: "sent" }]);
    handleStepLogic(message);
    setMessage("");
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString();
    setFormData({ ...formData, arrivalDate: formattedDate });
    setSelectedDate(date);
    setShowDatePicker(false);

    setMessages((prev) => [
      ...prev,
      {
        content: formatDate(date),
        type: "sent",
      },
      {
        content: "Which country are you traveling from?",
        type: "received",
      },
    ]);
    setStep(STEPS.TRAVELING_FROM);
  };

  const renderOptions = (options, onSelect) => (
    <div className="flex flex-wrap gap-2 my-2 justify-center">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => {
            setMessage(option);
            onSelect(option);
          }}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
        >
          {option} {options === tripDurations ? "Days" : ""}
        </button>
      ))}
    </div>
  );

  const handleStepLogic = async (userMessage) => {
    switch (step) {
      case STEPS.NAME:
        setFormData({ ...formData, name: userMessage });
        setMessages((prev) => [
          ...prev,
          {
            content: "Great! Could you share your mobile number?",
            type: "received",
          },
        ]);
        setStep(STEPS.MOBILE);
        break;

      case STEPS.MOBILE:
        setFormData({ ...formData, mobile: userMessage });
        setMessages((prev) => [
          ...prev,
          { content: "What's your email address?", type: "received" },
        ]);
        setStep(STEPS.EMAIL);
        break;

      case STEPS.EMAIL:
        if (!userMessage.includes("@")) {
          setMessages((prev) => [
            ...prev,
            {
              content: "Please enter a valid email address.",
              type: "received",
            },
          ]);
          return;
        }
        setFormData({ ...formData, email: userMessage });
        setMessages((prev) => [
          ...prev,
          {
            content: "How many days would you like to travel?",
            type: "received",
          },
        ]);
        setStep(STEPS.TRIP_DURATION);
        break;

      case STEPS.TRIP_DURATION:
        setFormData({ ...formData, tripDuration: userMessage });
        setMessages((prev) => [
          ...prev,
          {
            content: "Please select your arrival date:",
            type: "received",
          },
        ]);
        setShowDatePicker(true);
        setStep(STEPS.ARRIVAL_DATE);
        break;

      case STEPS.ARRIVAL_DATE:
        // This will now be handled by handleDateSelect
        break;

      case STEPS.TRAVELING_FROM:
        setFormData({ ...formData, travelingFrom: userMessage });
        setMessages((prev) => [
          ...prev,
          {
            content: `What hotel category would you prefer? (${hotelCategories.join(
              ", "
            )})`,
            type: "received",
          },
        ]);
        setStep(STEPS.HOTEL_CATEGORY);
        break;

      case STEPS.HOTEL_CATEGORY:
        if (!hotelCategories.includes(userMessage)) {
          setMessages((prev) => [
            ...prev,
            {
              content: "Please select a hotel category:",
              type: "received",
            },
          ]);
          return;
        }
        setFormData({ ...formData, hotelCategory: userMessage });
        setMessages((prev) => [
          ...prev,
          { content: "How many guests will be traveling?", type: "received" },
        ]);
        setStep(STEPS.GUESTS);
        break;

      case STEPS.GUESTS:
        setFormData({ ...formData, guests: userMessage });
        setMessages((prev) => [
          ...prev,
          {
            content: "Any special requirements or preferences?",
            type: "received",
          },
        ]);
        setStep(STEPS.REQUIREMENTS);
        break;

      case STEPS.REQUIREMENTS:
        const finalData = {
          ...formData,
          specialRequirements: userMessage,
        };

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(finalData),
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            setMessages((prev) => [
              ...prev,
              {
                content:
                  "Thank you! We've received your inquiry and will get back to you soon!",
                type: "received",
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                content:
                  "Sorry, there was an error submitting your inquiry. Please try again later.",
                type: "received",
              },
            ]);
          }
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              content:
                "Sorry, there was an error submitting your inquiry. Please try again later.",
              type: "received",
            },
          ]);
        }
        setStep(STEPS.COMPLETE);
        break;

      case STEPS.COMPLETE:
        // Reset the chat if user wants to start over
        setStep(STEPS.NAME);
        setFormData({});
        setMessages([
          {
            content: "Hello! I'm your travel assistant. What's your name?",
            type: "received",
          },
        ]);
        break;
    }
  };

  const MessageBubble = ({ content, type }) => (
    <div
      className={`mb-4 flex ${
        type === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          type === "sent"
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {content}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-white rounded-lg shadow-xl flex flex-col w-80 h-[500px] relative"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RiRobot2Fill size={24} className="animate-bounce" />
                <div>
                  <h3 className="font-semibold">Travel Assistant</h3>
                  <p className="text-sm opacity-90">How can we help you?</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-75"
              >
                <IoClose size={24} />
              </motion.button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} {...msg} />
              ))}

              {/* Show trip duration options */}
              {step === STEPS.TRIP_DURATION &&
                renderOptions(tripDurations, (selected) => {
                  handleSendMessage({
                    preventDefault: () => {},
                    target: { value: selected },
                  });
                })}

              {/* Show hotel category options */}
              {step === STEPS.HOTEL_CATEGORY &&
                renderOptions(hotelCategories, (selected) => {
                  handleSendMessage({
                    preventDefault: () => {},
                    target: { value: selected },
                  });
                })}

              {/* Show date picker */}
              {showDatePicker && (
                <div className="flex flex-col items-center mb-4 bg-white rounded-lg shadow-md p-4">
                  <div className="w-full">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      minDate={new Date()}
                      inline
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      calendarClassName="!bg-white !border-0"
                      wrapperClassName="!w-full"
                      dayClassName={(date) =>
                        date.getTime() === (selectedDate?.getTime() || 0)
                          ? "!bg-indigo-600 !text-white hover:!bg-indigo-700"
                          : "hover:!bg-indigo-100"
                      }
                      customInput={
                        <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:border-indigo-600">
                          <span>
                            {selectedDate
                              ? formatDate(selectedDate)
                              : "Select date"}
                          </span>
                          <IoCalendarOutline />
                        </button>
                      }
                    />
                  </div>
                  <style jsx global>{`
                    .react-datepicker {
                      font-family: inherit;
                      border-radius: 0.5rem;
                      border: 1px solid #e5e7eb;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }
                    .react-datepicker__header {
                      background: white;
                      border-bottom: 1px solid #e5e7eb;
                      border-radius: 0.5rem 0.5rem 0 0;
                      padding-top: 1rem;
                    }
                    .react-datepicker__day--selected {
                      background-color: #4f46e5 !important;
                      color: white !important;
                    }
                    .react-datepicker__day:hover {
                      background-color: #eef2ff !important;
                    }
                    .react-datepicker__day--keyboard-selected {
                      background-color: #818cf8 !important;
                    }
                    .react-datepicker__navigation {
                      top: 1rem;
                    }
                    .react-datepicker__month-select,
                    .react-datepicker__year-select {
                      padding: 0.25rem;
                      border-radius: 0.25rem;
                      border: 1px solid #e5e7eb;
                    }
                  `}</style>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-indigo-600"
                disabled={
                  showDatePicker ||
                  step === STEPS.TRIP_DURATION ||
                  step === STEPS.HOTEL_CATEGORY
                }
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"
                disabled={
                  showDatePicker ||
                  step === STEPS.TRIP_DURATION ||
                  step === STEPS.HOTEL_CATEGORY
                }
              >
                <IoMdSend size={20} />
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsOpen(true);
                setHasNotification(false);
              }}
              className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700"
            >
              <RiRobot2Fill size={24} className="animate-pulse" />
            </motion.button>
            {hasNotification && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-full h-full bg-red-500 rounded-full"
                />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
