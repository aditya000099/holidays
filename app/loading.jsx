"use client";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-zinc-900 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-300 border-t-transparent"></div>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
