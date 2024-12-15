import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MdInfoOutline } from 'react-icons/md';

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  format: string;
}

const BookCard: React.FC<BookCardProps> = ({ cover, title, author, format }) => {
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
      if (event.target instanceof HTMLElement && event.target.closest('button')) {
        toggleDetails();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className='flex h-20 w-full items-center'>
      {/* Book Cover */}
      <Image
        src={cover}
        alt='Book cover'
        width={56}
        height={80}
        className='mr-4 aspect-auto max-h-20 w-[15%] max-w-14 rounded-sm object-cover shadow-md'
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Book Info */}
      <div className='min-w-0 flex-1'>
        <h4 className='line-clamp-2 w-[90%] text-sm font-semibold'>{title}</h4>
        <p className='text-neutral-content truncate text-xs'>{author}</p>
      </div>

      {/* Info Button */}
      <div className='relative'>
        <button
          onClick={toggleDetails}
          className='btn btn-ghost hover:bg-base-300 h-6 min-h-6 w-6 rounded-full p-0 transition-colors'
          aria-label='More info'
        >
          <MdInfoOutline size={18} className='fill-base-content' />
        </button>

        {/* Popup Details */}
        {showDetails && (
          <div
            ref={detailsRef}
            className='absolute right-0 top-8 z-10 w-52 rounded-md bg-base-200 p-2 shadow-lg'
          >
            <h5 className='font-semibold text-sm mb-1'>Book Format</h5>
            <p className='text-xs text-neutral-content'>{format}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
