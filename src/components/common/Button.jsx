import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import PropTypes from "prop-types";

// Styled component for the button
const StyledButton = styled(motion.button)`
  font-weight: 600;
  border: 2px solid black;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:hover {
    box-shadow: none !important;
  }
`;

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  fullWidth = false,
  ...props
}) => {
  // Define button variants
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-black",
    accent: "bg-accent text-white",
    outline: "bg-white text-black border-2 border-black",
  };

  // Define shadow based on variant
  const getShadow = () => {
    if (disabled) return "shadow-none";

    switch (variant) {
      case "primary":
        return "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]";
      case "secondary":
        return "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]";
      case "accent":
        return "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]";
      case "outline":
        return "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]";
      default:
        return "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]";
    }
  };

  return (
    <StyledButton
      className={`
        px-6 py-3 rounded-2xl
        ${variants[variant]}
        ${getShadow()}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileTap={{
        scale: disabled ? 1 : 0.97,
        y: disabled ? 0 : 4,
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "accent", "outline"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
