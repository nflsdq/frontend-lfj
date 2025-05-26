import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Upload, X, Camera } from 'lucide-react';
import Button from '../common/Button';

const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewContainer = styled(motion.div)`
  width: 180px;
  height: 180px;
  border-radius: 24px;
  border: 3px solid black;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const UploadButton = styled(motion.label)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border-radius: 24px;
  border: 3px dashed black;
  background-color: #f8f8f8;
  cursor: pointer;
  
  input {
    display: none;
  }
`;

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: #FF3366;
  color: white;
  border: 2px solid black;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
`;

const PhotoUpload = ({ 
  initialPhoto = null,
  onPhotoChange,
  className = ''
}) => {
  const [preview, setPreview] = useState(initialPhoto);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should not exceed 2MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent component
    onPhotoChange(file);
  };
  
  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoChange(null);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <UploadContainer className={className}>
      {preview ? (
        <PreviewContainer 
          className="shadow-neo-md"
          whileHover={{ scale: 1.02 }}
        >
          <img src={preview} alt="Profile Preview" />
          
          <div className="overlay">
            <Button 
              variant="secondary" 
              onClick={triggerFileInput}
              className="px-3 py-2"
            >
              <Camera size={16} className="mr-1" />
              Change
            </Button>
          </div>
          
          <DeleteButton
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </DeleteButton>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </PreviewContainer>
      ) : (
        <UploadButton
          className="shadow-neo-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={32} className="mb-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Upload Photo</span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadButton>
      )}
    </UploadContainer>
  );
};

PhotoUpload.propTypes = {
  initialPhoto: PropTypes.string,
  onPhotoChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default PhotoUpload;