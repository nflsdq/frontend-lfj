import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Sparkles, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import Loading from "../common/Loading";
import { cvAPI } from "../../services/api";
import { formatCurrency, truncateText } from "../../utils/helpers";

const JobMatcher = ({ className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [error, setError] = useState(null);

  const handleMatchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMatchedJobs([]);

      const response = await cvAPI.matchJobs();
      if (
        response.data &&
        (response.data.matched_job_ids || response.data.data)
      ) {
        const ids = response.data.matched_job_ids || response.data.data;
        if (Array.isArray(ids) && ids.length > 0) {
          const { jobsAPI } = require("../../services/api");
          const jobs = await Promise.all(
            ids.map(async (id) => {
              try {
                const res = await jobsAPI.getJob(id);
                return {
                  job: res.data.data,
                  job_id: id,
                  score: 1,
                  reasons: [],
                };
              } catch {
                return null;
              }
            })
          );
          setMatchedJobs(jobs.filter(Boolean));
        } else {
          setMatchedJobs([]);
        }
      } else {
        setMatchedJobs([]);
        setError("Format response dari server tidak sesuai.");
      }
    } catch (error) {
      console.error("Job matching error:", error);
      setError(
        "Gagal matching pekerjaan. Pastikan CV dan profil Anda sudah lengkap."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${className}`}>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-heading font-bold'>AI Job Matcher</h2>

        <Button variant='accent' onClick={handleMatchJobs} disabled={isLoading}>
          <Sparkles size={18} className='mr-2' />
          Find Matching Jobs
        </Button>
      </div>

      <p className='text-gray-600 mb-6'>
        Our AI analyzes your CV and profile to find jobs that match your skills
        and experience. Click the button above to find jobs tailored to your
        profile.
      </p>

      {isLoading ? (
        <div className='py-12'>
          <Loading text='Finding matching jobs...' />
        </div>
      ) : error ? (
        <div className='bg-red-50 text-red-700 p-4 rounded-xl border border-red-200'>
          <p className='font-medium'>{error}</p>
          <p className='text-sm mt-2'>
            Ensure your profile is complete with education, experience, and
            skills information. Also, make sure you have a CV created or
            uploaded.
          </p>
        </div>
      ) : matchedJobs.length > 0 ? (
        <div className='space-y-4'>
          {matchedJobs.map((item) => (
            <motion.div
              key={item.job_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='bg-white border-gray-200 hover:border-accent'>
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='flex items-center mb-1'>
                      <h3 className='font-bold'>{item.job.title}</h3>
                      <span className='ml-2 bg-accent text-white text-xs px-2 py-1 rounded-full'>
                        {Math.round(item.score * 100)}% Match
                      </span>
                    </div>

                    <p className='text-gray-600 text-sm mb-2'>
                      {item.job.company_name}
                    </p>

                    <div className='flex flex-wrap gap-2 text-xs text-gray-500 mb-3'>
                      {item.job.location && <span>{item.job.location}</span>}
                      {item.job.job_type && <span>• {item.job.job_type}</span>}
                      {item.job.salary && (
                        <span>• {formatCurrency(item.job.salary)}</span>
                      )}
                    </div>

                    {item.job.description && (
                      <p className='text-sm text-gray-600'>
                        {truncateText(item.job.description, 150)}
                      </p>
                    )}
                  </div>

                  <Link
                    to={item.job.jobUrl ? undefined : `/jobs/${item.job_id}`}
                    href={item.job.jobUrl || undefined}
                    target={item.job.jobUrl ? "_blank" : undefined}
                    rel={item.job.jobUrl ? "noopener noreferrer" : undefined}
                  >
                    <Button variant='outline' className='px-3 py-2'>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>

                {item.reasons && (
                  <div className='mt-4 pt-4 border-t border-gray-100'>
                    <p className='text-xs font-medium text-gray-700 mb-1'>
                      Why this matches your profile:
                    </p>
                    <ul className='text-xs text-gray-600 list-disc list-inside'>
                      {item.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className='border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center'>
          <Briefcase size={48} className='text-gray-300 mb-4' />
          <h3 className='font-bold text-gray-700 mb-1'>No matched jobs yet</h3>
          <p className='text-gray-500 mb-4'>
            Click the "Find Matching Jobs" button to let our AI match your
            profile with available job positions.
          </p>
        </div>
      )}
    </Card>
  );
};

JobMatcher.propTypes = {
  className: PropTypes.string,
};

export default JobMatcher;
