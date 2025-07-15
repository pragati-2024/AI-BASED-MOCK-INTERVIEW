import React from 'react';
import Home from "./Pages/Home.jsx";
import InterviewTips from "./components/InterviewTips.jsx";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import Login from './components/Login.jsx';
import ContactUs from './components/ContactUs.jsx';
import Eror404 from './components/Eror404.jsx'; 
import AboutUs from './components/AboutUs.jsx';
import PracticeInterview from './Pages/Dashboard.jsx';
import Reports from './Pages/Reports.jsx';
import Profile from './Pages/Profile.jsx';
import Settings from './Pages/Settings.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'



import "./App.css";
import Dashboard from './Pages/Dashboard.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Header/><Home/><Footer/></>
    },
    {
      path: "/login",
      element: <><Header/><Login/></>
    },
    {
      path: "/dashboard",
      element: <><Header/><Dashboard/></>
    },
    {
      path: "/interviewtips",
      element: <><Header/><InterviewTips/><Footer/></>
    },
    {
      path: "/contactus",
      element: <><Header/><ContactUs/><Footer/></>
    },
    {
      path: "/aboutus",
      element: <><Header/><AboutUs/><Footer/></>
    },
    {
      path: "/reports",
      element: <><Header/><Reports/><Footer/></>
    },
    {
      path: "/profile",
      element: <><Header/><Profile/><Footer/></>
    },
    {
      path: "/settings",
      element: <><Header/><Settings/><Footer/></>
    },
  ])
    return (
      <>

        <RouterProvider router={router} />
      </>
    )
}

export default App;