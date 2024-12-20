import React, { useEffect, useState } from 'react';
import { MdOutlineBookmarkAdd, MdOutlineBookmark } from 'react-icons/md';
import * as CFI from 'foliate-js/epubcfi.js';

import { useSettingsStore } from '@/store/settingsStore';
import { useBookDataStore } from '@/store/bookDataStore';
import { useReaderStore } from '@/store/readerStore';
import { useEnv } from '@/context/EnvContext';
import { BookNote } from '@/types/book';
import { uniqueId } from '@/utils/misc';
import Button from '@/components/Button';

interface BookmarkTogglerProps {
  bookKey: string;
}

const BookmarkToggler: React.FC<BookmarkTogglerProps> = ({ bookKey }) => {
  const { envConfig } = useEnv();
  const { settings } = useSettingsStore();
  const { getConfig, saveConfig, updateBooknotes } = useBookDataStore();
  const { getProgress, setBookmarkRibbonVisibility } = useReaderStore();
  const config = getConfig(bookKey)!;
  const progress = getProgress(bookKey)!;

  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    const { booknotes: bookmarks = [] } = config;
    const { location: cfi, range } = progress;
    if (!cfi) return;
    if (!isBookmarked) {
      setIsBookmarked(true);
      const text = range?.startContainer.textContent?.slice(0, 128) || '';
      const truncatedText = text.length === 128 ? text + '...' : text;
      const bookmark: BookNote = {
        id: uniqueId(),
        type: 'bookmark',
        cfi,
        text: truncatedText,
        note: '',
        created: Date.now(),
      };
      bookmarks.push(bookmark);
      const updatedConfig = updateBooknotes(bookKey, bookmarks);
      if (updatedConfig) {
        saveConfig(envConfig, bookKey, updatedConfig, settings);
      }
    } else {
      setIsBookmarked(false);
      const start = CFI.collapse(cfi);
      const end = CFI.collapse(cfi, true);
      const updatedConfig = updateBooknotes(
        bookKey,
        bookmarks.filter(
          (item) =>
            item.type !== 'bookmark' ||
            CFI.compare(start, item.cfi) * CFI.compare(end, item.cfi) > 0,
        ),
      );
      if (updatedConfig) {
        saveConfig(envConfig, bookKey, updatedConfig, settings);
      }
    }
  };

  useEffect(() => {
    const { booknotes = [] } = config || {};
    const { location: cfi } = progress || {};
    if (!cfi) return;

    const start = CFI.collapse(cfi);
    const end = CFI.collapse(cfi, true);
    const locationBookmarked = booknotes
      .filter((booknote) => booknote.type === 'bookmark')
      .some((item) => CFI.compare(start, item.cfi) * CFI.compare(end, item.cfi) <= 0);
    setIsBookmarked(locationBookmarked);
    setBookmarkRibbonVisibility(bookKey, locationBookmarked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, progress]);

  return (
    <Button
      icon={
        isBookmarked ? (
          <MdOutlineBookmark size={20} className='text-base-content' />
        ) : (
          <MdOutlineBookmarkAdd size={20} className='text-base-content' />
        )
      }
      onClick={toggleBookmark}
      tooltip='Bookmark'
      tooltipDirection='bottom'
    ></Button>
  );
};

export default BookmarkToggler;
