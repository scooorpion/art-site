'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Heart, Share2, Eye } from 'lucide-react';
import OptimizedImage, { imageSizes, aspectRatios } from './OptimizedImage';
import { Artwork } from '../data/artworks';
import { clsx } from 'clsx';
import AnimatedText from './AnimatedText';
// 移除动态尺寸相关的导入

interface GridGalleryProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
  showSearchFilter?: boolean;
  onToggleSearchFilter?: () => void;
}

export default function GridGallery({ artworks, onArtworkClick, showSearchFilter = false, onToggleSearchFilter }: GridGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // 移除动态尺寸相关的状态和效果

  const categories = useMemo(() => [
    { id: 'all', label: '全部作品' },
    { id: 'oil', label: '油画' },
    { id: 'sketch', label: '素描' },
    { id: 'mixed', label: '综合材料' }
  ], []);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [artworks, searchTerm, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20 sm:pt-24 md:pt-32 mobile-nav-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 large-container">


        {/* 搜索和筛选区域 */}
        <AnimatePresence>
          {showSearchFilter && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.2, 
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.15 }
              }}
              className="mb-8"
            >
          <div className="space-y-4 sm:space-y-0 mobile-filters">
            {/* 移动端：搜索框和筛选按钮在同一行 */}
            <div className="sm:hidden px-4">
              <div className="flex gap-3 items-center max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                  <input
                    type="text"
                    placeholder="搜索作品..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] caret-[var(--foreground)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]/50 transition-all duration-300 text-sm"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={clsx(
                    "flex items-center justify-center p-2.5 border border-[var(--border)] rounded-full transition-all duration-300",
                    isFilterOpen
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)]"
                      : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter size={18} />
                </motion.button>
              </div>
            </div>
            
            {/* 桌面端：原有布局 */}
            <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* 搜索框 */}
            <motion.div
              className="relative flex-1 w-full sm:max-w-md"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
              <input
                type="text"
                placeholder="搜索作品、艺术家或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] caret-[var(--foreground)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-md"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              )}
            </motion.div>

            {/* 筛选按钮 */}
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-full hover:bg-[var(--muted)] transition-all duration-300 hover:shadow-md w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={20} />
              <span>筛选</span>
              <motion.div
                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-1"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[var(--muted-foreground)]">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.button>
            </div>
          </div>

          {/* 筛选选项 */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20,
                  transition: { duration: 0.2 }
                }}
                className="mt-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={clsx(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                        selectedCategory === category.id
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg'
                          : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)] hover:shadow-md'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 结果统计 - 只在有搜索或筛选条件时显示 */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mb-6">
            <p className="text-[var(--muted-foreground)]">
              共找到 <span className="font-semibold text-[var(--foreground)]">{filteredArtworks.length}</span> 件作品
            </p>
          </div>
        )}

        {/* 作品网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-12"
        >
          <AnimatePresence>
            {filteredArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                variants={itemVariants}
                layout
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="group cursor-pointer"
                onClick={() => onArtworkClick(artwork)}
              >
                <div className="bg-[var(--background)] hover:bg-[var(--muted)] transition-all duration-300 overflow-hidden">
                  {/* 图片容器 */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      sizes={imageSizes.gallery}
                      className="object-cover"
                    />
                    

                  </div>

                  {/* 作品信息 */}
                  <motion.div
                    className="p-4 bg-[var(--background)]"
                    initial={{ opacity: 1 }}
                  >
                    <h3 className="font-medium text-base mb-1 text-[var(--foreground)]">{artwork.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      {artwork.year}
                    </p>
                    <p className="text-[var(--muted-foreground)] text-xs mt-1">
                      {artwork.medium}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 空状态 */}
        {filteredArtworks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关作品</h3>
            <p className="text-gray-600">请尝试调整搜索条件或筛选选项</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}