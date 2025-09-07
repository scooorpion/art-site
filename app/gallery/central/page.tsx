'use client';

import { useState, useEffect } from 'react';
import CentralGallery from '../../components/CentralGallery';
import Navigation from '../../components/Navigation';
import { Artwork } from '../../data/artworks';
import { useRouter } from 'next/navigation';
import { getArtworks } from '../../services/api';

export default function CentralGalleryPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        setArtworks(data);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    try {
      router.push(`/gallery/story?artwork=${artwork.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation currentView="central" />
      <CentralGallery
        artworks={artworks}
        onArtworkClick={handleArtworkClick}
      />
    </div>
  );
}