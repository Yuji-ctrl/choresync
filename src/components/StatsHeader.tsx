import React from 'react';

interface StatsHeaderProps {
  currentUserName: string;
  getCurrentUserTodayStats: () => { completed: number; total: number };
  getFamilyTodayStats: () => { completed: number; total: number };
}

export function StatsHeader({
  currentUserName,
  getCurrentUserTodayStats,
  getFamilyTodayStats,
}: StatsHeaderProps) {
  const currentUserStats = getCurrentUserTodayStats();
  const familyStats = getFamilyTodayStats();

  return (
    <div>
      <p className="text-sm text-gray-600">
        {currentUserName} | 完了: {currentUserStats.completed}/{currentUserStats.total}
      </p>
      <p className="text-xs text-gray-500">
        みんな | 完了: {familyStats.completed}/{familyStats.total}
      </p>
    </div>
  );
}