import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { experienceAPI } from '../../services/api';

// Form validation schema
const schema = yup.object({
  institusi: yup.string().required('Company name is required'),
  posisi: yup.string().required('Position is required'),
  lokasi: yup.string().required('Location is required'),
  tanggal_mulai: yup.date().required('Start date is required'),
  tanggal_akhir: yup.date().nullable(),
  deskripsi: yup.string(),
}).required();

const ExperienceForm = ({ 
  experience = null, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!experience;
  
  // Set default values for the form
  const defaultValues = {
    institusi: experience?.institusi || '',
    posisi: experience?.posisi || '',
    lokasi: experience?.lokasi || '',
    tanggal_mulai: experience?.tanggal_mulai ? experience.tanggal_mulai.substring(0, 10) : '',
    tanggal_akhir: experience?.tanggal_akhir ? experience.tanggal_akhir.substring(0, 10) : '',
    deskripsi: experience?.deskripsi || '',
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
        await experienceAPI.updateExperience(experience.id, data);
        toast.success('Experience updated successfully');
      } else {
        await experienceAPI.createExperience(data);
        toast.success('Experience added successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Experience form error:', error);
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
          label="Company Name"
          name="institusi"
          placeholder="e.g. Acme Corporation"
          error={errors.institusi?.message}
          required
          {...register('institusi')}
        />
        
        <Input
          label="Position"
          name="posisi"
          placeholder="e.g. Software Engineer"
          error={errors.posisi?.message}
          required
          {...register('posisi')}
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
        
        <div>
          <label className="font-medium mb-1 block">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-accent focus:outline-none focus:shadow-none"
            rows="4"
            placeholder="Describe your responsibilities and achievements..."
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Experience' : 'Add Experience'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

ExperienceForm.propTypes = {
  experience: PropTypes.shape({
    id: PropTypes.number,
    institusi: PropTypes.string,
    posisi: PropTypes.string,
    lokasi: PropTypes.string,
    tanggal_mulai: PropTypes.string,
    tanggal_akhir: PropTypes.string,
    deskripsi: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ExperienceForm;