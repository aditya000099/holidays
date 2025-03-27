"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Animated section component for scroll animations
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Service card component with micro-animations
const ServiceCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl relative overflow-hidden group border border-indigo-100/20"
      whileHover={{
        y: -5,
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100/20 to-teal-100/20 group-hover:scale-150 transition-all duration-500"></div>
      <motion.div
        className="text-indigo-600/90 text-4xl mb-4"
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-indigo-900/80 mb-2">{title}</h3>
      <p className="text-indigo-700/60">{description}</p>
    </motion.div>
  );
};

// Animated background element
const FloatingElement = ({ children, x, y, duration, delay }) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      animate={{
        y: [y, y - 15, y],
        x: [x, x + 5, x],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// Modify DynamicBackground to use fixed positions
const DynamicBackground = () => {
  const positions = [
    { width: 200, height: 200, left: 10, top: 20 },
    { width: 150, height: 150, left: 30, top: 40 },
    { width: 180, height: 180, left: 60, top: 15 },
    { width: 220, height: 220, left: 80, top: 60 },
    { width: 160, height: 160, left: 45, top: 75 },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-indigo-200/10 to-teal-200/10"
          style={{
            width: pos.width,
            height: pos.height,
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-indigo-50/30 to-teal-50/30"
    >
      {/* Hero section */}
      <motion.div className="h-screen relative flex items-center justify-center overflow-hidden">
        <DynamicBackground />

        <div className="container mx-auto px-4 z-10 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto relative"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600">
              Turbans and Traditions
            </h1>
            <p className="text-2xl md:text-3xl text-indigo-800/70 mb-6">
              Crafting Authentic Indian Experiences
            </p>
            <p className="text-lg md:text-xl text-indigo-600/60 mb-8">
              Since 2010 | New Delhi, India
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="#learn-more">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-teal-600 text-white rounded-full font-medium"
                >
                  Our Story
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/90 text-indigo-600 rounded-full font-medium border border-indigo-100"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Update all amber/yellow colors to indigo/teal in the rest of the code */}
      <div className="bg-white/80 backdrop-blur-sm py-20" id="learn-more">
        <div className="container mx-auto px-4">
          {/* Story section */}
          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto mb-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-600">
                  Our Story
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Turbans and Traditions was born from a deep love of India's
                vibrant cultural tapestry and a desire to share authentic
                experiences with travelers from around the world. Founded in
                2010, our journey began with a simple mission: to create
                immersive holiday experiences that connect visitors with the
                heart and soul of Indian traditions.
              </p>
              <p className="text-lg text-gray-600">
                From the colorful streets of Rajasthan to the serene backwaters
                of Kerala, our team of passionate local experts has carefully
                crafted experiences that go beyond the typical tourist paths,
                allowing you to discover the true essence of India's diverse
                heritage.
              </p>
            </div>
          </AnimatedSection>

          {/* Services section */}
          <div className="mb-20">
            <AnimatedSection delay={0.3}>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
                Our{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-600">
                  Services
                </span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard
                title="Cultural Tour Packages"
                description="Immerse yourself in India's rich traditions with our carefully curated cultural tours that showcase authentic local experiences."
                icon="🏛️"
                delay={0.4}
              />
              <ServiceCard
                title="Festival Celebrations"
                description="Experience the vibrant colors and joyous atmosphere of India's most celebrated festivals with our special event packages."
                icon="🎭"
                delay={0.5}
              />
              <ServiceCard
                title="Heritage Accommodations"
                description="Stay in carefully selected heritage properties that blend traditional architecture with modern comforts."
                icon="🏰"
                delay={0.6}
              />
              <ServiceCard
                title="Culinary Experiences"
                description="Discover the diverse flavors of Indian cuisine through cooking classes, food tours, and dining experiences."
                icon="🍛"
                delay={0.7}
              />
              <ServiceCard
                title="Artisan Workshops"
                description="Learn traditional crafts directly from skilled artisans and create your own cultural souvenirs."
                icon="🧵"
                delay={0.8}
              />
              <ServiceCard
                title="Personalized Itineraries"
                description="Work with our experts to create a custom journey tailored to your interests, timeline, and preferences."
                icon="📝"
                delay={0.9}
              />
            </div>
          </div>

          {/* Values section with staggered animation */}
          <AnimatedSection delay={0.4}>
            <div
              className="bg-gradient-to-br from-indigo-50/50 to-teal-50/50 rounded-3xl p-10 mb-20 relative overflow-hidden backdrop-blur-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            >
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
                  Our{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-600">
                    Values
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl border border-indigo-100"
                  >
                    <h3 className="text-xl font-bold text-indigo-600 mb-3">
                      Authentic Experiences
                    </h3>
                    <p className="text-gray-600">
                      We're committed to showcasing the genuine cultural
                      heritage of India, going beyond tourist attractions to
                      connect you with real traditions and communities.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-bold text-indigo-600 mb-3">
                      Sustainable Tourism
                    </h3>
                    <p className="text-gray-600">
                      We believe in responsible travel that respects local
                      communities, preserves cultural heritage, and minimizes
                      environmental impact.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-bold text-indigo-600 mb-3">
                      Local Expertise
                    </h3>
                    <p className="text-gray-600">
                      Our team consists of passionate locals who bring intimate
                      knowledge and personal connections to create unique,
                      insider experiences.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-bold text-indigo-600 mb-3">
                      Personalized Service
                    </h3>
                    <p className="text-gray-600">
                      We understand that every traveler is unique, which is why
                      we tailor each journey to your specific interests and
                      preferences.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Testimonials section with card animation */}
          <AnimatedSection delay={0.5}>
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
                What Our{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-600">
                  Guests Say
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                      S
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Sarah J.</h4>
                      <p className="text-sm text-gray-500">United Kingdom</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "Our journey through Rajasthan with Turbans and Traditions
                    was nothing short of magical. The attention to detail and
                    the authentic experiences they arranged made us feel like we
                    truly connected with India's soul."
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                      M
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Michael T.</h4>
                      <p className="text-sm text-gray-500">Australia</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "The festival tour exceeded all our expectations. From the
                    accommodations to the local guides, everything was perfectly
                    organized. We came as tourists but left feeling like we had
                    experienced something truly special."
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                      A
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Aiko N.</h4>
                      <p className="text-sm text-gray-500">Japan</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "What sets Turbans and Traditions apart is their deep
                    knowledge and passion. They took the time to understand what
                    we wanted and created a journey that perfectly balanced
                    cultural experiences with relaxation."
                  </p>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA section with parallax effect */}
          <AnimatedSection delay={0.6}>
            <div
              className="bg-gradient-to-br from-indigo-500/90 via-purple-500/90 to-teal-500/90 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.8, 0.7],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"
              ></motion.div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Embark on a Cultural Adventure?
                </h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Let us help you discover the beauty, traditions, and vibrant
                  cultures of India with a personalized journey tailored just
                  for you.
                </p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 30px -10px rgba(79, 70, 229, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/90 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600 rounded-full font-medium text-lg hover:bg-white transition-all duration-300"
                >
                  Plan Your Journey
                </motion.button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
