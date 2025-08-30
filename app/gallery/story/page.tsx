'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import StoryGallery from '../../components/StoryGallery';
import Navigation from '../../components/Navigation';
import { artworks } from '../../data/artworks';

function StoryGalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const artworkId = searchParams.get('artwork');
  
  const selectedArtwork = artworkId 
    ? artworks.find(artwork => artwork.id === artworkId)
    : undefined;

  const handleClose = () => {
    try {
      router.push('/gallery/grid');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation currentView="story" />
      <StoryGallery
        artworks={artworks}
        selectedArtwork={selectedArtwork}
        onClose={handleClose}
      />
    </div>
  );
}

export default function StoryGalleryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryGalleryContent />
    </Suspense>
  );
}