import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cvAPI, jobsAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Sparkles, ArrowRight, Briefcase, Bot, User } from 'lucide-react';
import { formatCurrency, truncateText } from '../utils/helpers';
import JobCard from '../components/jobs/JobCard';
import { Link } from 'react-router-dom';

const AI: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [cv, setCV] = useState<any>(null);

  // State untuk matching job
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchedJobIds, setMatchedJobIds] = useState<number[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);

  // State untuk analisis CV
  const [file, setFile] = useState<File | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [analyzeText, setAnalyzeText] = useState<string>('');

  // State untuk notifikasi
  const [notif, setNotif] = useState<string | null>(null);

  // State untuk chat AI
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', message: string}[]>([]);

  useEffect(() => {
    const fetchCV = async () => {
      setLoading(true);
      try {
        const res = await cvAPI.getCV();
        setCV(res.data.data);
      } catch (err) {
        setCV(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  // Handle matching job
  const handleMatchJobs = async () => {
    setMatchingLoading(true);
    setMatchError(null);
    setMatchedJobIds([]);
    setMatchedJobs([]);
    setNotif(null);
    try {
      const res = await cvAPI.matchJobs();
      if (res.data && res.data.matched_job_ids && Array.isArray(res.data.matched_job_ids)) {
        setMatchedJobIds(res.data.matched_job_ids);
        if (res.data.matched_job_ids.length === 0) {
          setNotif('Tidak ada pekerjaan yang cocok ditemukan.');
        } else {
          setJobsLoading(true);
          const jobPromises = res.data.matched_job_ids.map((id: number) => jobsAPI.getJob(id).then((r: any) => r.data.data ? r.data.data : r.data));
          const jobs = await Promise.all(jobPromises);
          setMatchedJobs(jobs);
        }
      } else {
        setNotif('Tidak ada data hasil pencocokan.');
      }
    } catch (err: any) {
      setMatchError('Gagal melakukan pencocokan pekerjaan.');
    } finally {
      setMatchingLoading(false);
      setJobsLoading(false);
    }
  };

  // Handle upload file untuk analisis CV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalyzeResult(null);
      setAnalyzeError(null);
      setAnalyzeText('');
      setChatHistory([]);
    }
  };

  const handleAnalyzeCV = async () => {
    if (!file) {
      setAnalyzeError('Silakan pilih file CV (PDF/DOCX) terlebih dahulu.');
      return;
    }
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    setAnalyzeResult(null);
    setNotif(null);
    setChatHistory([]);
    try {
      const res = await cvAPI.analyzeUploadedCV(file);
      if (res.data && res.data.analysis) {
        setAnalyzeResult(res.data.analysis);
        if (res.data.cv_text) {
          setAnalyzeText(res.data.cv_text);
        } else if (file) {
          setAnalyzeText('');
        }
        // Masukkan hasil analisis ke chat awal
        setChatHistory([{ role: 'ai', message: typeof res.data.analysis === 'string' ? res.data.analysis : JSON.stringify(res.data.analysis, null, 2) }]);
      } else {
        setAnalyzeError('Tidak ada hasil analisis yang diterima.');
      }
    } catch (err: any) {
      setAnalyzeError('Gagal menganalisis CV. Pastikan file valid dan coba lagi.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  // Handle chat dengan AI
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !analyzeResult) return;
    setChatLoading(true);
    setChatHistory((prev) => [...prev, { role: 'user', message: chatInput }]);
    try {
      const analysisString = typeof analyzeResult === 'string' ? analyzeResult : JSON.stringify(analyzeResult);
      const cvTextString = typeof analyzeText === 'string' && analyzeText.trim() ? analyzeText : 'CV tidak tersedia';
      const res = await cvAPI.aiChat({
        message: chatInput,
        analysis: analysisString,
        cvText: cvTextString,
        language: 'id',
      });
      if (res.data && res.data.reply) {
        setChatHistory((prev) => [...prev, { role: 'ai', message: res.data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: 'ai', message: 'AI tidak memberikan balasan.' }]);
      }
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: 'ai', message: 'Gagal mendapatkan balasan dari AI.' }]);
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">AI Tools: Pencocokan Pekerjaan & Analisis CV</h1>
      <div className="mb-8">
        <Card className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gray-50">
          <div>
            <h3 className="text-lg font-bold mb-1">Status CV Anda</h3>
            {loading ? (
              <span className="text-gray-500">Memuat status CV...</span>
            ) : cv ? (
              <span className="text-green-600 font-medium">CV tersedia</span>
            ) : (
              <span className="text-red-500 font-medium">CV belum tersedia</span>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/cv">
              <Button variant="primary">Lihat / Edit CV</Button>
            </Link>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
        {/* Bagian Matching Job */}
        <Card className="p-0">
          <div className="flex items-center justify-between mb-6 md:px-6 md:pt-6">
            <h2 className="text-2xl font-heading font-bold">AI Job Matcher</h2>
            <Button variant="accent" onClick={handleMatchJobs} disabled={matchingLoading} className='flex items-center'>
              <Sparkles size={18} className="mr-2" />
              {matchingLoading ? 'Mencari...' : 'Cocokkan Pekerjaan'}
            </Button>
          </div>
          <p className="text-gray-600 md:mb-6 md:px-6">
            AI kami akan menganalisis CV dan profil Anda untuk menemukan pekerjaan yang paling cocok.
            Klik tombol di atas untuk mulai pencocokan.
          </p>
          {jobsLoading ? (
            <div className="py-12">
              <Loading text="Mencari pekerjaan yang cocok..." />
            </div>
          ) : matchError ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mx-6 mb-6">
              <p className="font-medium">{matchError}</p>
              <p className="text-sm mt-2">
                Pastikan profil dan CV Anda sudah lengkap.
              </p>
            </div>
          ) : notif ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center mx-6 mb-6">
              <Briefcase size={48} className="text-gray-300 mb-4" />
              <h3 className="font-bold text-gray-700 mb-1">{notif}</h3>
              <p className="text-gray-500 mb-4">
                Klik "Cocokkan Pekerjaan" untuk mulai pencarian.
              </p>
            </div>
          ) : matchedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:px-6 md:pb-6">
              {matchedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : null}
        </Card>

        {/* Bagian Analisis CV & Chat AI */}
        <Card className="p-0">
          <div className="md:px-6 md:pt-6">
            <h2 className="text-2xl font-heading font-bold mb-4">Analisis CV Otomatis & Chat AI</h2>
            <p className="text-gray-600 mb-4">
              Upload file CV Anda (PDF/DOCX) untuk mendapatkan analisis otomatis dan konsultasi dengan AI.
            </p>
            <div className="flex items-center gap-2 md:mb-4">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="flex-1 min-w-0 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <Button
                variant="secondary"
                onClick={handleAnalyzeCV}
                disabled={analyzeLoading || !file}
                className="whitespace-nowrap]"
              >
                {analyzeLoading ? 'Menganalisis...' : 'Analisis CV'}
              </Button>
            </div>
            {analyzeError && <div className="text-red-600 mb-2">{analyzeError}</div>}
          </div>
          {analyzeResult && (
            <div className="md:px-6 md:pb-6">
              {/* Chat dengan AI */}
              <div className="mt-8">
                <h4 className="font-bold mb-2">Tanya AI seputar hasil analisis CV Anda</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 rounded p-3 border border-gray-200">
                  <AnimatePresence>
                    {chatHistory.map((chat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                          <div className={`flex max-w-[80%] ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${chat.role === 'user' ? 'ml-2 bg-primary' : 'mr-2 bg-accent'}`}>
                              {chat.role === 'user' ? (
                                <User size={16} className='text-white' />
                              ) : (
                                <Bot size={16} className='text-white' />
                              )}
                            </div>
                            <div className={`p-3 rounded-2xl border-2 border-black ${chat.role === 'user' ? 'bg-primary/10' : 'bg-accent/10'} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}>
                              <p className='text-sm whitespace-pre-wrap'>{chat.message}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {chatLoading && (
                    <div className='flex justify-start mb-2'>
                      <div className='flex'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center bg-accent mr-2'>
                          <Bot size={16} className='text-white' />
                        </div>
                        <div className='p-3 rounded-2xl border-2 border-black bg-accent/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]'>
                          <div className='flex space-x-2'>
                            <div className='w-2 h-2 bg-accent rounded-full animate-bounce' style={{ animationDelay: "0ms" }}></div>
                            <div className='w-2 h-2 bg-accent rounded-full animate-bounce' style={{ animationDelay: "300ms" }}></div>
                            <div className='w-2 h-2 bg-accent rounded-full animate-bounce' style={{ animationDelay: "600ms" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="flex-1 min-w-0 border rounded px-3 py-2"
                    placeholder="Tulis pertanyaan..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={chatLoading}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat(e);
                      }
                    }}
                  />
                  <Button type="submit" variant="primary" disabled={chatLoading || !chatInput.trim()} onClick={handleSendChat} className="whitespace-nowrap">
                    {chatLoading ? 'Mengirim...' : 'Kirim'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

export default AI; 