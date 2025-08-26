'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Grid3X3, Focus, BookOpen, Palette, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import AnimatedText, { GradientText } from './AnimatedText';

type ViewMode = 'grid' | 'central' | 'story';

interface NavigationProps {
  currentView: ViewMode;
  showSearchFilter?: boolean;
  onToggleSearchFilter?: () => void;
}

export default function Navigation({ currentView, showSearchFilter, onToggleSearchFilter }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleViewChange = (view: ViewMode) => {
    // 防止重复导航到当前页面
    if (view === currentView) {
      return;
    }
    
    try {
      switch (view) {
        case 'grid':
          router.push('/gallery/grid');
          break;
        case 'central':
          router.push('/gallery/central');
          break;
        case 'story':
          router.push('/gallery/story');
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const navItems = [
    {
      id: 'grid' as ViewMode,
      label: '画廊总览',
      icon: Grid3X3,
      description: '平铺式展示所有作品'
    },
    {
      id: 'central' as ViewMode,
      label: '中央展厅',
      icon: Focus,
      description: '聚焦式作品展示'
    },
    {
      id: 'story' as ViewMode,
      label: '艺术故事',
      icon: BookOpen,
      description: '沉浸式故事体验'
    }
  ];

  return (
    <>
      {/* 桌面导航 */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-3 shadow-2xl"
      >
        <div className="flex items-center space-x-4 lg:space-x-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Palette className="w-6 h-6 text-purple-600" />
            </motion.div>
            <AnimatedText
              variant="fadeInLeft"
              delay={0.3}
              className="font-serif text-xl font-bold"
            >
              <GradientText gradient="from-purple-600 via-pink-600 to-blue-600">
                Gallery
              </GradientText>
            </AnimatedText>
          </motion.div>
          <div className="flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative"
                >
                  <motion.button
                    onClick={() => handleViewChange(item.id)}
                    className={clsx(
                      'relative flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 rounded-full transition-all duration-300 group',
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{ borderRadius: '9999px' }}
                      />
                    )}
                    <Icon size={18} className="relative z-10 flex-shrink-0" />
                    <span className="text-sm font-medium relative z-10 whitespace-nowrap">{item.label}</span>
                    
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
            
            {/* 搜索按钮 - 仅在grid视图显示 */}
            {currentView === 'grid' && onToggleSearchFilter && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative ml-2"
              >
                <motion.button
                  onClick={onToggleSearchFilter}
                  className={clsx(
                    'relative flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 rounded-full transition-all duration-300 group',
                    showSearchFilter
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence>
                    {showSearchFilter && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          duration: 0.3
                        }}
                        style={{ borderRadius: '9999px' }}
                      />
                    )}
                  </AnimatePresence>
                  <Search size={18} className="relative z-10 flex-shrink-0" />
                  <span className="text-sm font-medium relative z-10 whitespace-nowrap">搜索</span>
                  
                  {!showSearchFilter && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* 移动端导航 */}
      <div className="md:hidden">
        {/* 移动端顶部栏 */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Palette className="w-6 h-6 text-purple-600" />
              </motion.div>
              <AnimatedText
                variant="fadeInLeft"
                delay={0.3}
                className="font-serif text-xl font-bold"
              >
                <GradientText gradient="from-purple-600 via-pink-600 to-blue-600">
                  Gallery
                </GradientText>
              </AnimatedText>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 移动端搜索按钮 - 仅在grid视图显示 */}
              {currentView === 'grid' && onToggleSearchFilter && (
                <motion.button
                  onClick={onToggleSearchFilter}
                  className={clsx(
                    'p-2 rounded-full transition-colors relative',
                    showSearchFilter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                  )}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Search size={20} />
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors relative"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
              
              {/* 菜单内容 */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-[89px] left-4 right-4 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl"
              >
                <div className="px-6 py-6 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.button
                          onClick={() => {
                            handleViewChange(item.id);
                            setIsOpen(false);
                          }}
                          className={clsx(
                            'w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 text-left relative group',
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                              : 'bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/10'
                          )}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveBackground"
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                              initial={false}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                          
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          )}
                          
                          <Icon size={22} className="relative z-10" />
                          <div className="relative z-10">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</div>
                            <div className={clsx(
                              'text-sm transition-colors duration-300',
                              isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                            )}>
                              {item.description}
                            </div>
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}