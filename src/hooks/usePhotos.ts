import { useState, useCallback } from 'react';
import { ChorePhoto, Chore } from '../types';
import { callAPI } from '../utils/api';
// Supabaseの使用を停止
// import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

export const usePhotos = (initialPhotos: ChorePhoto[]) => {
  const [photos, setPhotos] = useState<ChorePhoto[]>(initialPhotos);
  const [photoCaptureChore, setPhotoCaptureChore] = useState<Chore | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<ChorePhoto | null>(null);
  const [sharePhoto, setSharePhoto] = useState<ChorePhoto | null>(null);

  const handleTakePhoto = useCallback((chore: Chore) => {
    setPhotoCaptureChore(chore);
  }, []);

  const handleSavePhoto = useCallback(async (
    choreId: string, 
    imageFiles: File[], 
    comment: string,
    userId: string = '2', // デフォルトは「お父さん」
    userName: string = 'お父さん'
  ) => {
    try {
      // ローカルデータベースを使用（Fileオブジェクトを直接渡す）
      const { photo } = await callAPI('/photos/upload', {
        method: 'POST',
        body: {
          files: imageFiles,
          choreId,
          comment,
          userId,
          userName,
        } as any,
      });
      
      setPhotos(prev => [photo, ...prev]);
      toast(`写真を${imageFiles.length}枚保存しました！`);
    } catch (error) {
      console.error('Error saving photos:', error);
      toast('写真の保存に失敗しました');
    }
  }, []);

  const handleUpdatePhotoComment = useCallback(async (photoId: string, comment: string) => {
    try {
      const { photo } = await callAPI(`/photos/${photoId}/comment`, {
        method: 'PUT',
        body: JSON.stringify({ comment }),
      });
      
      setPhotos(prev => prev.map(p => p.id === photoId ? photo : p));
      toast('コメントを更新しました');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast('更新に失敗しました');
    }
  }, []);

  const handleSharePhoto = useCallback((photo: ChorePhoto) => {
    setSharePhoto(photo);
  }, []);

  return {
    photos,
    setPhotos,
    photoCaptureChore,
    setPhotoCaptureChore,
    selectedPhoto,
    setSelectedPhoto,
    sharePhoto,
    setSharePhoto,
    handleTakePhoto,
    handleSavePhoto,
    handleUpdatePhotoComment,
    handleSharePhoto,
  };
};