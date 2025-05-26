import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${props => props.$fullScreen ? '100vh' : '100%'};
  padding: 2rem;
`;

const LoadingDot = styled(motion.div)`
  width: ${props => props.$size || '20px'};
  height: ${props => props.$size || '20px'};
  border-radius: 50%;
  background-color: ${props => props.$color || '#FF3366'};
  margin: 0 4px;
  border: 2px solid black;
`;

const LoadingText = styled.div`
  font-weight: 600;
  margin-top: 1rem;
  font-family: 'Space Grotesk', sans-serif;
`;

const Loading = ({ 
  size = '20px', 
  color = '#FF3366', 
  text, 
  fullScreen = false,
  className = '' 
}) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -15, 0] }
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <LoadingContainer $fullScreen={fullScreen} className={className}>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <LoadingDot
            $size={size}
            $color="#FF3366"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0 }}
            className="shadow-neo-sm"
          />
          <LoadingDot
            $size={size}
            $color="#33FF99"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0.15 }}
            className="shadow-neo-sm"
          />
          <LoadingDot
            $size={size}
            $color="#6633FF"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0.3 }}
            className="shadow-neo-sm"
          />
        </div>
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </LoadingContainer>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading;