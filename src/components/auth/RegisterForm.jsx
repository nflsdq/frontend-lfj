import React, { useState, useEffect } from "react";
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
    nama: yup
      .string()
      .required("Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter"),
    email: yup
      .string()
      .email("Masukkan email yang valid")
      .required("Email wajib diisi"),
    password: yup
      .string()
      .required("Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Konfirmasi password tidak sama")
      .required("Konfirmasi password wajib diisi"),
    role: yup
      .string()
      .required("Peran wajib dipilih")
      .oneOf(["pencari kerja", "recruiter"], "Pilihan peran tidak valid"),
    alamat: yup.string().nullable(),
    tanggal_lahir: yup.string().nullable(),
    jenis_kelamin: yup
      .string()
      .oneOf(["L", "P", ""], "Jenis kelamin tidak valid")
      .nullable(),
    foto: yup.mixed().nullable(),
  })
  .required();

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      role: "pencari kerja",
    },
  });

  const [fotoFile, setFotoFile] = useState(null);

  // Set role ke 'pencari kerja' setiap kali komponen di-mount
  useEffect(() => {
    setValue("role", "pencari kerja");
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let submitData = data;
      if (fotoFile) {
        // Kirim sebagai FormData jika ada foto
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        });
        formData.append("foto", fotoFile);
        submitData = formData;
      }
      await authService.register(submitData);
      toast.success("Registrasi berhasil! Mengarahkan...");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
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
          label='Nama Lengkap'
          type='text'
          name='nama'
          placeholder='John Doe'
          error={errors.nama?.message}
          required
          {...register("nama")}
        />

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

        <div>
          <label
            htmlFor='password_confirmation'
            className='font-medium block mb-1'
          >
            Konfirmasi Kata Sandi <span className='text-primary'>*</span>
          </label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id='password_confirmation'
              name='password_confirmation'
              placeholder='••••••••'
              className={`w-full px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] border-2 ${
                errors.password_confirmation ? "border-primary" : "border-black"
              } focus:ring-2 focus:ring-accent focus:shadow-none disabled:opacity-70 disabled:cursor-not-allowed`}
              required
              {...register("password_confirmation")}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <span className='text-primary text-sm mt-1 block'>
              {errors.password_confirmation.message}
            </span>
          )}
        </div>

        <Input
          label='Alamat'
          type='text'
          name='alamat'
          placeholder='Alamat (opsional)'
          error={errors.alamat?.message}
          {...register("alamat")}
        />

        <Input
          label='Tanggal Lahir'
          type='date'
          name='tanggal_lahir'
          error={errors.tanggal_lahir?.message}
          {...register("tanggal_lahir")}
        />

        <Input
          label='Jenis Kelamin'
          as='select'
          name='jenis_kelamin'
          error={errors.jenis_kelamin?.message}
          {...register("jenis_kelamin")}
        >
          <option value=''>Pilih</option>
          <option value='L'>Laki-laki</option>
          <option value='P'>Perempuan</option>
        </Input>

        <Input
          label='Upload Foto (opsional)'
          type='file'
          name='foto'
          accept='image/*'
          onChange={(e) => setFotoFile(e.target.files[0])}
          error={errors.foto?.message}
        />

        <Button type='submit' variant='primary' fullWidth disabled={isLoading}>
          {isLoading ? "Membuat Akun..." : "Buat Akun"}
        </Button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;
