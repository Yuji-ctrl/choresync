import { Chore } from '../types';

// 今日の日付を取得
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// 今日のタスクを取得（期限が今日のタスクや日常的なタスク）
export const getTodayChores = (chores: Chore[]) => {
  const today = getTodayString();
  return chores.filter(chore => {
    // 期限が今日のタスク
    if (chore.dueDate) {
      const choreDate = new Date(chore.dueDate).toISOString().split('T')[0];
      return choreDate === today;
    }
    // 期限がないタスクは日常タスクとして今日のタスクに含める
    return true;
  });
};

// 完了から3時間経過したタスクを除外
export const filterCompletedTasks = (choreList: Chore[]) => {
  const now = new Date();
  const threeHoursInMs = 3 * 60 * 60 * 1000; // 3時間をミリ秒で表現
  
  return choreList.filter(chore => {
    if (chore.isCompleted && chore.completedAt) {
      const completedTime = new Date(chore.completedAt);
      const timeSinceCompletion = now.getTime() - completedTime.getTime();
      return timeSinceCompletion < threeHoursInMs;
    }
    return true; // 未完了のタスクは表示
  });
};

// 期限状況を判定する関数
const isPastDue = (chore: Chore) => {
  if (chore.isCompleted || !chore.dueDate) return false;
  const now = new Date();
  return now > chore.dueDate;
};

const isOverdue = (chore: Chore) => {
  if (chore.isCompleted) return false;
  const now = new Date();
  const [hours, minutes] = chore.notificationTime.split(':').map(Number);
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);
  return now > notificationTime;
};

const isDueSoon = (chore: Chore) => {
  if (chore.isCompleted || !chore.dueDate || !chore.reminderHours) return false;
  const now = new Date();
  const reminderTime = new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000));
  return now >= reminderTime && now < chore.dueDate;
};

// 緊急度を判定する関数（赤、白、緑の順でソート用）
const getUrgencyLevel = (chore: Chore) => {
  if (chore.isCompleted) return 3; // 緑（完了済み）
  if (isPastDue(chore) || isOverdue(chore)) return 1; // 赤（緊急）
  if (isDueSoon(chore)) return 2; // 黄色（期限間近）は白扱い
  return 2; // 白（通常）
};

// 時間文字列を数値に変換する関数
const timeToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// ホーム画面表示用のタスクを取得（完了から3時間以内、最大9個、緊急度順→時間順）
export const getDisplayedChores = (chores: Chore[]) => {
  const filteredChores = filterCompletedTasks(chores);
  return filteredChores
    .filter(chore => chore.position)
    .sort((a, b) => {
      const urgencyA = getUrgencyLevel(a);
      const urgencyB = getUrgencyLevel(b);
      
      // 緊急度が同じ場合は時間が早い順でソート
      if (urgencyA === urgencyB) {
        const timeA = timeToMinutes(a.notificationTime);
        const timeB = timeToMinutes(b.notificationTime);
        return timeA - timeB;
      }
      
      // 緊急度でソート（1=赤, 2=白, 3=緑の順）
      return urgencyA - urgencyB;
    })
    .slice(0, 9);
};

// 現在のユーザーの今日のタスク数を計算
export const getCurrentUserTodayStats = (chores: Chore[], currentUserId: string) => {
  const todayChores = getTodayChores(chores);
  const userChores = todayChores.filter(chore => 
    !chore.assignedTo || chore.assignedTo === currentUserId
  );
  const completedCount = userChores.filter(chore => chore.isCompleted).length;
  return { completed: completedCount, total: userChores.length };
};

// 家族全員の今日のタスク数を計算
export const getFamilyTodayStats = (chores: Chore[]) => {
  const todayChores = getTodayChores(chores);
  const completedCount = todayChores.filter(chore => chore.isCompleted).length;
  return { completed: completedCount, total: todayChores.length };
};