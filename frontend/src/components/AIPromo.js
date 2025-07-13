import React from "react";
import { useNavigate } from "react-router-dom";

const AIPromo = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 px-6 bg-zinc-900 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">🚀 Build Courses with AI</h2>
      <p className="max-w-xl mx-auto text-zinc-400 mb-6">
        Save hours of planning. Generate entire course outlines and module structures using AI.
      </p>
      <button
onClick={() => navigate("/ai-course-builder")}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg shadow"
      >
        Try AI Course Builder
      </button>
    </section>
  );
};

export default AIPromo;
