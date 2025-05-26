import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { educationAPI } from '../../services/api';
import { EDUCATION_LEVELS } from '../../utils/constants';

// Form validation schema
const schema = yup.object({
  institusi: yup.string().required('Institution name is required'),
  jenjang: yup.string().required('Education level is required')
    .oneOf(EDUCATION_LEVELS, 'Invalid education level'),
  jurusan: yup.string().required('Major/program is required'),
  lokasi: yup.string().required('Location is required'),
  tanggal_mulai: yup.date().required('Start date is required'),
  tanggal_akhir: yup.date().nullable(),
  ipk: yup.number().nullable().transform((value) => (isNaN(value) ? null : value))
    .min(0, 'GPA must be at least 0')
    .max(4, 'GPA must not exceed 4'),
  deskripsi: yup.string(),
}).required();

const EducationForm = ({ 
  education = null, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!education;
  
  // Set default values for the form
  const defaultValues = {
    institusi: education?.institusi || '',
    jenjang: education?.jenjang || '',
    jurusan: education?.jurusan || '',
    lokasi: education?.lokasi || '',
    tanggal_mulai: education?.tanggal_mulai ? education.tanggal_mulai.substring(0, 10) : '',
    tanggal_akhir: education?.tanggal_akhir ? education.tanggal_akhir.substring(0, 10) : '',
    ipk: education?.ipk || '',
    deskripsi: education?.deskripsi || '',
  };
  
  // Initialize form with validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      if (isEditing) {
        await educationAPI.updateEducation(education.id, data);
        toast.success('Education updated successfully');
      } else {
        await educationAPI.createEducation(data);
        toast.success('Education added successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Education form error:', error);
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
          label="Institution Name"
          name="institusi"
          placeholder="e.g. University of Indonesia"
          error={errors.institusi?.message}
          required
          {...register('institusi')}
        />
        
        <div className="space-y-2">
          <label className="font-medium block">
            Education Level
            <span className="text-primary ml-1">*</span>
          </label>
          
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-accent focus:outline-none focus:shadow-none"
            {...register('jenjang')}
          >
            <option value="">Select Education Level</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          
          {errors.jenjang && (
            <span className="text-primary text-sm">{errors.jenjang.message}</span>
          )}
        </div>
        
        <Input
          label="Major/Program"
          name="jurusan"
          placeholder="e.g. Computer Science"
          error={errors.jurusan?.message}
          required
          {...register('jurusan')}
        />
        
        <Input
          label="Location"
          name="lokasi"
          placeholder="e.g. Jakarta, Indonesia"
          error={errors.lokasi?.message}
          required
          {...register('lokasi')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="tanggal_mulai"
            type="date"
            error={errors.tanggal_mulai?.message}
            required
            {...register('tanggal_mulai')}
          />
          
          <Input
            label="End Date"
            name="tanggal_akhir"
            type="date"
            error={errors.tanggal_akhir?.message}
            {...register('tanggal_akhir')}
          />
        </div>
        
        <Input
          label="GPA (0-4)"
          name="ipk"
          type="number"
          step="0.01"
          min="0"
          max="4"
          placeholder="e.g. 3.50"
          error={errors.ipk?.message}
          {...register('ipk')}
        />
        
        <div>
          <label className="font-medium mb-1 block">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-accent focus:outline-none focus:shadow-none"
            rows="4"
            placeholder="Describe your academic achievements, activities, etc."
            {...register('deskripsi')}
          ></textarea>
          {errors.deskripsi && (
            <span className="text-primary text-sm mt-1">{errors.deskripsi.message}</span>
          )}
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Education' : 'Add Education'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

EducationForm.propTypes = {
  education: PropTypes.shape({
    id: PropTypes.number,
    institusi: PropTypes.string,
    jenjang: PropTypes.string,
    jurusan: PropTypes.string,
    lokasi: PropTypes.string,
    tanggal_mulai: PropTypes.string,
    tanggal_akhir: PropTypes.string,
    ipk: PropTypes.number,
    deskripsi: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EducationForm;