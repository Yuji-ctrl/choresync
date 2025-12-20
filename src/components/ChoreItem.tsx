import React from 'react';
import { Button } from './ui/button';
import { Check, Clock, Camera, AlertCircle } from 'lucide-react';

// 名前から適切なアバター文字を取得する関数（MessagesScreenと同じロジック）
const getAvatarInitials = (name: string, allNames: string[] = []) => {
  if (!name) return '';
  
  // 1文字目を取得
  const firstChar = name[0];
  
  // 同じ1文字目を持つ他の名前があるかチェック
  const conflictingNames = allNames.filter(n => n !== name && n[0] === firstChar);
  
  if (conflictingNames.length === 0) {
    // 競合がない場合は1文字目を返す
    return firstChar;
  } else {
    // 競合がある場合は2文字目も含める（2文字目がない場合は1文字目のみ）
    return name.length > 1 ? firstChar + name[1] : firstChar;
  }
};

import { Chore } from '../types';

interface ChoreItemProps {
  chore: Chore;
  onComplete: (id: string) => void;
  onEdit: (chore: Chore) => void;
  onTakePhoto: (chore: Chore) => void;
  isUnified?: boolean;
}

export function ChoreItem({ chore, onComplete, onEdit, onTakePhoto, isUnified = false }: ChoreItemProps) {
  const isOverdue = () => {
    if (chore.isCompleted) return false;
    const now = new Date();
    const [hours, minutes] = chore.notificationTime.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    return now > notificationTime;
  };

  const isDueSoon = () => {
    if (chore.isCompleted || !chore.dueDate || !chore.reminderHours) return false;
    const now = new Date();
    const reminderTime = new Date(chore.dueDate.getTime() - (chore.reminderHours * 60 * 60 * 1000));
    return now >= reminderTime && now < chore.dueDate;
  };

  const isPastDue = () => {
    if (chore.isCompleted || !chore.dueDate) return false;
    const now = new Date();
    return now > chore.dueDate;
  };

  const formatDueDate = () => {
    if (!chore.dueDate) return null;
    const now = new Date();
    const diffTime = chore.dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    if (diffDays < 0) return `${Math.abs(diffDays)}日過ぎ`;
    if (diffDays <= 7) return `${diffDays}日後`;
    return chore.dueDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={isUnified ? "w-full h-full" : "absolute transform -translate-x-1/2 -translate-y-1/2"}
      style={!isUnified ? { left: `${chore.position?.x}%`, top: `${chore.position?.y}%` } : {}}
    >
      <div
        className={`
          relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300
          ${chore.isCompleted 
            ? 'bg-green-100 border-2 border-green-300' 
            : isPastDue()
              ? 'bg-red-100 border-2 border-red-300 animate-pulse'
            : isDueSoon()
              ? 'bg-yellow-100 border-2 border-yellow-300'
            : isOverdue() 
              ? 'bg-red-100 border-2 border-red-300 animate-pulse' 
              : 'bg-white border-2 border-gray-200 shadow-lg'
          }
        `}
        onClick={() => onEdit(chore)}
      >
        <div className="relative">
          {chore.customIconUrl ? (
            <img 
              src={chore.customIconUrl} 
              alt={chore.name}
              className="w-8 h-8 object-cover rounded-lg mb-1"
            />
          ) : (
            <span className="text-2xl mb-1">{chore.icon}</span>
          )}
          {chore.isCompleted && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {isPastDue() && !chore.isCompleted && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
          {isDueSoon() && !chore.isCompleted && !isPastDue() && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
              <Clock className="w-3 h-3 text-white" />
            </div>
          )}
          {isOverdue() && !chore.isCompleted && !isPastDue() && !isDueSoon() && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
              <Clock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <span className="text-xs text-center whitespace-nowrap max-w-16 truncate">
          {chore.name}
        </span>
        <span className="text-xs text-gray-500">{chore.notificationTime}</span>
        
        {/* 期限表示 */}
        {chore.dueDate && (
          <span className={`text-xs font-medium ${isPastDue() ? 'text-red-600' : isDueSoon() ? 'text-yellow-600' : 'text-gray-600'}`}>
            期限: {formatDueDate()}
          </span>
        )}
        
        {/* 担当者表示 */}
        {chore.assignedToName && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-xs font-medium">
              {getAvatarInitials(chore.assignedToName, ['お父さん', 'お母さん', '太郎'])}
            </span>
          </div>
        )}
        
        <div className="flex gap-1 mt-2">
          {!chore.isCompleted && (
            <Button
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(chore.id);
              }}
            >
              完了
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onTakePhoto(chore);
            }}
          >
            <Camera className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}