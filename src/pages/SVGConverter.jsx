import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import FileUpload from '../components/converter/FileUpload';
import SizeManager from '../components/converter/SizeManager';
import SVGPreview from '../components/converter/SVGPreview';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';

export default function SVGConverter() {
  const [svgFile, setSvgFile] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [converting, setConverting] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [folderStructure, setFolderStructure] = useState('flat');

  const convertSVGToPNG = async (svgFile, width, height) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target.result;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        };

        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
      };
      reader.readAsText(svgFile);
    });
  };

  const handleConvert = async () => {
    if (!svgFile || sizes.length === 0) return;

    setConverting(true);

    try {
      const zip = new JSZip();
      const originalName = svgFile.name.replace('.svg', '');
      const fileName = customFileName.trim() || originalName;

      for (const size of sizes) {
        const pngBlob = await convertSVGToPNG(svgFile, size.width, size.height);
        
        if (folderStructure === 'folders') {
          zip.file(`${size.width}x${size.height}/${fileName}.png`, pngBlob);
        } else {
          zip.file(`${fileName}_${size.width}x${size.height}.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${fileName}_converted.zip`);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Professional SVG Converter
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            SVG to PNG
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your SVG files to multiple PNG sizes instantly. Perfect for app icons, favicons, and web assets.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* File Upload */}
          <FileUpload svgFile={svgFile} onFileSelect={setSvgFile} />

          {svgFile && (
            <>
              {/* File Name and Structure Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100 space-y-6"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Output File Name (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder={svgFile.name.replace('.svg', '')}
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    className="max-w-md"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to use original filename
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Download Structure
                  </label>
                  <RadioGroup value={folderStructure} onValueChange={setFolderStructure}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flat" id="flat" />
                      <Label htmlFor="flat" className="font-normal cursor-pointer">
                        <div>
                          <div className="font-medium">Flat structure</div>
                          <div className="text-xs text-gray-500">filename_64x64.png, filename_128x128.png, ...</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <RadioGroupItem value="folders" id="folders" />
                      <Label htmlFor="folders" className="font-normal cursor-pointer">
                        <div>
                          <div className="font-medium">Folder per size</div>
                          <div className="text-xs text-gray-500">64x64/filename.png, 128x128/filename.png, ...</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>

              {/* Size Manager */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100"
              >
                <SizeManager sizes={sizes} onSizesChange={setSizes} svgFile={svgFile} />
              </motion.div>

              {/* Preview */}
              <SVGPreview svgFile={svgFile} />

              {/* Convert Button */}
              {sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    {converting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Convert & Download ZIP
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 text-sm text-gray-500"
        >
          All conversions happen in your browser. Your files never leave your device.
        </motion.div>
      </div>
    </div>
  );
}