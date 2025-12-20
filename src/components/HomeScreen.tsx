import React from 'react';
import { Button } from './ui/button';
import { Plus, Settings, RotateCcw } from 'lucide-react';
import { HomeLayoutGrid } from './HomeLayoutGrid';
import { StatsHeader } from './StatsHeader';
import { Chore } from '../types';

interface HomeScreenProps {
  currentUserName: string;
  getCurrentUserTodayStats: () => { completed: number; total: number };
  getFamilyTodayStats: () => { completed: number; total: number };
  getDisplayedChores: () => Chore[];
  handleResetDayWithNotifications: () => void;
  setEditingChore: (chore: Chore | null) => void;
  setActiveTab: (tab: string) => void;
  handleCompleteChore: (choreId: string) => void;
  handleEditChore: (chore: any) => void;
  handleTakePhoto: (chore: Chore) => void;
}

export function HomeScreen({
  currentUserName,
  getCurrentUserTodayStats,
  getFamilyTodayStats,
  getDisplayedChores,
  handleResetDayWithNotifications,
  setEditingChore,
  setActiveTab,
  handleCompleteChore,
  handleEditChore,
  handleTakePhoto,
}: HomeScreenProps) {
  const currentUserStats = getCurrentUserTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      {/* ヘッダー */}
      <div className="bg-orange-100 shadow-sm border-b border-orange-200 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">おうち家事</h1>
            <StatsHeader
              currentUserName={currentUserName}
              getCurrentUserTodayStats={getCurrentUserTodayStats}
              getFamilyTodayStats={getFamilyTodayStats}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleResetDayWithNotifications}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => setEditingChore(null)}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActiveTab('settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative max-w-md mx-auto" style={{ height: 'calc(100vh - 180px)' }}>
        <HomeLayoutGrid
          chores={getDisplayedChores()}
          onComplete={handleCompleteChore}
          onEdit={handleEditChore}
          onTakePhoto={handleTakePhoto}
        />
      </div>

      {/* 進捗バー */}
      <div className="fixed bottom-16 left-0 right-0 bg-orange-100 border-t border-orange-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">今日の進捗</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {currentUserStats.completed}/{currentUserStats.total}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {currentUserStats.total > 0 ? Math.round((currentUserStats.completed / currentUserStats.total) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${currentUserStats.total > 0 ? (currentUserStats.completed / currentUserStats.total) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}