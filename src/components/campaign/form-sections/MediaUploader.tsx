
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface MediaUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mediaPreview: string | null;
  mediaFile: File | null;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onFileChange, mediaPreview, mediaFile }) => {
  return (
    <div className="space-y-2">
      <FormLabel>Product Image/Video</FormLabel>
      <Input 
        type="file" 
        onChange={onFileChange}
        accept="image/*,video/*"
      />
      
      {mediaPreview && (
        <div className="mt-2 border rounded-md overflow-hidden w-40 h-40">
          {mediaFile?.type.startsWith('image/') ? (
            <img 
              src={mediaPreview} 
              alt="Media preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              src={mediaPreview} 
              controls 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};
