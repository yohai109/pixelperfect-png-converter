import React from 'react';
import { Upload, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ svgFile, onFileSelect }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/svg+xml') {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block cursor-pointer group"
      >
        <input
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/30 group-hover:scale-[1.02]">
          {svgFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileImage className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{svgFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">Click to change file</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Drop your SVG here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </label>
    </motion.div>
  );
}