import React from 'react';
import Home from "./Pages/Home.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;