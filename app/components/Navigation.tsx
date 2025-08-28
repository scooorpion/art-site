'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import AnimatedText, { GradientText } from './AnimatedText';

type ViewMode = 'grid' | 'central';

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
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const navItems = [
    {
      id: 'grid' as ViewMode,
      label: 'OVERVIEW',
      description: '平铺式展示所有作品'
    },
    {
      id: 'central' as ViewMode,
      label: 'FOCUS',
      description: '聚焦式作品展示'
    }
  ];

  return (
    <>
      {/* 桌面导航 */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--background)]/90 backdrop-blur-xl border border-[var(--border)]/50 px-6 py-3 shadow-lg"
        style={{ borderRadius: '0.75rem' }}
      >
        <div className="flex items-center space-x-4 lg:space-x-8">
          <motion.div
            className="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <div className="flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item, index) => {
              // 移除了图标引用
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
                      'relative px-3 lg:px-4 py-2 transition-all duration-300 group',
                      isActive
                        ? 'text-[var(--accent-foreground)] bg-[var(--accent)]'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/10'
                    )}
                    style={{ borderRadius: '0.5rem' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  </motion.button>
                </motion.div>
              );
            })}
            
            {/* 搜索按钮 - 仅在grid视图显示 */}
              {currentView === 'grid' && onToggleSearchFilter && (
                <motion.div
                  className="relative ml-1 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                <motion.button
                    onClick={onToggleSearchFilter}
                    className={clsx(
                      'relative flex items-center justify-center p-2 transition-colors duration-300',
                      showSearchFilter
                        ? 'text-[var(--accent-foreground)] bg-[var(--accent)]'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/10'
                    )}
                    style={{ borderRadius: '0.5rem' }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Search size={18} />
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
          className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]/50"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            
            <div className="flex items-center space-x-1">
              {/* 移动端搜索按钮 - 仅在grid视图显示 */}
              {currentView === 'grid' && onToggleSearchFilter && (
                <motion.button
                onClick={onToggleSearchFilter}
                className={clsx(
                  'relative flex items-center justify-center p-3 transition-colors duration-300 min-w-[44px] min-h-[44px]',
                  showSearchFilter
                    ? 'text-[var(--accent-foreground)] bg-[var(--accent)]'
                    : 'text-[var(--muted-foreground)] active:text-[var(--foreground)] active:bg-[var(--accent)]/10'
                )}
                style={{ borderRadius: '0.5rem' }}
                whileTap={{ scale: 0.95 }}
              >
                  <Search size={20} />
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center p-3 active:bg-[var(--accent)]/20 transition-colors min-w-[44px] min-h-[44px]"
                style={{ borderRadius: '0.5rem' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Menu size={20} />
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
                className="fixed top-[89px] left-4 right-4 z-40 bg-[var(--background)]/95 backdrop-blur-xl border border-[var(--border)]/50 shadow-2xl"
                style={{ borderRadius: '1rem' }}
              >
                <div className="px-6 py-6 space-y-2">
                  {navItems.map((item, index) => {
                    // 移除了图标引用
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
                            'w-full flex items-center space-x-4 px-4 py-4 transition-all duration-300 text-left relative group min-h-[60px]',
                            isActive
                              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg'
                              : 'bg-transparent text-[var(--muted-foreground)] active:text-[var(--foreground)] active:bg-[var(--accent)]/10'
                          )}
                          style={{ borderRadius: '0.75rem' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveBackground"
                              className="absolute inset-0 bg-[var(--accent)]"
                              style={{ borderRadius: '0.75rem' }}
                              initial={false}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                          
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-[var(--accent)]"
                              style={{ borderRadius: '0.75rem' }}
                            />
                          )}
                          
                          <div className="relative z-10">
                            <div className={clsx(
                              "font-medium text-base",
                              isActive ? "text-[var(--accent-foreground)]" : "text-[var(--foreground)]"
                            )}>{item.label}</div>
                            <div className={clsx(
                              "text-sm mt-1",
                              isActive ? "text-[var(--accent-foreground)]/80" : "text-[var(--muted-foreground)]"
                            )}>{item.description}</div>
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