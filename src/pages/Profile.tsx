import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { QueryClient, useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Plus, Briefcase, GraduationCap, LucideCode } from "lucide-react";
import {
  authAPI,
  experienceAPI,
  educationAPI,
  skillsAPI,
} from "../services/api";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import ProfileCard from "../components/profile/ProfileCard";
import PhotoUpload from "../components/profile/PhotoUpload";
import ExperienceForm from "../components/profile/ExperienceForm";
import EducationForm from "../components/profile/EducationForm";
import SkillForm from "../components/profile/SkillForm";
import { formatDate, timeAgo } from "../utils/helpers";
import Input from "../components/common/Input";

interface UserType {
  nama: string;
  alamat: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  [key: string]: any;
}

interface ExperienceType {
  id: number;
  posisi: string;
  institusi: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir?: string;
  deskripsi?: string;
}

interface EducationType {
  id: number;
  institusi: string;
  jenjang: string;
  jurusan: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir?: string;
  ipk?: string;
  deskripsi?: string;
}

interface SkillType {
  id: number;
  nama_skill: string;
  level: string;
  sertifikasi?: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
  const [educationModalOpen, setEducationModalOpen] = useState<boolean>(false);
  const [selectedEducation, setSelectedEducation] = useState<EducationType | null>(null);
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserType>({
    nama: "",
    alamat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // const storageBaseUrl = "http://localhost:8000/storage/";
  const storageBaseUrl = "https://api-lfj.naufalsidiq.xyz/storage/";

  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery<any>(
    "profile",
    () => authAPI.getProfile(),
    {
      onSuccess: (response: any) => {
        const user = response.data?.data;
        if (user) {
          setUserData({
            nama: user.nama || "",
            alamat: user.alamat || "",
            tanggal_lahir: user.tanggal_lahir
              ? user.tanggal_lahir.substring(0, 10)
              : "",
            jenis_kelamin: user.jenis_kelamin || "",
          });
        }
      },
    }
  );

  // Fetch experience data
  const { data: experienceData, isLoading: experienceLoading } = useQuery<any>(
    "experiences",
    () => experienceAPI.getExperiences()
  );

  // Fetch education data
  const { data: educationData, isLoading: educationLoading } = useQuery<any>(
    "educations",
    () => educationAPI.getEducations()
  );

  // Fetch skills data
  const { data: skillsData, isLoading: skillsLoading } = useQuery<any>(
    "skills",
    () => skillsAPI.getSkills()
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data: FormData) => authAPI.updateProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profile");
        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
      },
    }
  );

  // Delete experience mutation
  const deleteExperienceMutation = useMutation(
    (id: number) => experienceAPI.deleteExperience(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("experiences");
        toast.success("Experience deleted successfully");
      },
    }
  );

  // Delete education mutation
  const deleteEducationMutation = useMutation(
    (id: number) => educationAPI.deleteEducation(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("educations");
        toast.success("Education deleted successfully");
      },
    }
  );

  // Delete skill mutation
  const deleteSkillMutation = useMutation(
    (id: number) => skillsAPI.deleteSkill(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("skills");
        toast.success("Skill deleted successfully");
      },
    }
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
  };

  const handleEditModalSuccess = () => {
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    if (
      passwordData.current_password &&
      passwordData.new_password &&
      passwordData.new_password_confirmation
    ) {
      formData.append("current_password", passwordData.current_password);
      formData.append("new_password", passwordData.new_password);
      formData.append(
        "new_password_confirmation",
        passwordData.new_password_confirmation
      );
    }
    if (photoFile) {
      formData.append("foto", photoFile);
    }
    updateProfileMutation.mutate(formData);
  };

  const openExperienceModal = (experience: ExperienceType | null = null) => {
    setSelectedExperience(experience);
    setExperienceModalOpen(true);
  };

  const openEducationModal = (education: EducationType | null = null) => {
    setSelectedEducation(education);
    setEducationModalOpen(true);
  };

  const openSkillModal = (skill: SkillType | null = null) => {
    setSelectedSkill(skill);
    setSkillModalOpen(true);
  };

  const handleDeleteExperience = (id: number) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      deleteExperienceMutation.mutate(id);
    }
  };

  const handleDeleteEducation = (id: number) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      deleteEducationMutation.mutate(id);
    }
  };

  const handleDeleteSkill = (id: number) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      deleteSkillMutation.mutate(id);
    }
  };

  const user = profileData?.data?.data as UserType;
  const experiences = (experienceData?.data?.data as ExperienceType[]) || [];
  const educations = (educationData?.data?.data as EducationType[]) || [];
  const skills = (skillsData?.data?.data as SkillType[]) || [];

  // Tambahkan foto_url jika belum ada
  let userWithFotoUrl = user;
  if (user) {
    userWithFotoUrl = {
      ...user,
      foto_url: user.foto
        ? (user.foto.startsWith('http') ? user.foto : storageBaseUrl + user.foto.replace(/^foto\//, 'foto/'))
        : undefined,
    };
  }

  if (profileLoading && !user) {
    return <Loading text='Loading profile...' fullScreen />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-heading font-bold mb-2'>
          Profil Saya
        </h1>
      </div>

      {/* Profile Card */}
      <section className='mb-10'>
        <ProfileCard
          user={userWithFotoUrl}
          isLoading={profileLoading}
          onEdit={() => setIsEditModalOpen(true)}
        />
      </section>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Work Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='md:col-span-3 lg:col-span-1'
        >
          <Card>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-heading font-bold flex items-center'>
                <Briefcase size={20} className='mr-2' />
                Pengalaman Kerja
              </h2>

              <Button
                variant='outline'
                className='px-3 py-2 flex items-center'
                onClick={() => openExperienceModal()}
              >
                <Plus size={18} className='mr-1' />
                Tambah
              </Button>
            </div>

            {experienceLoading ? (
              <Loading size='16px' />
            ) : experiences.length === 0 ? (
              <div className='text-center py-8 border-2 border-dashed border-gray-200 rounded-xl'>
                <p className='text-gray-500'>Belum ada pengalaman kerja</p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => openExperienceModal()}
                >
                  Tambah Pengalaman
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {experiences.map((experience) => (
                  <motion.div
                    key={experience.id}
                    className='bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-primary'
                    whileHover={{ y: -2 }}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold'>{experience.posisi}</h3>
                        <p className='text-gray-700'>{experience.institusi}</p>
                        <p className='text-sm text-gray-500'>
                          {experience.lokasi}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDate(experience.tanggal_mulai, "monthYear")} -
                          {experience.tanggal_akhir
                            ? formatDate(experience.tanggal_akhir, "monthYear")
                            : "Present"}
                        </p>

                        {experience.deskripsi && (
                          <p className='text-sm text-gray-600 mt-2'>
                            {experience.deskripsi}
                          </p>
                        )}
                      </div>

                      <div className='flex space-x-2'>
                        <button
                          className='text-gray-500 hover:text-accent'
                          onClick={() => openExperienceModal(experience)}
                        >
                          Edit
                        </button>
                        <button
                          className='text-gray-500 hover:text-primary'
                          onClick={() => handleDeleteExperience(experience.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className='md:col-span-3 lg:col-span-1'
        >
          <Card>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-heading font-bold flex items-center'>
                <GraduationCap size={20} className='mr-2' />
                Pendidikan
              </h2>

              <Button
                variant='outline'
                className='px-3 py-2 flex items-center'
                onClick={() => openEducationModal()}
              >
                <Plus size={18} className='mr-1' />
                Tambah
              </Button>
            </div>

            {educationLoading ? (
              <Loading size='16px' />
            ) : educations.length === 0 ? (
              <div className='text-center py-8 border-2 border-dashed border-gray-200 rounded-xl'>
                <p className='text-gray-500'>Belum ada data pendidikan</p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => openEducationModal()}
                >
                  Tambah Pendidikan
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {educations.map((education) => (
                  <motion.div
                    key={education.id}
                    className='bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-secondary'
                    whileHover={{ y: -2 }}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold'>{education.institusi}</h3>
                        <p className='text-gray-700'>
                          {education.jenjang}, {education.jurusan}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {education.lokasi}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDate(education.tanggal_mulai, "monthYear")} -
                          {education.tanggal_akhir
                            ? formatDate(education.tanggal_akhir, "monthYear")
                            : "Present"}
                        </p>

                        {education.ipk && (
                          <p className='text-sm text-gray-600 mt-1'>
                            GPA: {education.ipk}
                          </p>
                        )}

                        {education.deskripsi && (
                          <p className='text-sm text-gray-600 mt-2'>
                            {education.deskripsi}
                          </p>
                        )}
                      </div>

                      <div className='flex space-x-2'>
                        <button
                          className='text-gray-500 hover:text-accent'
                          onClick={() => openEducationModal(education)}
                        >
                          Edit
                        </button>
                        <button
                          className='text-gray-500 hover:text-primary'
                          onClick={() => handleDeleteEducation(education.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='md:col-span-3 lg:col-span-1'
        >
          <Card>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-heading font-bold flex items-center'>
                <LucideCode size={20} className='mr-2' />
                Keahlian
              </h2>

              <Button
                variant='outline'
                className='px-3 py-2 flex items-center'
                onClick={() => openSkillModal()}
              >
                <Plus size={18} className='mr-1' />
                Tambah
              </Button>
            </div>

            {skillsLoading ? (
              <Loading size='16px' />
            ) : skills.length === 0 ? (
              <div className='text-center py-8 border-2 border-dashed border-gray-200 rounded-xl'>
                <p className='text-gray-500'>Belum ada keahlian</p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => openSkillModal()}
                >
                  Tambah Keahlian
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    className='bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-accent'
                    whileHover={{ y: -2 }}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold'>{skill.nama_skill}</h3>
                        <p className='text-sm text-gray-500'>
                          Level: {skill.level}
                        </p>

                        {skill.sertifikasi && (
                          <p className='text-sm text-accent mt-1'>
                            Certification Available
                          </p>
                        )}
                      </div>

                      <div className='flex space-x-2'>
                        <button
                          className='text-gray-500 hover:text-accent'
                          onClick={() => openSkillModal(skill)}
                        >
                          Edit
                        </button>
                        <button
                          className='text-gray-500 hover:text-primary'
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.section>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setShowPasswordFields(false);
          setPasswordData({
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
          });
        }}
        title='Edit Profil'
        footer={
          <>
            <Button variant='outline' onClick={() => {
              setIsEditModalOpen(false);
              setShowPasswordFields(false);
              setPasswordData({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
              });
            }}>
              Batal
            </Button>
            <Button
              variant='primary'
              onClick={handleEditModalSuccess}
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <Input
            label='Nama Lengkap'
            type='text'
            name='nama'
            value={userData.nama}
            onChange={handleInputChange}
            required
          />
          <Input
            label='Alamat'
            type='text'
            name='alamat'
            value={userData.alamat}
            onChange={handleInputChange}
          />
          <Input
            label='Tanggal Lahir'
            type='date'
            name='tanggal_lahir'
            value={userData.tanggal_lahir}
            onChange={handleInputChange}
          />
          <div>
            <label className='font-medium'>Jenis Kelamin</label>
            <select
              name='jenis_kelamin'
              value={userData.jenis_kelamin}
              onChange={handleInputChange}
              className='form-select mt-1 block w-full'
            >
              <option value=''>Pilih</option>
              <option value='L'>Laki-laki</option>
              <option value='P'>Perempuan</option>
            </select>
          </div>
          <PhotoUpload onPhotoChange={handlePhotoChange} />
          {/* Trigger Ganti Password */}
          {!showPasswordFields && (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setShowPasswordFields(true)}
            >
              Ganti Password
            </Button>
          )}
          {/* Field Ganti Password */}
          {showPasswordFields && (
            <div className='border-t pt-4 mt-4'>
              <h3 className='font-bold mb-2'>Ganti Password</h3>
              <Input
                label='Password Lama'
                type='password'
                name='current_password'
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                autoComplete='current-password'
              />
              <Input
                label='Password Baru'
                type='password'
                name='new_password'
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                autoComplete='new-password'
              />
              <Input
                label='Konfirmasi Password Baru'
                type='password'
                name='new_password_confirmation'
                value={passwordData.new_password_confirmation}
                onChange={handlePasswordChange}
                autoComplete='new-password'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Isi semua kolom di atas jika ingin mengganti password.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setShowPasswordFields(false);
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                  });
                }}
              >
                Batal Ganti Password
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Experience Modal */}
      <Modal
        isOpen={experienceModalOpen}
        onClose={() => {
          setExperienceModalOpen(false);
          setSelectedExperience(null);
        }}
        title={selectedExperience ? "Edit Pengalaman" : "Tambah Pengalaman"}
      >
        <ExperienceForm
          experience={selectedExperience}
          onSuccess={() => {
            setExperienceModalOpen(false);
            setSelectedExperience(null);
            queryClient.invalidateQueries("experiences");
          }}
          onCancel={() => {
            setExperienceModalOpen(false);
            setSelectedExperience(null);
          }}
        />
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={educationModalOpen}
        onClose={() => {
          setEducationModalOpen(false);
          setSelectedEducation(null);
        }}
        title={selectedEducation ? "Edit Pendidikan" : "Tambah Pendidikan"}
      >
        <EducationForm
          education={selectedEducation}
          onSuccess={() => {
            setEducationModalOpen(false);
            setSelectedEducation(null);
            queryClient.invalidateQueries("educations");
          }}
          onCancel={() => {
            setEducationModalOpen(false);
            setSelectedEducation(null);
          }}
        />
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => {
          setSkillModalOpen(false);
          setSelectedSkill(null);
        }}
        title={selectedSkill ? "Edit Keahlian" : "Tambah Keahlian"}
      >
        <SkillForm
          skill={selectedSkill}
          onSuccess={() => {
            setSkillModalOpen(false);
            setSelectedSkill(null);
            queryClient.invalidateQueries("skills");
          }}
          onCancel={() => {
            setSkillModalOpen(false);
            setSelectedSkill(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Profile;
