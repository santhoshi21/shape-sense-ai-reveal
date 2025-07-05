
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  imagePreview: string | null;
}

export const ImageUploader = ({ onImageSelect, selectedImage, imagePreview }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (imagePreview) {
    return (
      <div className="relative">
        <div className="aspect-[3/4] max-h-96 overflow-hidden rounded-lg border-2 border-gray-200">
          <img
            src={imagePreview}
            alt="Selected for analysis"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => {
            onImageSelect(null as any);
          }}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {selectedImage && (
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>File:</strong> {selectedImage.name}</p>
            <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-blue-600" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop the image here' : 'Upload Person Image'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop or click to select • PNG, JPG, GIF up to 10MB
          </p>
          <p className="text-xs text-gray-400 mt-2">
            For best results, use a clear full-body image with good lighting
          </p>
        </div>
      </div>
    </div>
  );
};
