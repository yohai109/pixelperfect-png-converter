import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SVGPreview({ svgFile }) {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    if (svgFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgContent(e.target.result);
      };
      reader.readAsText(svgFile);
    }
  }, [svgFile]);

  if (!svgContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100"
    >
      <label className="text-sm font-medium text-gray-700 mb-4 block">Preview</label>
      <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full max-h-[300px]"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </motion.div>
  );
}