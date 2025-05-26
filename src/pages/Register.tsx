import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex items-center justify-center p-6'>
        <div className='w-full max-w-md'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center mb-8'
          >
            <Link to='/' className='inline-block'>
              <h1 className='font-heading text-3xl font-bold'>
                <span className='text-primary'>Look</span>
                <span>For</span>
                <span className='text-accent'>Job</span>
              </h1>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='bg-white rounded-3xl border-2 border-black shadow-neo-lg p-8'
          >
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 bg-secondary/10 rounded-full border-2 border-black flex items-center justify-center'>
                <UserPlus size={32} className='text-secondary' />
              </div>
            </div>

            <h2 className='text-2xl font-heading font-bold text-center mb-6'>
              Buat Akun
            </h2>

            <RegisterForm />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='text-center mt-6 text-gray-600'
          >
            Sudah punya akun?{" "}
            <Link to='/login' className='text-accent font-medium'>
              Masuk
            </Link>
          </motion.p>
        </div>
      </div>

      <div className='py-4 text-center text-gray-500 text-sm'>
        &copy; {new Date().getFullYear()} LookForJob. All rights reserved.
      </div>
    </div>
  );
};

export default Register;
