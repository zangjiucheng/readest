import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { useReaderStore } from '@/store/readerStore';
import { TextSelection } from '@/utils/sel';
import { BookNote } from '@/types/book';

interface NoteEditorProps {
  onSave: (selction: TextSelection, note: string) => void;
  onEdit: (annotation: BookNote) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ onSave, onEdit }) => {
  const { notebookNewAnnotation, notebookEditAnnotation } = useReaderStore();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [note, setNote] = React.useState('');

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (notebookEditAnnotation) {
      setNote(notebookEditAnnotation.note);
    }
  }, [notebookEditAnnotation]);

  const adjustHeight = () => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    setNote(e.currentTarget.value);
  };

  const handleSaveNote = () => {
    if (editorRef.current && notebookNewAnnotation) {
      onSave(notebookNewAnnotation, editorRef.current.value);
    } else if (editorRef.current && notebookEditAnnotation) {
      notebookEditAnnotation.note = editorRef.current.value;
      onEdit(notebookEditAnnotation);
    }
  };

  return (
    <div className='note-editor-container mt-2 rounded-md bg-white p-2'>
      <div className='flex w-full justify-between space-x-2'>
        <div className='settings-content relative w-full'>
          <textarea
            className={clsx(
              'note-editor textarea textarea-ghost min-h-[1em] resize-none !outline-none',
              'inset-0 w-full rounded-none border-0 bg-transparent p-0 leading-normal',
              'text-base',
            )}
            ref={editorRef}
            value={note}
            rows={1}
            spellCheck={false}
            onChange={handleChange}
            onKeyDown={handleInput}
            placeholder='Add your notes here...'
          ></textarea>
        </div>
        <button
          className={clsx(
            'btn btn-ghost settings-content hover:bg-transparent',
            'flex h-[1.5em] min-h-[1.5em] items-end p-0',
            editorRef.current && editorRef.current.value ? '' : 'btn-disabled !bg-opacity-0',
          )}
          onClick={handleSaveNote}
        >
          <div className='align-bottom text-blue-400'>Save</div>
        </button>
      </div>
      <div className='flex items-start pt-2'>
        <div className='mr-2 min-h-full self-stretch border-l-2 border-gray-300'></div>
        <div className='note-citation settings-content line-clamp-3 text-sm'>
          {notebookNewAnnotation?.text || notebookEditAnnotation?.text}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;