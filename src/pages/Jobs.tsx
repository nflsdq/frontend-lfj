import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JobFilter from '../components/jobs/JobFilter';
import JobCard from '../components/jobs/JobCard';
import { jobsAPI } from '../services/api';
import Loading from '../components/common/Loading';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchJobs = async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsAPI.getJobs({ ...params, page });
      const data = res.data.data ? res.data.data : res.data;
      setJobs(data);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      setError('Gagal memuat data lowongan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, page]);

  const handleFilter = (params: any) => {
    setPage(1);
    setFilters(params);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Daftar Lowongan</h1>
      <div className="mb-8">
        <JobFilter onFilter={handleFilter} />
      </div>
      <div>
        {loading ? (
          <div className="py-16 flex justify-center"><Loading text="Memuat Lowongan..." /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-red-500">
            <span className="text-4xl mb-2">⚠️</span>
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-4xl mb-2">🔍</span>
            Tidak ada lowongan ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 rounded-lg border bg-white font-bold shadow-md disabled:opacity-50"><ChevronLeft size={20} /></button>
            <span className="px-4 py-2 font-bold">{page} / {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-lg border bg-white font-bold shadow-md disabled:opacity-50"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Jobs;