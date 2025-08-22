'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到默认的画廊页面
    router.push('/gallery/grid');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">加载中...</h1>
        <p className="text-gray-600">正在跳转到画廊页面</p>
      </div>
    </div>
  );
}
