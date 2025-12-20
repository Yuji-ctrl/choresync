import { useState, useCallback } from 'react';
import { Chore } from '../types';
import { callAPI } from '../utils/api';
import { toast } from 'sonner';
import { getAvailableWindow } from '../utils/windowPositions';

export const useChores = (initialChores: Chore[]) => {
  const [chores, setChores] = useState<Chore[]>(initialChores);
  const [completionChore, setCompletionChore] = useState<Chore | null>(null);

  const handleCompleteChore = useCallback((id: string) => {
    const chore = chores.find(c => c.id === id);
    if (chore) {
      setCompletionChore(chore);
    }
  }, [chores]);

  const handleChoreCompletion = useCallback((
    choreId: string,
    completedBy: string,
    completedByName: string,
    timeSpent: number
  ) => {
    setChores(prev => prev.map(chore => 
      chore.id === choreId 
        ? { 
            ...chore, 
            isCompleted: true, 
            completedAt: new Date(),
            completedBy,
            completedByName,
            timeSpent
          }
        : chore
    ));
    
    const chore = chores.find(c => c.id === choreId);
    if (chore) {
      toast(`${chore.icon} ${chore.name}が完了しました！`, {
        description: `担当: ${completedByName} (${timeSpent}分)`,
        duration: 3000,
      });
    }
  }, [chores]);

  const handleSaveChore = useCallback((choreData: Partial<Chore>, editingChore?: Chore | null) => {
    console.log('handleSaveChore called:', { choreData, editingChore });
    
    if (editingChore && editingChore.id) {
      // 既存の家事を編集
      console.log('Updating existing chore:', editingChore.id);
      setChores(prev => prev.map(chore => 
        chore.id === editingChore.id 
          ? { ...chore, ...choreData }
          : chore
      ));
      toast(`${choreData.icon} ${choreData.name}を更新しました`, {
        duration: 3000,
      });
    } else {
      // 新しい家事を追加
      console.log('Adding new chore');
      const availableWindow = getAvailableWindow(chores);
      const newChore: Chore = {
        ...choreData as Chore,
        id: Date.now().toString(),
        position: availableWindow || undefined, // 利用可能な窓位置を割り当て
      };
      setChores(prev => [newChore, ...prev]);
      
      toast(`タスクに${choreData.name}を追加しました`, {
        description: 'OK',
        duration: 4000,
      });
    }
  }, [chores]);

  const handleDeleteChore = useCallback(async (choreId: string) => {
    try {
      await callAPI(`/chores/${choreId}`, { method: 'DELETE' });
      setChores(prev => prev.filter(chore => chore.id !== choreId));
      toast('家事を削除しました');
    } catch (error) {
      console.error('Error deleting chore:', error);
      toast('削除に失敗しました');
    }
  }, []);

  const handleToggleChore = useCallback((choreId: string, currentUserId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (!chore) return;

    if (!chore.isCompleted) {
      setCompletionChore(chore);
    } else {
      setChores(prev => prev.map(c => 
        c.id === choreId 
          ? { 
              ...c, 
              isCompleted: false,
              completedAt: undefined,
              completedBy: undefined,
              completedByName: undefined,
              timeSpent: undefined
            }
          : c
      ));
    }
  }, [chores]);

  const handleResetDay = useCallback(() => {
    setChores(prev => prev.map(chore => ({
      ...chore,
      isCompleted: false,
      completedAt: undefined,
      completedBy: undefined,
      completedByName: undefined,
      timeSpent: undefined,
    })));
    
    toast('すべての家事がリセットされました', {
      description: '新しい一日を始めましょう！',
      duration: 3000,
    });
  }, []);

  return {
    chores,
    setChores,
    completionChore,
    setCompletionChore,
    handleCompleteChore,
    handleChoreCompletion,
    handleSaveChore,
    handleDeleteChore,
    handleToggleChore,
    handleResetDay,
  };
};