import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import authService from "../../services/auth";
import { Eye, EyeOff } from "lucide-react";

// Form validation schema
const schema = yup
  .object({
    email: yup
      .string()
      .email("Masukkan email yang valid")
      .required("Email wajib diisi"),
    password: yup
      .string()
      .required("Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
  })
  .required();

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await authService.login(data);
      toast.success("Login berhasil! Mengarahkan...");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the API interceptor in api.js
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className='w-full max-w-md'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Input
          label='Email'
          type='email'
          name='email'
          placeholder='your@email.com'
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <div>
          <label htmlFor='password' className='font-medium block mb-1'>
            Kata Sandi <span className='text-primary'>*</span>
          </label>
          <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              id='password'
              name='password'
              placeholder='••••••••'
              className={`w-full px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] border-2 ${
                errors.password ? "border-primary" : "border-black"
              } focus:ring-2 focus:ring-accent focus:shadow-none disabled:opacity-70 disabled:cursor-not-allowed`}
              required
              {...register("password")}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className='text-primary text-sm mt-1 block'>
              {errors.password.message}
            </span>
          )}
        </div>

        <Button type='submit' variant='primary' fullWidth disabled={isLoading}>
          {isLoading ? "Sedang masuk..." : "Masuk"}
        </Button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
