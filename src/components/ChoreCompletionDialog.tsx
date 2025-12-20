import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, User } from 'lucide-react';
import { Chore } from './ChoreItem';
import { FamilyMember } from './MessagesScreen';

interface ChoreCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chore: Chore | null;
  familyMembers: FamilyMember[];
  currentUserId?: string;
  onComplete: (choreId: string, completedBy: string, completedByName: string, timeSpent: number) => void;
}

export function ChoreCompletionDialog({ 
  isOpen, 
  onClose, 
  chore, 
  familyMembers,
  currentUserId,
  onComplete 
}: ChoreCompletionDialogProps) {
  const [timeSpent, setTimeSpent] = useState<string>('');
  
  // 現在のユーザー情報を取得
  const currentUser = familyMembers.find(m => m.id === currentUserId);
  const currentUserName = currentUser?.name || '';

  const handleComplete = () => {
    if (!chore || !currentUserId || !currentUserName || !timeSpent) return;

    onComplete(chore.id, currentUserId, currentUserName, parseInt(timeSpent));
    
    // リセット
    setTimeSpent('');
    onClose();
  };

  const handleClose = () => {
    setTimeSpent('');
    onClose();
  };

  if (!chore) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{chore.icon}</span>
            {chore.name}を完了
          </DialogTitle>
          <DialogDescription>
            タスクの完了記録を登録します
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* 担当者表示（固定） */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              担当者
            </Label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{currentUserName}</span>
              <span className="text-sm text-gray-500 ml-auto">（ログイン中）</span>
            </div>
          </div>

          {/* 所要時間入力 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              所要時間（分）
            </Label>
            <Input
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder={`予想時間: ${chore.estimatedTime || 15}分`}
              min="1"
              max="180"
            />
            <div className="text-xs text-gray-500">
              実際にかかった時間を入力してください
            </div>
          </div>

          {/* 予想時間のヒント */}
          {chore.estimatedTime && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                <span>予想時間: {chore.estimatedTime}分</span>
              </div>
              <div className="text-blue-600 mt-1">
                参考にして実際の時間を入力してください
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              キャンセル
            </Button>
            <Button 
              onClick={handleComplete} 
              className="flex-1"
              disabled={!timeSpent}
            >
              完了
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}