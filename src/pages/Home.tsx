import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Sparkles, Building } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Hero Section */}
      <section className='py-12 md:py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6'>
              Temukan <span className='text-primary'>Pekerjaan</span> Impianmu
              <br />
              Bangun <span className='text-accent'>Karier</span> Terbaikmu
            </h1>

            <p className='text-gray-600 text-lg mb-8'>
              LookForJob menghubungkan kamu dengan peluang kerja yang sesuai dengan keahlian dan aspirasi, didukung AI untuk memberikan rekomendasi pekerjaan yang dipersonalisasi.
            </p>

            <div className='flex flex-wrap gap-4'>
              <Button
                variant='primary'
                onClick={() => navigate("/jobs")}
                className='text-lg py-4 px-8 flex items-center'
              >
                <Search size={20} className='mr-2' />
                Cari Pekerjaan
              </Button>

              <Button
                variant='outline'
                onClick={() => navigate("/cv")}
                className='text-lg py-4 px-8 flex items-center'
              >
                <FileText size={20} className='mr-2' />
                Buat CV
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='relative'
          >
            <motion.div animate={floatingAnimation}>
              <img
                src='/ilustrasi.png'
                alt='Team working together'
                className='rounded-3xl border-4 border-black shadow-neo-xl'
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className='absolute -bottom-6 -left-6 w-16 h-16 md:w-32 md:h-32 bg-secondary rounded-2xl border-4 border-black z-10'
              animate={{
                rotate: [0, 10, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            ></motion.div>

            <motion.div
              className='absolute -top-6 -right-6 w-16 h-16 md:w-24 md:h-24 bg-primary rounded-full border-4 border-black z-10'
              animate={{
                scale: [1, 1.1, 1],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className='py-16'
        variants={containerVariants}
        initial='initial'
        whileInView='animate'
        viewport={{ once: true }}
      >
        <h2 className='text-3xl md:text-4xl font-heading font-bold text-center mb-12'>
          Kenapa Memilih <span className='text-primary'>Look</span>
          <span className='text-accent'>For</span>Job?
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <motion.div variants={itemVariants}>
            <Card className='h-full'>
              <div className='w-16 h-16 bg-primary/10 rounded-2xl border-2 border-black flex items-center justify-center mb-6'>
                <Search size={32} className='text-primary' />
              </div>

              <h3 className='text-xl font-heading font-bold mb-3'>
                Pencocokan Pekerjaan Cerdas
              </h3>

              <p className='text-gray-600'>
                Sistem pencocokan berbasis AI kami menghubungkan kamu dengan pekerjaan yang sesuai dengan keahlian, pengalaman, dan tujuan kariermu.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className='h-full'>
              <div className='w-16 h-16 bg-secondary/10 rounded-2xl border-2 border-black flex items-center justify-center mb-6'>
                <FileText size={32} className='text-secondary' />
              </div>

              <h3 className='text-xl font-heading font-bold mb-3'>
                Pembuat & Analisa CV
              </h3>

              <p className='text-gray-600'>
                Buat CV profesional dengan pembuat CV kami yang mudah digunakan, dan dapatkan masukan personal untuk meningkatkan lamaranmu.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className='h-full'>
              <div className='w-16 h-16 bg-accent/10 rounded-2xl border-2 border-black flex items-center justify-center mb-6'>
                <Sparkles size={32} className='text-accent' />
              </div>

              <h3 className='text-xl font-heading font-bold mb-3'>
                Asisten Karier AI
              </h3>

              <p className='text-gray-600'>
                Dapatkan saran karier, tips wawancara, dan strategi pencarian kerja yang dipersonalisasi dari asisten AI kami.
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className='py-16'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className='bg-black text-white rounded-3xl border-4 border-black p-8 md:p-12 relative overflow-hidden'>
          {/* Background elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary rounded-full opacity-20 -mr-32 -mt-32'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full opacity-20 -ml-48 -mb-48'></div>

          <div className='relative z-10 text-center max-w-3xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-heading font-bold mb-6'>
              Siap Menemukan Peluang Berikutnya?
            </h2>

            <p className='text-gray-300 text-lg mb-8'>
              Bergabunglah dengan ribuan pencari kerja yang telah menemukan karier impian mereka melalui LookForJob. Buat profilmu, unggah CV, dan mulai perjalananmu hari ini.
            </p>

            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                variant='primary'
                onClick={() => navigate("/register")}
                className='text-lg py-4 px-8'
              >
                Mulai Sekarang
              </Button>

              <Button
                variant='outline'
                className='text-lg py-4 px-8 hover:bg-white hover:text-black flex items-center'
                onClick={() => navigate("/jobs")}
              >
                <Building size={20} className='mr-2' />
                Lihat Lowongan
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
