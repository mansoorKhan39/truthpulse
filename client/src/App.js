import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Sentiment from "./pages/Sentiment";
import TopicTrends from "./pages/TopicTrends";
import WordAnalysis from "./pages/WordAnalysis";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="noise" />
      <Navbar />
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/sentiment"element={<Sentiment />} />
        <Route path="/trends"   element={<TopicTrends />} />
        <Route path="/words"    element={<WordAnalysis />} />
        <Route path="/about"    element={<About />} />
      </Routes>
    </Router>
  );
}
