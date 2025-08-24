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
}

export default function GridGallery({ artworks, onArtworkClick }: GridGalleryProps) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 sm:pt-24 md:pt-32 mobile-nav-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 large-container">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            <AnimatedText
              variant="fadeInUp"
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif font-bold mb-4 mobile-title large-title bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            >
              艺术画廊
            </AnimatedText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            探索精美的艺术作品，感受每一幅画背后的故事与情感
          </motion.p>
        </div>

        {/* 搜索和筛选区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mobile-filters">
            {/* 搜索框 */}
            <motion.div
              className="relative flex-1 max-w-md"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索作品、艺术家或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 caret-black dark:caret-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:shadow-md"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={20} />
              <span>筛选</span>
            </motion.button>
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
                className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={clsx(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
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

        {/* 结果统计 */}
        <div className="mb-6">
          <p className="text-gray-600">
            共找到 <span className="font-semibold text-gray-900 dark:text-white">{filteredArtworks.length}</span> 件作品
          </p>
        </div>

        {/* 作品网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-12 mobile-grid tablet-grid large-grid"
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
                whileHover={{ y: -8 }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* 图片容器 */}
                  <div className="relative aspect-[4/3] overflow-hidden transition-all duration-300 ease-in-out">
                    <OptimizedImage
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      sizes={imageSizes.gallery}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* 交互按钮 */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <motion.button
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200 mobile-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // 收藏功能
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // 分享功能
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center space-x-2 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>点击查看详情</span>
                      </div>
                      <p className="text-xs opacity-80 mt-1">{artwork.medium}</p>
                    </div>
                    
                    {/* 特色标签 */}
                    {artwork.featured && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                      >
                        精选
                      </motion.div>
                    )}
                  </div>

                  {/* 作品信息 */}
                  <motion.div
                    className="p-4 bg-white dark:bg-gray-900"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
                      {artwork.artist} · {artwork.year}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
                      {artwork.medium} · {artwork.dimensions}
                    </p>
                    
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {artwork.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{artwork.tags.length - 3}
                        </span>
                      )}
                    </div>
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