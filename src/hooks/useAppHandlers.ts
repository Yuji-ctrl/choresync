import { useCallback } from 'react';
import { Chore, ChorePhoto, AppSettings } from '../types';
import { 
  getDisplayedChores, 
  getCurrentUserTodayStats, 
  getFamilyTodayStats 
} from '../utils/statsUtils';

interface UseAppHandlersProps {
  chores: Chore[];
  photos: ChorePhoto[];
  currentUserId: string;
  currentUserName: string;
  setChores: (chores: Chore[]) => void;
  handleChoreCompletion: (
    choreId: string,
    completedBy: string,
    completedByName: string,
    timeSpent: number
  ) => void;
  handleCompleteChore: (choreId: string) => void;
  handleResetDay: () => void;
  handleSavePhoto: (
    choreId: string,
    imageFiles: File[],
    comment: string,
    currentUserId: string,
    currentUserName: string
  ) => Promise<void>;
  handleSendMessage: (
    text: string,
    currentUserId: string,
    currentUserName: string,
    imageFile?: File
  ) => void;
  handleExportData: (chores: Chore[], photos: ChorePhoto[]) => void;
  handleClearData: (initialChores: Chore[]) => void;
  handleToggleChore: (choreId: string, currentUserId: string) => void;
  clearDelayedNotification: (choreId: string) => void;
  resetNotifications: () => void;
  initialChores: Chore[];
}

export function useAppHandlers({
  chores,
  photos,
  currentUserId,
  currentUserName,
  setChores,
  handleChoreCompletion,
  handleCompleteChore,
  handleResetDay,
  handleSavePhoto,
  handleSendMessage,
  handleExportData,
  handleClearData,
  handleToggleChore,
  clearDelayedNotification,
  resetNotifications,
  initialChores,
}: UseAppHandlersProps) {
  
  // ハンドラー関数の拡張
  const handleChoreCompletionWithNotification = useCallback((
    choreId: string,
    completedBy: string,
    completedByName: string,
    timeSpent: number
  ) => {
    handleChoreCompletion(choreId, completedBy, completedByName, timeSpent);
    clearDelayedNotification(choreId);
  }, [handleChoreCompletion, clearDelayedNotification]);

  const handleResetDayWithNotifications = useCallback(() => {
    handleResetDay();
    resetNotifications();
  }, [handleResetDay, resetNotifications]);

  const handleToggleChoreWithUserId = useCallback((choreId: string) => {
    handleToggleChore(choreId, currentUserId);
  }, [handleToggleChore, currentUserId]);

  const handleSendMessageWithUser = useCallback((text: string, imageFile?: File) => {
    handleSendMessage(text, currentUserId, currentUserName, imageFile);
  }, [handleSendMessage, currentUserId, currentUserName]);

  const handleSavePhotoWithUser = useCallback((choreId: string, imageFiles: File[], comment: string) => {
    return handleSavePhoto(choreId, imageFiles, comment, currentUserId, currentUserName);
  }, [handleSavePhoto, currentUserId, currentUserName]);

  const handleExportDataWithPhotos = useCallback(() => {
    handleExportData(chores, photos);
  }, [handleExportData, chores, photos]);

  const handleClearDataWithChores = useCallback(() => {
    handleClearData(initialChores);
    setChores(initialChores.map(chore => ({
      ...chore,
      isCompleted: false,
      completedAt: undefined,
      completedBy: undefined,
      completedByName: undefined,
      timeSpent: undefined
    })));
  }, [handleClearData, initialChores, setChores]);

  // 統計計算関数
  const getDisplayedChoresCallback = useCallback(() => {
    return getDisplayedChores(chores);
  }, [chores]);

  const getCurrentUserTodayStatsCallback = useCallback(() => {
    return getCurrentUserTodayStats(chores, currentUserId);
  }, [chores, currentUserId]);

  const getFamilyTodayStatsCallback = useCallback(() => {
    return getFamilyTodayStats(chores);
  }, [chores]);

  return {
    handleChoreCompletionWithNotification,
    handleResetDayWithNotifications,
    handleToggleChoreWithUserId,
    handleSendMessageWithUser,
    handleSavePhotoWithUser,
    handleExportDataWithPhotos,
    handleClearDataWithChores,
    getDisplayedChores: getDisplayedChoresCallback,
    getCurrentUserTodayStats: getCurrentUserTodayStatsCallback,
    getFamilyTodayStats: getFamilyTodayStatsCallback,
  };
}