import React from "react";

const Footer = () => {
  return (
    <footer className='bg-black text-white border-t-4 border-primary'>
      <div className='container mx-auto px-8 md:px-16 py-4 md:py-12'>
        {/* Footer bottom section */}
        <div className='flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0'>
          {/* Logo */}
          <div className='font-heading text-xl font-bold'>
            <span className='text-primary'>Look</span>
            <span className='text-white'>For</span>
            <span className='text-secondary'>Job</span>
          </div>
        </div>

        {/* Copyright */}
        <div className='text-center mt-4 md:mt-8 text-sm text-gray-400'>
          &copy; {new Date().getFullYear()} LookForJob. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
