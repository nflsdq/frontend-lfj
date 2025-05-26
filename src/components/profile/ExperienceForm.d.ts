import * as React from "react";

export interface Experience {
  id?: number;
  institusi?: string;
  posisi?: string;
  lokasi?: string;
  tanggal_mulai?: string;
  tanggal_akhir?: string;
  deskripsi?: string;
}

export interface ExperienceFormProps {
  experience?: Experience | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

declare const ExperienceForm: React.FC<ExperienceFormProps>;
export default ExperienceForm; 