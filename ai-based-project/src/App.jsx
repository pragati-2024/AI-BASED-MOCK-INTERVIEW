import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './home/Page';
import Contact from './contact-us/Page';
import Tips from './interview-tips/Page';
import Login from './login/Page';
import NotFound from './error/Page';
import Footer from './footer/Page';
import Navbar from './Navbar/Page';







const App = () => {
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default App