'use client';

import CentralGallery from '../../components/CentralGallery';
import Navigation from '../../components/Navigation';
import { artworks } from '../../data/artworks';
import { Artwork } from '../../data/artworks';
import { useRouter } from 'next/navigation';

export default function CentralGalleryPage() {
  const router = useRouter();

  const handleArtworkClick = (artwork: Artwork) => {
    try {
      router.push(`/gallery/story?artwork=${artwork.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

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