import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const StyledInput = styled(motion.input)`
  width: 100%;
  border: 2px solid black;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledLabel = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.span`
  color: #ff3366;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  font-weight: 500;
`;

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      className = "",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper>
        {label && (
          <StyledLabel htmlFor={name}>
            {label}
            {required && <span className='text-primary ml-1'>*</span>}
          </StyledLabel>
        )}
        <StyledInput
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
          px-4 py-3 rounded-xl
          shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
          focus:ring-2 focus:ring-accent focus:shadow-none
          disabled:opacity-70 disabled:cursor-not-allowed
          ${error ? "border-primary" : "border-black"}
          ${className}
        `}
          ref={ref}
          whileFocus={{
            y: 0,
            x: 0,
            boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
          }}
          {...props}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
