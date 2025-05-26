import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MapPin, Building, Clock, CreditCard } from "lucide-react";
import Card from "../common/Card";
import { formatDate, timeAgo, formatCurrency } from "../../utils/helpers";

const JobCard = ({ job }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <a
        href={job.jobUrl}
        target='_blank'
        rel='noopener noreferrer'
        style={{ textDecoration: "none" }}
      >
        <Card className='h-full cursor-pointer'>
          <div className='flex flex-col h-full'>
            {/* Company logo or placeholder */}
            <div className='mb-4 flex items-center'>
              <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-black overflow-hidden mr-3'>
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.company || ""} logo`}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <Building size={24} className='text-gray-400' />
                )}
              </div>
              <div>
                <h3 className='font-heading font-bold text-lg leading-tight'>
                  {job.position}
                </h3>
                <p className='text-sm'>{job.company}</p>
              </div>
            </div>

            {/* Job details */}
            <div className='space-y-2 flex-grow'>
              {job.location && (
                <div className='flex items-center text-sm'>
                  <MapPin
                    size={16}
                    className='mr-2 flex-shrink-0 text-gray-500'
                  />
                  <span>{job.location}</span>
                </div>
              )}

              {/* {job.salary && (
                <div className='flex items-center text-sm'>
                  <CreditCard
                    size={16}
                    className='mr-2 flex-shrink-0 text-gray-500'
                  />
                  <span>{formatCurrency(job.salary)}</span>
                </div>
              )} */}
            </div>

            {/* Footer with date */}
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='text-xs text-gray-500 mt-3'>
                {job.date && <span>Posted {timeAgo(job.date)}</span>}
              </div>
            </div>
          </div>
        </Card>
      </a>
    </motion.div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    companyLogo: PropTypes.string,
    location: PropTypes.string,
    salary: PropTypes.number,
    date: PropTypes.string,
  }).isRequired,
};

export default JobCard;
