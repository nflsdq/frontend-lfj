import React, { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Search, MapPin, Filter, X } from "lucide-react";
import Button from "../common/Button";
import { JOB_TYPES, COMMON_LOCATIONS } from "../../utils/constants";

const JobFilter = ({ onFilter, className = "" }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jobType, setJobType] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      keyword,
      location,
      job_type: jobType,
      company,
    });
  };

  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    onFilter({});
  };

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-black shadow-neo p-4 ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-lg'
      >
        {/* Keyword search */}
        <div className='relative flex-1 min-w-[200px]'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
          />
          <input
            type='text'
            placeholder='Cari posisi'
            className='w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-black bg-white shadow-md focus:ring-2 focus:ring-pink-400'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        {/* Company search */}
        <div className='relative flex-1 min-w-[180px]'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
          />
          <input
            type='text'
            placeholder='Cari perusahaan'
            className='w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-black bg-white shadow-md focus:ring-2 focus:ring-pink-400'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        {/* Location */}
        <div className='relative flex-1 min-w-[180px]'>
          <MapPin
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
          />
          <select
            className='w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-black bg-white shadow-md focus:ring-2 focus:ring-pink-400'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value=''>Pilih lokasi</option>
            {COMMON_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        {/* Search button */}
        <Button
          type='submit'
          variant='secondary'
          className='flex items-center justify-center'
        >
          <Search size={18} className='mr-2' /> Cari
        </Button>
      </form>
    </div>
  );
};

JobFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default JobFilter;
