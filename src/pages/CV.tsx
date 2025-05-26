import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { cvAPI } from '../services/api';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

interface CVType {
  isi_cv?: string;
  [key: string]: any;
}

const CV = () => {
  const [cv, setCV] = useState<CVType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const pdfUrlRef = useRef<string | null>(null);

  // Fetch CV data from backend
  const fetchCV = async () => {
    setLoading(true);
    try {
      const res = await cvAPI.getCV();
      setCV(res.data.data);
      // Fetch PDF preview jika CV tersedia
      if (res.data.data) {
        fetchPdfPreview();
      } else {
        setPdfUrl(null);
      }
    } catch (err) {
      setCV(null);
      setPdfUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch PDF preview dari backend
  const fetchPdfPreview = async () => {
    setIsLoadingPreview(true);
    try {
      const response = await cvAPI.exportCV();
      // Jika response berupa file blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
      // Cleanup url lama
      if (pdfUrlRef.current) {
        window.URL.revokeObjectURL(pdfUrlRef.current);
      }
      pdfUrlRef.current = url;
    } catch (err) {
      setPdfUrl(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Cleanup url blob saat unmount
  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) {
        window.URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchCV();
  }, []);

  // Save CV (update)
  const handleSave = async () => {
    setSaving(true);
    try {
      await cvAPI.createUpdateCV({ isi_cv: cv?.isi_cv || '' });
      toast.success('CV saved!');
      fetchCV();
    } catch (err) {
      toast.error('Failed to save CV');
    } finally {
      setSaving(false);
    }
  };

  // Generate CV with AI
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await cvAPI.generateCV();
      toast.success('CV generated with AI!');
      fetchCV();
    } catch (err) {
      toast.error('Failed to generate CV');
    } finally {
      setGenerating(false);
    }
  };

  // Export PDF
  const handleExport = async () => {
    try {
      const response = await cvAPI.exportCV();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto md:px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Penyusun CV</h1>
        <div className="flex flex-wrap gap-2 w-full max-w-xs md:w-auto md:max-w-none md:gap-4 justify-end">
          <Button variant="outline" onClick={handleGenerate} disabled={generating} className="flex items-center">
            {generating ? <RefreshCw size={20} className="animate-spin" /> : null}
            <span className="ml-2">Buat Isi CV (AI)</span>
          </Button>
          <Button variant="primary" onClick={handleExport} className="flex items-center">
            <span className="ml-2">Ekspor PDF</span>
          </Button>
        </div>
      </div>
      <Card>
        {loading ? (
          <div className="py-16 flex justify-center"><Loading text="Memuat CV..." /></div>
        ) : !cv ? (
          <div className="py-16 text-center text-gray-500">CV belum tersedia. Silakan generate dengan AI atau isi data profil Anda.</div>
        ) : (
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom kiri: Isi CV */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Isi CV</h2>
                <textarea
                  className="w-full min-h-[300px] rounded-xl border-2 border-gray-200 p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  value={cv?.isi_cv || ''}
                  onChange={e => setCV(cv ? { ...cv, isi_cv: e.target.value } : { isi_cv: e.target.value })}
                  placeholder="Tulis isi CV Anda di sini..."
                />
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan CV'}
                  </Button>
                </div>
              </div>
              {/* Kolom kanan: Preview PDF */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Pratinjau CV (PDF)</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-2 h-[350px] flex items-center justify-center">
                  {isLoadingPreview ? (
                    <div>Memuat pratinjau...</div>
                  ) : pdfUrl ? (
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full min-h-[320px]"
                      title="Pratinjau CV PDF"
                    />
                  ) : (
                    <div className="text-gray-500">Pratinjau belum tersedia.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CV;