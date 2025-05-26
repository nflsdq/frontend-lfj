import React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(motion.main)`
  flex: 1;
`;

// Pattern background with the neobrutalism aesthetic
const PatternBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.04;
  pointer-events: none;
`;

const MainLayout = () => {
  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <LayoutContainer>
      {/* Background pattern */}
      <PatternBackground className='pattern-bg' />

      {/* Navigation */}
      <Navbar />

      {/* Main content with animation */}
      <MainContent
        initial='initial'
        animate='animate'
        exit='exit'
        variants={pageVariants}
        className='min-h-screen px-4 md:px-12'
      >
        <Outlet />
      </MainContent>

      {/* Footer */}
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;
