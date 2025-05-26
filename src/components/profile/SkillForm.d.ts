import * as React from "react";

export interface Skill {
  id?: number;
  nama_skill?: string;
  level?: string;
  sertifikasi?: string;
}

export interface SkillFormProps {
  skill?: Skill | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

declare const SkillForm: React.FC<SkillFormProps>;
export default SkillForm; 