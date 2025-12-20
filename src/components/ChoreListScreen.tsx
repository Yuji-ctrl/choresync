import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Clock, MapPin, Edit, Trash2, Check, Calendar, AlertCircle, User } from 'lucide-react';
import { StatsHeader } from './StatsHeader';
import { Chore } from './ChoreItem';

interface ChoreListScreenProps {
  chores: Chore[];
  currentUserName: string;
  getCurrentUserTodayStats: () => { completed: number; total: number };
  getFamilyTodayStats: () => { completed: number; total: number };
  onAddChore: () => void;
  onEditChore: (chore: Chore) => void;
  onDeleteChore: (choreId: string) => void;
  onToggleChore: (choreId: string) => void;
}

export function ChoreListScreen({ 
  chores,
  currentUserName,
  getCurrentUserTodayStats,
  getFamilyTodayStats,
  onAddChore, 
  onEditChore, 
  onDeleteChore, 
  onToggleChore 
}: ChoreListScreenProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'status' | 'newest'>('newest');

  const filteredChores = chores.filter(chore => {
    switch (filter) {
      case 'completed':
        return chore.isCompleted;
      case 'pending':
        return !chore.isCompleted;
      default:
        return true;
    }
  });

  const sortedChores = [...filteredChores].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return Number(a.isCompleted) - Number(b.isCompleted);
      case 'time':
        return a.notificationTime.localeCompare(b.notificationTime);
      case 'newest':
      default:
        // IDが大きいほど新しいので降順ソート
        return parseInt(b.id) - parseInt(a.id);
    }
  });



  const getStatusColor = (chore: Chore) => {
    if (chore.isCompleted) return 'bg-green-100 text-green-800 border-green-200';
    
    const now = new Date();
    
    // 期限切れチェック
    if (chore.dueDate && now > chore.dueDate) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    // 期限が近い（リマインダー時間内）
    if (chore.dueDate && chore.reminderHours) {
      const reminderTime = new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000));
      if (now >= reminderTime) {
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
    }
    
    // 通常の通知時間を過ぎている
    const [hours, minutes] = chore.notificationTime.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    
    if (now > notificationTime) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusText = (chore: Chore) => {
    if (chore.isCompleted) return '完了';
    
    const now = new Date();
    
    // 期限切れチェック
    if (chore.dueDate && now > chore.dueDate) {
      return '期限切れ';
    }
    
    // 期限が近い（リマインダー時間内）
    if (chore.dueDate && chore.reminderHours) {
      const reminderTime = new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000));
      if (now >= reminderTime) {
        return '期限間近';
      }
    }
    
    // 通常の通知時間を過ぎている
    const [hours, minutes] = chore.notificationTime.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    
    if (now > notificationTime) {
      return '時間超過';
    }
    
    return '待機中';
  };

  const formatDueDate = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    if (diffDays < 0) return `${Math.abs(diffDays)}日過ぎ`;
    if (diffDays <= 7) return `${diffDays}日後`;
    return dueDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">タスクの設定</h1>
            <StatsHeader
              currentUserName={currentUserName}
              getCurrentUserTodayStats={getCurrentUserTodayStats}
              getFamilyTodayStats={getFamilyTodayStats}
            />
          </div>
          <Button onClick={onAddChore}>
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </div>

        {/* フィルターとソート */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              すべて
            </Button>
            <Button
              size="sm"
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              未完了
            </Button>
            <Button
              size="sm"
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              完了済み
            </Button>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            onClick={() => setSortBy('newest')}
          >
            追加順
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'time' ? 'default' : 'outline'}
            onClick={() => setSortBy('time')}
          >
            時間順
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'name' ? 'default' : 'outline'}
            onClick={() => setSortBy('name')}
          >
            名前順
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'status' ? 'default' : 'outline'}
            onClick={() => setSortBy('status')}
          >
            状態順
          </Button>
        </div>
      </div>

      {/* 家事リスト */}
      <div className="p-4 pb-20 space-y-3">
        {sortedChores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">📝</div>
            <p className="text-gray-600">家事がありません</p>
            <p className="text-sm text-gray-500">新しい家事を追加してみましょう</p>
          </div>
        ) : (
          sortedChores.map((chore) => (
            <Card key={chore.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {chore.customIconUrl ? (
                      <img 
                        src={chore.customIconUrl} 
                        alt={chore.name}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">{chore.icon}</span>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{chore.name}</h3>
                      {chore.description && (
                        <p className="text-sm text-gray-600 mt-1">{chore.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(chore)} border`}>
                    {getStatusText(chore)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {chore.notificationTime}
                  </div>
                  {chore.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {chore.location}
                    </div>
                  )}
                  {chore.assignedToName && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-blue-600">
                        {chore.assignedToName}
                      </span>
                    </div>
                  )}
                  {chore.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className={`font-medium ${
                        new Date() > chore.dueDate ? 'text-red-600' : 
                        chore.reminderHours && new Date() >= new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000)) ? 'text-yellow-600' : 
                        'text-gray-600'
                      }`}>
                        {formatDueDate(chore.dueDate)}
                      </span>
                    </div>
                  )}
                </div>

                {chore.completedAt && (
                  <p className="text-sm text-green-600 mb-3">
                    完了日時: {new Date(chore.completedAt).toLocaleString('ja-JP')}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={chore.isCompleted ? "outline" : "default"}
                    onClick={() => onToggleChore(chore.id)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {chore.isCompleted ? '未完了に戻す' : '完了'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditChore(chore)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteChore(chore.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}