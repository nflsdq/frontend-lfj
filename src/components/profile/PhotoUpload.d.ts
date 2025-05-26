import * as React from "react";

export interface PhotoUploadProps {
  initialPhoto?: string | null;
  onPhotoChange: (file: File | null) => void;
  className?: string;
}

declare const PhotoUpload: React.FC<PhotoUploadProps>;
export default PhotoUpload; 