"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-teal-500";
const ACCENT_TEXT = "text-teal-400";
const ACCENT_GLOW = "shadow-teal-500/20";

export default function FoodLabelDecoder() {
  const [ingredientsList, setIngredientsList] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [dailyDietContext, setDailyDietContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientsList || !servingSize) {
      setError("Please fill in at least ingredients and serving size.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientsList, servingSize, dailyDietContext }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🏷️</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Food Label Nutrition Decoder</h1>
          <p className="text-sm text-gray-400">NOVA ratings, additive concerns & whole-food swaps</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ingredients List</label>
            <textarea value={ingredientsList} onChange={e => setIngredientsList(e.target.value)} rows={6} placeholder="Paste the full ingredients list from the nutrition label..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none font-mono text-xs" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Serving Size</label>
            <input value={servingSize} onChange={e => setServingSize(e.target.value)} placeholder="e.g., 1 cup (240ml), 2 biscuits, 30g"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Daily Diet Context (optional)</label>
            <textarea value={dailyDietContext} onChange={e => setDailyDietContext(e.target.value)} rows={3} placeholder="e.g., Keto diet, low-sodium, diabetic meal plan, athletic nutrition..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Analyzing Label..." : "Decode Nutrition Label"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your nutrition analysis will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
