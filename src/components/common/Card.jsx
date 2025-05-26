import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledCard = styled(motion.div)`
  position: relative;
  background-color: white;
  border: 2px solid black;
  border-radius: 24px;
  overflow: hidden;
`;

const Card = ({
  children,
  className = "",
  onClick,
  hoverEffect = true,
  shadowSize = "md",
  ...props
}) => {
  // Define shadow sizes
  const shadowSizes = {
    sm: "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]",
    md: "shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]",
    lg: "shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)]",
    xl: "shadow-[16px_16px_0px_0px_rgba(0,0,0,0.8)]",
  };

  return (
    <StyledCard
      className={`p-6 ${shadowSizes[shadowSize]} ${className}`}
      onClick={onClick}
      whileHover={
        hoverEffect
          ? { y: -5, x: -5, boxShadow: "12px 12px 0px 0px rgba(0,0,0,0.8)" }
          : {}
      }
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
  shadowSize: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};

export default Card;
