"use client";
import { useState, useEffect } from "react";

// Universal Skeleton Loader Component
export const SkeletonLoader = ({
  type = "default", // default, card, list, text, banner
  count = 1, // Number of skeleton items to show
  className = "", // Additional classes
  height, // Optional fixed height
  width, // Optional fixed width
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", // Default grid layout
}) => {
  // Card skeleton - useful for products, packages, etc.
  const CardSkeleton = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  // Text block skeleton - for paragraphs, articles
  const TextSkeleton = () => (
    <div className="space-y-3">
      <div className="h-7 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  // List item skeleton
  const ListSkeleton = () => (
    <div className="flex items-center space-x-3 border-b border-gray-100 py-3">
      <div className="h-12 w-12 rounded-full bg-gray-300 flex-shrink-0"></div>
      <div className="flex-grow">
        <div className="h-5 bg-gray-200 rounded w-3/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </div>
  );

  // Banner/hero section skeleton
  const BannerSkeleton = () => (
    <div className="w-full h-64 md:h-80 bg-gray-300 rounded-lg"></div>
  );

  // Default skeleton - simple blocks
  const DefaultSkeleton = () => (
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );

  // Render the appropriate skeleton based on type
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return <CardSkeleton />;
      case "text":
        return <TextSkeleton />;
      case "list":
        return <ListSkeleton />;
      case "banner":
        return <BannerSkeleton />;
      default:
        return <DefaultSkeleton />;
    }
  };

  // For grid layouts (like cards)
  if (type === "card") {
    return (
      <div className={`grid ${gridCols} gap-6 ${className} animate-pulse`}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
      </div>
    );
  }

  // For sequential items (like lists or text blocks)
  return (
    <div
      className={`space-y-6 ${className} animate-pulse`}
      style={{ height, width }}
    >
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
    </div>
  );
};

// Enhanced spinner loader with better visuals and animation
const Loading = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Show loading message after a delay to avoid flashing for quick loads
  useEffect(() => {
    const messageTimer = setTimeout(() => setShowMessage(true), 300);
    return () => clearTimeout(messageTimer);
  }, []);

  // Simulate loading progress with smoother animation
  useEffect(() => {
    // Start with small increments that grow larger
    const incrementValues = [2, 5, 8, 10, 15, 20];
    let currentStep = 0;
    let progressTimer;

    const simulateProgress = () => {
      setLoadingProgress((prev) => {
        // Get current increment based on progress phase
        const increment =
          incrementValues[Math.min(currentStep, incrementValues.length - 1)];
        currentStep += 1;

        // Calculate next progress value
        const nextProgress = prev + (Math.random() * 0.5 + 0.5) * increment;

        // Cap at 92% for "waiting" effect
        return nextProgress > 92 ? 92 : nextProgress;
      });

      // Gradually increase intervals between updates for realistic effect
      const nextDelay = 200 + currentStep * 50;
      progressTimer = setTimeout(simulateProgress, Math.min(nextDelay, 800));
    };

    // Initial delay
    progressTimer = setTimeout(simulateProgress, 100);
    return () => clearTimeout(progressTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-amber-50 text-zinc-900 font-[family-name:var(--font-geist-sans)] px-4">
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full bg-white p-8 rounded-2xl ">
        {/* Logo with better styling */}
        <div className="mb-2 relative h-28 w-full flex justify-center">
          <img
            src="/tnt.png"
            alt="Turbans & Traditions"
            className="h-full w-auto object-contain"
            onError={(e) => {
              // Fallback if logo image fails to load
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback logo with improved styling */}
          <div className="hidden absolute inset-0 m-auto w-24 h-24 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center ">
            <span className="text-white text-3xl font-bold">T&T</span>
          </div>
        </div>

        {/* Fixed progress bar structure */}
        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-700 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Enhanced loading text */}
        {showMessage && (
          <div className="text-center">
            <p className="text-xl font-medium text-zinc-800 flex items-center justify-center">
              Discovering experiences
              <span className="inline-flex ml-2 space-x-1">
                <span
                  className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                  style={{ animationDuration: "0.8s", animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDuration: "0.8s", animationDelay: "200ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                  style={{ animationDuration: "0.8s", animationDelay: "400ms" }}
                ></span>
              </span>
            </p>
            <p className="text-sm text-zinc-500 mt-2 italic">
              Preparing your cultural journey across India
            </p>
          </div>
        )}
      </div>

      {/* Credit text */}
      <p className="text-xs text-zinc-400 mt-6">
        Turbans & Traditions © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Loading;
