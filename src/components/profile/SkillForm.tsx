import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { FileUp, X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { skillsAPI } from '../../services/api';
import { SKILL_LEVELS } from '../../utils/constants';

// Form validation schema
const schema = yup.object({
  nama_skill: yup.string().required('Skill name is required'),
  level: yup.string().required('Skill level is required')
    .oneOf(SKILL_LEVELS, 'Invalid skill level'),
  // sertifikasi is handled separately as a file
}).required();

const SkillForm = ({ 
  skill = null, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certFileName, setCertFileName] = useState(skill?.sertifikasi || '');
  const fileInputRef = useRef(null);
  
  const isEditing = !!skill;
  
  // Set default values for the form
  const defaultValues = {
    nama_skill: skill?.nama_skill || '',
    level: skill?.level || '',
  };
  
  // Initialize form with validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertFile(file);
      setCertFileName(file.name);
    }
  };
  
  const clearFile = () => {
    setCertFile(null);
    setCertFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('nama_skill', data.nama_skill);
      formData.append('level', data.level);
      
      if (certFile) {
        formData.append('sertifikasi', certFile);
      }
      
      if (isEditing) {
        await skillsAPI.updateSkill(skill.id, formData);
        toast.success('Skill updated successfully');
      } else {
        await skillsAPI.createSkill(formData);
        toast.success('Skill added successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Skill form error:', error);
      // Error is handled by the API interceptor in api.js
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Skill Name"
          name="nama_skill"
          placeholder="e.g. JavaScript, Project Management, etc."
          error={errors.nama_skill?.message}
          required
          {...register('nama_skill')}
        />
        
        <div className="space-y-2">
          <label className="font-medium block">
            Skill Level
            <span className="text-primary ml-1">*</span>
          </label>
          
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-accent focus:outline-none focus:shadow-none"
            {...register('level')}
          >
            <option value="">Select Skill Level</option>
            {SKILL_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          
          {errors.level && (
            <span className="text-primary text-sm">{errors.level.message}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="font-medium block">
            Certification (optional)
          </label>
          
          <div className="flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex-1 flex items-center p-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
              {certFileName ? (
                <>
                  <span className="flex-1 truncate">{certFileName}</span>
                  <button 
                    type="button" 
                    onClick={clearFile}
                    className="ml-2"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <span className="text-gray-400">No file selected</span>
              )}
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="ml-2 py-2"
              onClick={() => fileInputRef.current.click()}
            >
              <FileUp size={18} className="mr-1" />
              Browse
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Accepted formats: PDF, JPG, PNG (Max 2MB)
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Skill' : 'Add Skill'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

SkillForm.propTypes = {
  skill: PropTypes.shape({
    id: PropTypes.number,
    nama_skill: PropTypes.string,
    level: PropTypes.string,
    sertifikasi: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default SkillForm;