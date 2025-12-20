import { useState, useEffect, useCallback } from 'react';
import { Chore } from '../types';
import { toast } from 'sonner';

export const useNotifications = (chores: Chore[], onCompleteChore: (id: string) => void) => {
  const [notifiedDelayedChores, setNotifiedDelayedChores] = useState<Set<string>>(new Set());
  const [notifiedDueChores, setNotifiedDueChores] = useState<Set<string>>(new Set());

  const clearDelayedNotification = useCallback((choreId: string) => {
    setNotifiedDelayedChores(prev => {
      const newSet = new Set(prev);
      newSet.delete(choreId);
      return newSet;
    });
    setNotifiedDueChores(prev => {
      const newSet = new Set(prev);
      newSet.delete(choreId);
      return newSet;
    });
  }, []);

  const resetNotifications = useCallback(() => {
    setNotifiedDelayedChores(new Set());
    setNotifiedDueChores(new Set());
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      chores.forEach(chore => {
        if (!chore.isCompleted) {
          // 通常の時間通知
          if (chore.notificationTime && chore.notificationTime === currentTime) {
            const iconDisplay = chore.customIconUrl ? '📋' : chore.icon;
            toast(`${iconDisplay} ${chore.name}の時間です！`, {
              description: '家事を完了したらチェックしてください',
              duration: 5000,
            });
          }
          
          // 期限前通知のチェック
          if (chore.dueDate && chore.reminderHours && !notifiedDueChores.has(chore.id)) {
            const reminderTime = new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000));
            
            if (now >= reminderTime && now < chore.dueDate) {
              const iconDisplay = chore.customIconUrl ? '📋' : chore.icon;
              const timeLeft = Math.ceil((chore.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
              
              toast(`⏰ ${iconDisplay} ${chore.name}の期限が近づいています`, {
                description: `あと${timeLeft}時間で期限です（${chore.dueDate.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}）`,
                duration: 8000,
                action: {
                  label: '今すぐ完了',
                  onClick: () => onCompleteChore(chore.id),
                },
              });
              
              setNotifiedDueChores(prev => new Set(prev).add(chore.id));
            }
          }
          
          // 期限切れ通知
          if (chore.dueDate && now > chore.dueDate && !notifiedDueChores.has(`${chore.id}-overdue`)) {
            const iconDisplay = chore.customIconUrl ? '📋' : chore.icon;
            const hoursOver = Math.floor((now.getTime() - chore.dueDate.getTime()) / (1000 * 60 * 60));
            
            toast(`🚨 ${iconDisplay} ${chore.name}が期限切れです`, {
              description: `期限から${hoursOver}時間が経過しました`,
              duration: 10000,
              action: {
                label: '完了する',
                onClick: () => onCompleteChore(chore.id),
              },
            });
            
            setNotifiedDueChores(prev => new Set(prev).add(`${chore.id}-overdue`));
          }
          
          // 遅延通知のチェック（設定時間から30分経過）
          if (chore.notificationTime) {
            const [scheduleHour, scheduleMinute] = chore.notificationTime.split(':').map(Number);
            const scheduledTime = new Date();
            scheduledTime.setHours(scheduleHour, scheduleMinute, 0, 0);
            
            // 30分後の時間を計算
            const delayedTime = new Date(scheduledTime.getTime() + 30 * 60 * 1000);
            
            // 現在時刻が遅延時間を過ぎていて、まだ通知していない場合
            if (now >= delayedTime && !notifiedDelayedChores.has(chore.id)) {
              const iconDisplay = chore.customIconUrl ? '📋' : chore.icon;
              toast(`⚠️ ${iconDisplay} ${chore.name}が未完了です`, {
                description: `予定時刻（${chore.notificationTime}）から30分が経過しました`,
                duration: 8000,
                action: {
                  label: '完了する',
                  onClick: () => onCompleteChore(chore.id),
                },
              });
              
              // 通知済みとしてマーク
              setNotifiedDelayedChores(prev => new Set(prev).add(chore.id));
            }
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // 1分ごとにチェック
    return () => clearInterval(interval);
  }, [chores, notifiedDelayedChores, notifiedDueChores, onCompleteChore]);

  return {
    notifiedDelayedChores,
    notifiedDueChores,
    clearDelayedNotification,
    resetNotifications,
  };
};