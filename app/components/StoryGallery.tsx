'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Info, BookOpen, Eye, Heart, Share2 } from 'lucide-react';
import OptimizedImage, { imageSizes, aspectRatios } from './OptimizedImage';
import { Artwork } from '../data/artworks';
import { clsx } from 'clsx';
import AnimatedText from './AnimatedText';

interface StoryGalleryProps {
  artworks: Artwork[];
  selectedArtwork?: Artwork;
  onClose: () => void;
}

export default function StoryGallery({ artworks, selectedArtwork, onClose }: StoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [direction, setDirection] = useState(0);

  // 如果有选中的作品，找到其索引
  useEffect(() => {
    if (selectedArtwork) {
      const index = artworks.findIndex(artwork => artwork.id === selectedArtwork.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedArtwork, artworks]);

  const currentArtwork = artworks[currentIndex];

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
      if (e.key === 'f' || e.key === 'F') setIsFullscreen(!isFullscreen);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={clsx(
      'fixed inset-0 z-50 bg-black',
      isFullscreen ? 'cursor-none' : 'cursor-default'
    )}>
      {/* 顶部控制栏 */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors mobile-button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <X size={24} />
                </motion.button>
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span className="font-medium">
                    <AnimatedText variant="fadeInLeft">
                      艺术故事
                    </AnimatedText>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setReadingMode(!readingMode)}
                  className={clsx(
                    'px-4 py-2 rounded-full transition-colors',
                    readingMode ? 'bg-white text-black' : 'bg-white/20 hover:bg-white/30'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  阅读模式
                </motion.button>
                <motion.button 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors mobile-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Heart size={20} />
                </motion.button>
                <motion.button 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={1}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 40 },
              opacity: { duration: 0.1 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrevious();
              }
            }}
            className="absolute inset-0 flex"
          >
            {readingMode ? (
              // 阅读模式布局
              <div className="w-full h-full flex">
                {/* 左侧图片 */}
                <div className="w-1/2 h-full relative p-8">
                  <div className="w-full h-full relative">
                    <OptimizedImage
                      src={currentArtwork.image}
                      alt={currentArtwork.title}
                      fill
                      sizes="50vw"
                      priority
                      objectFit="contain"
                    />
                  </div>
                </div>
                
                {/* 右侧文字 */}
                <div className="w-1/2 h-full overflow-y-auto p-12 text-white">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h1 className="text-4xl font-serif font-bold mb-4">
                        {currentArtwork.title}
                      </h1>
                      <div className="text-xl text-gray-300 mb-8">
                        <p>{currentArtwork.artist}</p>
                        <p className="text-lg">{currentArtwork.year} · {currentArtwork.medium}</p>
                        <p className="text-base text-gray-400">{currentArtwork.dimensions}</p>
                      </div>
                      
                      <div className="prose prose-invert prose-lg max-w-none">
                        <h3 className="text-2xl font-serif mb-4">作品描述</h3>
                        <p className="text-gray-200 leading-relaxed mb-8">
                          {currentArtwork.description}
                        </p>
                        
                        <h3 className="text-2xl font-serif mb-4">创作故事</h3>
                        <p className="text-gray-200 leading-relaxed">
                          {currentArtwork.story}
                        </p>
                      </div>
                      
                      {/* 标签 */}
                      <div className="mt-8">
                        <h4 className="text-lg font-medium mb-3">标签</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentArtwork.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              // 沉浸模式布局
              <div className="w-full h-full relative">
                {/* 背景图片 */}
                <div className="absolute inset-0">
                  <OptimizedImage
                    src={currentArtwork.image}
                    alt={currentArtwork.title}
                    fill
                    sizes="100vw"
                    priority
                    objectFit="contain"
                  />
                </div>
                
                {/* 底部信息面板 */}
                <AnimatePresence>
                  {!isFullscreen && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8"
                    >
                      <div className="max-w-4xl mx-auto text-white">
                        <h2 className="text-3xl font-serif font-bold mb-2">
                          {currentArtwork.title}
                        </h2>
                        <p className="text-xl text-gray-300 mb-4">
                          {currentArtwork.artist} · {currentArtwork.year}
                        </p>
                        <p className="text-gray-200 leading-relaxed max-w-3xl">
                          {currentArtwork.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      <AnimatePresence>
        {!isFullscreen && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={goToNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 底部进度条 */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
              {artworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  )}
                />
              ))}
              <span className="text-white text-sm ml-3">
                {currentIndex + 1} / {artworks.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全屏提示 */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm"
          >
            按 ESC 退出全屏 · 按 F 切换全屏 · 左右箭头导航
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击区域用于全屏切换 */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => setIsFullscreen(!isFullscreen)}
      />
    </div>
  );
}