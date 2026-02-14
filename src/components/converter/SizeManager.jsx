import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Link2, Check, Edit2, FolderOpen, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import PresetLibrary from './PresetLibrary';

export default function SizeManager({ sizes, onSizesChange, svgFile }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [customPresets, setCustomPresets] = useState([]);
  const [newPresetSize, setNewPresetSize] = useState('');
  const [androidMdpiWidth, setAndroidMdpiWidth] = useState('');
  const [androidMdpiHeight, setAndroidMdpiHeight] = useState('');
  const [ios1xWidth, setIos1xWidth] = useState('');
  const [ios1xHeight, setIos1xHeight] = useState('');
  const [presetGroups, setPresetGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

  useEffect(() => {
    const loadCustomPresets = () => {
      const savedPresets = localStorage.getItem('svg_converter_presets');
      const savedGroups = localStorage.getItem('svg_converter_preset_groups');
      
      if (savedPresets) {
        try {
          setCustomPresets(JSON.parse(savedPresets));
        } catch (e) {
          console.error('Failed to load presets:', e);
        }
      }
      
      if (savedGroups) {
        try {
          setPresetGroups(JSON.parse(savedGroups));
        } catch (e) {
          console.error('Failed to load preset groups:', e);
        }
      }
    };
    loadCustomPresets();
  }, []);

  useEffect(() => {
    if (svgFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(e.target.result, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          const viewBox = svgElement.getAttribute('viewBox');
          let svgWidth, svgHeight;
          
          if (viewBox) {
            const [, , w, h] = viewBox.split(' ').map(Number);
            svgWidth = w;
            svgHeight = h;
          } else {
            svgWidth = parseFloat(svgElement.getAttribute('width')) || 100;
            svgHeight = parseFloat(svgElement.getAttribute('height')) || 100;
          }
          
          setAspectRatio(svgWidth / svgHeight);
        }
      };
      reader.readAsText(svgFile);
    }
  }, [svgFile]);

  const handleWidthChange = (value) => {
    setWidth(value);
    if (keepAspectRatio && value) {
      const calculatedHeight = Math.round(parseFloat(value) / aspectRatio);
      setHeight(calculatedHeight.toString());
    }
  };

  const handleHeightChange = (value) => {
    setHeight(value);
    if (keepAspectRatio && value) {
      const calculatedWidth = Math.round(parseFloat(value) * aspectRatio);
      setWidth(calculatedWidth.toString());
    }
  };

  const addSize = () => {
    const w = parseInt(width);
    const h = parseInt(height);
    
    if (w > 0 && h > 0) {
      onSizesChange([...sizes, { width: w, height: h }]);
      setWidth('');
      setHeight('');
    }
  };

  const removeSize = (index) => {
    onSizesChange(sizes.filter((_, i) => i !== index));
  };

  const addPreset = (size) => {
    onSizesChange([...sizes, { width: size, height: size }]);
  };

  const addAndroidSizes = () => {
    const w = parseInt(androidMdpiWidth);
    const h = parseInt(androidMdpiHeight);
    if (w > 0 && h > 0) {
      const androidSizes = [
        { width: w, height: h }, // mdpi (1x)
        { width: Math.round(w * 1.5), height: Math.round(h * 1.5) }, // hdpi (1.5x)
        { width: w * 2, height: h * 2 }, // xhdpi (2x)
        { width: w * 3, height: h * 3 }, // xxhdpi (3x)
        { width: w * 4, height: h * 4 }, // xxxhdpi (4x)
      ];
      onSizesChange([...sizes, ...androidSizes]);
      setAndroidMdpiWidth('');
      setAndroidMdpiHeight('');
    }
  };

  const addIosSizes = () => {
    const w = parseInt(ios1xWidth);
    const h = parseInt(ios1xHeight);
    if (w > 0 && h > 0) {
      const iosSizes = [
        { width: w, height: h }, // 1x
        { width: w * 2, height: h * 2 }, // 2x (Retina)
        { width: w * 3, height: h * 3 }, // 3x (Retina HD)
      ];
      onSizesChange([...sizes, ...iosSizes]);
      setIos1xWidth('');
      setIos1xHeight('');
    }
  };

  const saveAsGroup = async () => {
    if (!newGroupName.trim() || sizes.length === 0) return;
    
    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      sizes: [...sizes]
    };
    
    const updatedGroups = [...presetGroups, newGroup];
    setPresetGroups(updatedGroups);
    localStorage.setItem('svg_converter_preset_groups', JSON.stringify(updatedGroups));
    setNewGroupName('');
  };

  const loadGroup = (group) => {
    onSizesChange([...sizes, ...group.sizes]);
  };

  const deleteGroup = async (groupId) => {
    const updatedGroups = presetGroups.filter(g => g.id !== groupId);
    setPresetGroups(updatedGroups);
    localStorage.setItem('svg_converter_preset_groups', JSON.stringify(updatedGroups));
  };

  const startEditingGroup = (group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  const saveGroupName = async (groupId) => {
    if (!editingGroupName.trim()) return;
    
    const updatedGroups = presetGroups.map(g => 
      g.id === groupId ? { ...g, name: editingGroupName.trim() } : g
    );
    setPresetGroups(updatedGroups);
    localStorage.setItem('svg_converter_preset_groups', JSON.stringify(updatedGroups));
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  const exportGroups = () => {
    const groupsToExport = selectedGroupIds.length > 0
      ? presetGroups.filter(g => selectedGroupIds.includes(g.id))
      : presetGroups;
    
    const dataStr = JSON.stringify(groupsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'svg-converter-preset-groups.json';
    link.click();
    URL.revokeObjectURL(url);
    setSelectedGroupIds([]);
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const importGroups = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedGroups = JSON.parse(event.target.result);
        if (Array.isArray(importedGroups)) {
          const updatedGroups = [...presetGroups, ...importedGroups];
          setPresetGroups(updatedGroups);
          localStorage.setItem('svg_converter_preset_groups', JSON.stringify(updatedGroups));
        }
      } catch (error) {
        console.error('Failed to import groups:', error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addCustomPreset = async () => {
    const size = parseInt(newPresetSize);
    if (size > 0 && !customPresets.includes(size)) {
      const newPresets = [...customPresets, size].sort((a, b) => a - b);
      setCustomPresets(newPresets);
      localStorage.setItem('svg_converter_presets', JSON.stringify(newPresets));
      setNewPresetSize('');
    }
  };

  const removeCustomPreset = async (size) => {
    const newPresets = customPresets.filter(s => s !== size);
    setCustomPresets(newPresets);
    localStorage.setItem('svg_converter_presets', JSON.stringify(newPresets));
  };

  const handleApplyPreset = (presetSizes) => {
    onSizesChange([...sizes, ...presetSizes]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Preset Library */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Platform Presets</label>
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-6 border border-gray-200">
          <PresetLibrary onApplyPreset={handleApplyPreset} />
        </div>
      </div>

      {/* Preset Groups */}
      {(presetGroups.length > 0 || sizes.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Preset Groups</label>
            {presetGroups.length > 0 && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={exportGroups}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export {selectedGroupIds.length > 0 && `(${selectedGroupIds.length})`}
                </Button>
                <label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importGroups}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    onClick={(e) => e.currentTarget.previousElementSibling.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Import
                  </Button>
                </label>
              </div>
            )}
          </div>
          
          {sizes.length > 0 && (
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveAsGroup()}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                onClick={saveAsGroup}
                disabled={!newGroupName.trim() || sizes.length === 0}
                variant="outline"
                size="sm"
                className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                Save Current Sizes
              </Button>
            </div>
          )}

          {presetGroups.length > 0 && (
            <div className="space-y-2">
              <AnimatePresence>
                {presetGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <Checkbox
                      checked={selectedGroupIds.includes(group.id)}
                      onCheckedChange={() => toggleGroupSelection(group.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <FolderOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    
                    {editingGroupId === group.id ? (
                      <>
                        <Input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveGroupName(group.id)}
                          className="flex-1 h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => saveGroupName(group.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{group.name}</div>
                          <div className="text-xs text-gray-500">{group.sizes.length} sizes</div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditingGroup(group)}
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => loadGroup(group)}
                          className="text-xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                        >
                          Load
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGroup(group.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Preset Sizes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Quick Presets</label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[64, 128, 256, 512, 1024, 2048].map((size) => (
              <Button
                key={size}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPreset(size)}
                className="text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200"
              >
                {size}×{size}
              </Button>
            ))}
          </div>
          
          {customPresets.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <AnimatePresence>
                {customPresets.map((size) => (
                  <motion.div
                    key={size}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPreset(size)}
                      className="text-xs font-medium hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-all duration-200 pr-7"
                    >
                      {size}×{size}
                    </Button>
                    <button
                      onClick={() => removeCustomPreset(size)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Add custom preset..."
              value={newPresetSize}
              onChange={(e) => setNewPresetSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomPreset()}
              className="flex-1 text-sm"
              min="1"
            />
            <Button
              type="button"
              onClick={addCustomPreset}
              disabled={!newPresetSize}
              variant="outline"
              size="sm"
              className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Android Density Sizes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Android Density Sizes</label>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="mdpi Width"
            value={androidMdpiWidth}
            onChange={(e) => setAndroidMdpiWidth(e.target.value)}
            className="flex-1 text-sm"
            min="1"
          />
          <span className="text-gray-400 self-center">×</span>
          <Input
            type="number"
            placeholder="mdpi Height"
            value={androidMdpiHeight}
            onChange={(e) => setAndroidMdpiHeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAndroidSizes()}
            className="flex-1 text-sm"
            min="1"
          />
          <Button
            type="button"
            onClick={addAndroidSizes}
            disabled={!androidMdpiWidth || !androidMdpiHeight}
            variant="outline"
            size="sm"
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 whitespace-nowrap"
          >
            Add mdpi-xxxhdpi
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Generates mdpi (1x), hdpi (1.5x), xhdpi (2x), xxhdpi (3x), and xxxhdpi (4x)
        </p>
      </div>

      {/* iOS Density Sizes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">iOS Density Sizes</label>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="1x Width"
            value={ios1xWidth}
            onChange={(e) => setIos1xWidth(e.target.value)}
            className="flex-1 text-sm"
            min="1"
          />
          <span className="text-gray-400 self-center">×</span>
          <Input
            type="number"
            placeholder="1x Height"
            value={ios1xHeight}
            onChange={(e) => setIos1xHeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addIosSizes()}
            className="flex-1 text-sm"
            min="1"
          />
          <Button
            type="button"
            onClick={addIosSizes}
            disabled={!ios1xWidth || !ios1xHeight}
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 whitespace-nowrap"
          >
            Add 1x-3x
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Generates 1x, 2x (Retina), and 3x (Retina HD)
        </p>
      </div>

      {/* Custom Size Input */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Custom Size</label>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              id="aspectRatio"
              checked={keepAspectRatio}
              onCheckedChange={setKeepAspectRatio}
            />
            <label
              htmlFor="aspectRatio"
              className="text-sm text-gray-600 cursor-pointer flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              Keep aspect ratio
            </label>
          </div>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Width"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="flex-1"
              min="1"
            />
            <span className="text-gray-400 self-center">×</span>
            <Input
              type="number"
              placeholder="Height"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="flex-1"
              min="1"
            />
            <Button
              type="button"
              onClick={addSize}
              disabled={!width || !height}
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Selected Sizes ({sizes.length})
            </label>
            <Button
              type="button"
              onClick={() => onSizesChange([])}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {sizes.map((size, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg shadow-indigo-200"
                >
                  {size.width}×{size.height}
                  <button
                    onClick={() => removeSize(index)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}