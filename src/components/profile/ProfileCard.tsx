import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { User, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

const ProfileImage = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  border: 3px solid black;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ProfileDetails = styled.div`
  flex: 1;
  
  @media (min-width: 768px) {
    margin-left: 2rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const ProfileCard = ({ 
  user, 
  isLoading = false, 
  onEdit,
  className = ''
}) => {
  // Default image if user has no photo
  const profileImage = user?.foto_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg';
  
  return (
    <Card className={`overflow-visible ${className}`}>
      <ProfileInfo>
        <ProfileImage 
          whileHover={{ scale: 1.05 }}
          className="shadow-neo-md mx-auto md:mx-0 mb-4 md:mb-0"
        >
          <img 
            src={profileImage} 
            alt={user?.nama || 'Profile'} 
          />
        </ProfileImage>
        
        <ProfileDetails>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold font-heading">
                {user?.nama || 'Your Name'}
              </h2>
              <p className="text-lg text-gray-600">
                {user?.role === 'pencari kerja' ? 'Pencari Kerja' : 'Recruiter'}
              </p>
            </div>
            
            {onEdit && (
              <Button 
                variant="outline" 
                onClick={onEdit}
                className="ml-4"
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InfoItem>
              <Mail size={18} />
              <span>{user?.email || 'email@example.com'}</span>
            </InfoItem>
            
            {user?.alamat && (
              <InfoItem>
                <MapPin size={18} />
                <span>{user.alamat}</span>
              </InfoItem>
            )}
            
            {user?.jenis_kelamin && (
              <InfoItem>
                <User size={18} />
                <span>{user.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </InfoItem>
            )}
            
            {user?.tanggal_lahir && (
              <InfoItem>
                <Calendar size={18} />
                <span>{formatDate(user.tanggal_lahir)}</span>
              </InfoItem>
            )}
          </div>
        </ProfileDetails>
      </ProfileInfo>
    </Card>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    nama: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    alamat: PropTypes.string,
    tanggal_lahir: PropTypes.string,
    jenis_kelamin: PropTypes.string,
    foto: PropTypes.string,
    foto_url: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func,
  className: PropTypes.string,
};

export default ProfileCard;