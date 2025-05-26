import * as React from "react";

export interface Education {
  id?: number;
  institusi?: string;
  jenjang?: string;
  jurusan?: string;
  lokasi?: string;
  tanggal_mulai?: string;
  tanggal_akhir?: string;
  ipk?: string;
  deskripsi?: string;
}

export interface EducationFormProps {
  education?: Education | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

declare const EducationForm: React.FC<EducationFormProps>;
export default EducationForm; 