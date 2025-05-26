import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import CV from './pages/CV';
import AI from './pages/AI';

// Components
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* App routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="cv" element={<CV />} />
          <Route path="ai" element={<AI />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;