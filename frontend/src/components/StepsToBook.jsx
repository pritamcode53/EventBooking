import React from "react";
import { Calendar, CheckCircle, CreditCard, Mail, Home } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    icon: <Home className="w-8 h-8 text-green-600" />,
    title: "Browse Venues",
    desc: "Explore a wide range of wedding venues tailored to your dream celebration.",
  },
  {
    id: 2,
    icon: <Calendar className="w-8 h-8 text-green-600" />,
    title: "Check Availability",
    desc: "View available dates instantly and select the one that suits your big day.",
  },
  {
    id: 3,
    icon: <Mail className="w-8 h-8 text-green-600" />,
    title: "Send Booking Request",
    desc: "Send your booking request directly to the venue manager for quick confirmation.",
  },
  {
    id: 4,
    icon: <CreditCard className="w-8 h-8 text-green-600" />,
    title: "Make Payment",
    desc: "Complete your booking securely through our integrated payment gateway.",
  },
  {
    id: 5,
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    title: "Get Confirmation",
    desc: "Receive instant confirmation with all the details and invoice in your inbox.",
  },
];

const StepsToBook = () => {
  return (
    <div className="bg-gradient-to-b from-white via-green-50 to-white py-16 px-6 sm:px-12 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Steps to <span className="text-green-600">Book Your Venue</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          Follow these simple steps to plan your perfect wedding venue booking effortlessly.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid gap-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 place-items-center">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 w-full max-w-[220px]"
          >
            <div className="bg-green-100 rounded-full p-4 mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-500 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Connector line for large screens */}
      <div className="hidden xl:block absolute left-1/2 transform -translate-x-1/2 mt-12">
        <div className="w-[80%] h-1 bg-pink-100 mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default StepsToBook;
