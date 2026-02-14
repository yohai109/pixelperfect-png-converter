import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Star, StarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_PRESETS = {
  web: {
    name: 'Web Icons',
    presets: [
      { name: 'Favicon', sizes: [{ width: 16, height: 16 }, { width: 32, height: 32 }, { width: 48, height: 48 }] },
      { name: 'Apple Touch Icon', sizes: [{ width: 180, height: 180 }] },
      { name: 'PWA Icons', sizes: [{ width: 192, height: 192 }, { width: 512, height: 512 }] },
      { name: 'Web App Manifest', sizes: [{ width: 72, height: 72 }, { width: 96, height: 96 }, { width: 128, height: 128 }, { width: 144, height: 144 }, { width: 152, height: 152 }, { width: 192, height: 192 }, { width: 384, height: 384 }, { width: 512, height: 512 }] },
    ]
  },
  ios: {
    name: 'iOS App Icons',
    presets: [
      { name: 'iPhone', sizes: [{ width: 120, height: 120 }, { width: 180, height: 180 }] },
      { name: 'iPad', sizes: [{ width: 152, height: 152 }, { width: 167, height: 167 }] },
      { name: 'App Store', sizes: [{ width: 1024, height: 1024 }] },
      { name: 'All iOS Icons', sizes: [{ width: 40, height: 40 }, { width: 58, height: 58 }, { width: 60, height: 60 }, { width: 80, height: 80 }, { width: 87, height: 87 }, { width: 120, height: 120 }, { width: 152, height: 152 }, { width: 167, height: 167 }, { width: 180, height: 180 }, { width: 1024, height: 1024 }] },
    ]
  },
  android: {
    name: 'Android App Icons',
    presets: [
      { name: 'Launcher Icon', sizes: [{ width: 48, height: 48 }, { width: 72, height: 72 }, { width: 96, height: 96 }, { width: 144, height: 144 }, { width: 192, height: 192 }] },
      { name: 'Notification Icon', sizes: [{ width: 24, height: 24 }, { width: 36, height: 36 }, { width: 48, height: 48 }, { width: 72, height: 72 }, { width: 96, height: 96 }] },
      { name: 'Play Store', sizes: [{ width: 512, height: 512 }] },
      { name: 'All Android Icons', sizes: [{ width: 36, height: 36 }, { width: 48, height: 48 }, { width: 72, height: 72 }, { width: 96, height: 96 }, { width: 144, height: 144 }, { width: 192, height: 192 }, { width: 512, height: 512 }] },
    ]
  },
  social: {
    name: 'Social Media',
    presets: [
      { name: 'Facebook', sizes: [{ width: 1200, height: 630 }, { width: 180, height: 180 }] },
      { name: 'Twitter/X', sizes: [{ width: 1200, height: 675 }, { width: 400, height: 400 }] },
      { name: 'Instagram', sizes: [{ width: 1080, height: 1080 }, { width: 1080, height: 1920 }] },
      { name: 'LinkedIn', sizes: [{ width: 1200, height: 627 }, { width: 300, height: 300 }] },
      { name: 'YouTube Thumbnail', sizes: [{ width: 1280, height: 720 }] },
    ]
  },
  common: {
    name: 'Common Sizes',
    presets: [
      { name: 'Square Icons', sizes: [{ width: 16, height: 16 }, { width: 32, height: 32 }, { width: 64, height: 64 }, { width: 128, height: 128 }, { width: 256, height: 256 }, { width: 512, height: 512 }] },
      { name: 'Thumbnails', sizes: [{ width: 150, height: 150 }, { width: 300, height: 300 }] },
      { name: 'HD Sizes', sizes: [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }, { width: 2560, height: 1440 }] },
    ]
  }
};

export default function PresetLibrary({ onApplyPreset }) {
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('web');

  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('svg_converter_favorite_presets');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          console.error('Failed to load favorites:', e);
        }
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (category, presetName) => {
    const favoriteKey = `${category}:${presetName}`;
    const newFavorites = favorites.includes(favoriteKey)
      ? favorites.filter(f => f !== favoriteKey)
      : [...favorites, favoriteKey];
    
    setFavorites(newFavorites);
    localStorage.setItem('svg_converter_favorite_presets', JSON.stringify(newFavorites));
  };

  const isFavorite = (category, presetName) => {
    return favorites.includes(`${category}:${presetName}`);
  };

  const getFavoritePresets = () => {
    return favorites.map(fav => {
      const [category, presetName] = fav.split(':');
      const preset = PLATFORM_PRESETS[category]?.presets.find(p => p.name === presetName);
      return preset ? { ...preset, category } : null;
    }).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="favorites" className="text-xs">
            <Star className="w-3.5 h-3.5 mr-1" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="web" className="text-xs">Web</TabsTrigger>
          <TabsTrigger value="ios" className="text-xs">iOS</TabsTrigger>
          <TabsTrigger value="android" className="text-xs">Android</TabsTrigger>
          <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
          <TabsTrigger value="common" className="text-xs">Common</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="space-y-2 mt-4">
          {getFavoritePresets().length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No favorite presets yet. Star presets from other tabs to add them here.
            </p>
          ) : (
            <AnimatePresence>
              {getFavoritePresets().map((preset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                    <div className="text-xs text-gray-500">{preset.sizes.length} sizes</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(preset.category, preset.name)}
                      className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onApplyPreset(preset.sizes)}
                      className="text-xs hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </TabsContent>

        {Object.entries(PLATFORM_PRESETS).map(([category, data]) => (
          <TabsContent key={category} value={category} className="space-y-2 mt-4">
            <AnimatePresence>
              {data.presets.map((preset, index) => (
                <motion.div
                  key={preset.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preset.sizes.slice(0, 5).map((size, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {size.width}×{size.height}
                        </Badge>
                      ))}
                      {preset.sizes.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{preset.sizes.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(category, preset.name)}
                      className="h-8 w-8 p-0"
                    >
                      {isFavorite(category, preset.name) ? (
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onApplyPreset(preset.sizes)}
                      className="text-xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}