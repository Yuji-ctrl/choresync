import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Upload } from 'lucide-react';
import { Chore } from '../types';

interface ChoreSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chore: Partial<Chore>) => void;
  editingChore?: Chore | null;
}

const choreIcons = [
  { icon: '🍳', name: 'キッチン' },
  { icon: '🌱', name: '水やり' },
  { icon: '🧹', name: '掃除' },
  { icon: '👕', name: '洗濯' },
  { icon: '🗑️', name: 'ゴミ出し' },
  { icon: '🛏️', name: 'ベッド' },
  { icon: '🚿', name: 'お風呂' },
  { icon: '📺', name: 'リビング' },
  { icon: '🪟', name: '窓拭き' },
  { icon: '🧽', name: '食器洗い' },
  { icon: '🍚', name: '炊飯器' },
  { icon: '❄️', name: '冷蔵庫' },
  { icon: '🐕', name: '犬の世話' },
  { icon: '🐈', name: '猫の世話' },
];

const familyMembers = [
  { id: '1', name: 'お母さん' },
  { id: '2', name: 'お父さん' },
  { id: '3', name: '太郎' },
];

const locationOptions = [
  'キッチン',
  'リビング',
  'ベッドルーム',
  'バスルーム',
  '洗面所',
  'トイレ',
  '玄関',
  'ベランダ',
  '庭',
  '近所',
  '2階',
  '1階',
  '洗濯機周り',
];

export function ChoreSetupDialog({ isOpen, onClose, onSave, editingChore }: ChoreSetupDialogProps) {
  const [name, setName] = useState(editingChore?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(editingChore?.icon || '🍳');
  const [customIconUrl, setCustomIconUrl] = useState(editingChore?.customIconUrl || '');
  const [notificationTime, setNotificationTime] = useState(editingChore?.notificationTime || '08:00');
  const [assignedTo, setAssignedTo] = useState(editingChore?.assignedTo || '');
  const [location, setLocation] = useState(editingChore?.location || '');
  const [dueDate, setDueDate] = useState(
    editingChore?.dueDate ? editingChore.dueDate.toISOString().split('T')[0] : ''
  );
  const [dueTime, setDueTime] = useState(
    editingChore?.dueDate ? editingChore.dueDate.toTimeString().slice(0, 5) : ''
  );
  const [reminderHours, setReminderHours] = useState(editingChore?.reminderHours?.toString() || '2');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCustomIconUrl(imageUrl);
        setSelectedIcon('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      const assignedMember = familyMembers.find(m => m.id === assignedTo);
      
      // 期限の日時を組み合わせ
      let dueDateObj: Date | undefined;
      if (dueDate && dueTime) {
        dueDateObj = new Date(`${dueDate}T${dueTime}`);
      } else if (dueDate) {
        dueDateObj = new Date(`${dueDate}T23:59`);
      }
      
      onSave({
        id: editingChore?.id || Date.now().toString(),
        name: name.trim(),
        icon: selectedIcon,
        customIconUrl: selectedIcon === 'custom' ? customIconUrl : undefined,
        notificationTime,
        assignedTo,
        assignedToName: assignedMember?.name,
        location,
        dueDate: dueDateObj,
        reminderHours: reminderHours ? parseInt(reminderHours) : undefined,
        position: editingChore?.position || { x: 50, y: 50 },
        isCompleted: editingChore?.isCompleted || false,
      });
      if (!editingChore) {
        setName('');
        setSelectedIcon('🍳');
        setCustomIconUrl('');
        setNotificationTime('08:00');
        setAssignedTo('');
        setLocation('');
        setDueDate('');
        setDueTime('');
        setReminderHours('2');
      }
      onClose();
    }
  };

  const handleClose = () => {
    if (!editingChore) {
      setName('');
      setSelectedIcon('🍳');
      setCustomIconUrl('');
      setNotificationTime('08:00');
      setLocation('');
      setDueDate('');
      setDueTime('');
      setReminderHours('2');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            タスクの設定
          </DialogTitle>
          <DialogDescription>
            新しいタスクを作成または既存のタスクを編集します
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="choreName">家事の名前</Label>
            <Input
              id="choreName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 炊飯器のお米を炊く"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>アイコンを選択</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {choreIcons.map((item) => (
                <button
                  key={item.icon}
                  className={`
                    p-2 rounded-lg border-2 transition-colors
                    ${selectedIcon === item.icon 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSelectedIcon(item.icon)}
                >
                  <span className="text-xl">{item.icon}</span>
                </button>
              ))}
              
              {/* カスタムアイコン表示 */}
              {customIconUrl && (
                <button
                  className={`
                    p-1 rounded-lg border-2 transition-colors
                    ${selectedIcon === 'custom' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSelectedIcon('custom')}
                >
                  <img 
                    src={customIconUrl} 
                    alt="カスタムアイコン" 
                    className="w-6 h-6 object-cover rounded"
                  />
                </button>
              )}
              
              {/* アップロードボタン */}
              <button
                className="p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700">基本情報</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <Label className="text-sm text-gray-600">担当者</Label>
                <div className="flex gap-2 mt-1">
                  <button
                    className={`
                      p-2 rounded-lg border-2 transition-colors flex-1 text-sm
                      ${!assignedTo 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setAssignedTo('')}
                  >
                    未設定
                  </button>
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      className={`
                        p-2 rounded-lg border-2 transition-colors flex-1 text-sm
                        ${assignedTo === member.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => setAssignedTo(member.id)}
                    >
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">場所</Label>
                <Select value={location || "unset"} onValueChange={(value) => setLocation(value === "unset" ? "" : value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="場所を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unset">未設定</SelectItem>
                    {locationOptions.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notificationTime">通知時間</Label>
            <Input
              id="notificationTime"
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700">期限設定</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="dueDate" className="text-sm text-gray-600">期限日</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueTime" className="text-sm text-gray-600">時刻</Label>
                  <Input
                    id="dueTime"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="mt-1"
                    disabled={!dueDate}
                  />
                </div>
              </div>
              
              {dueDate && (
                <div>
                  <Label htmlFor="reminderHours" className="text-sm text-gray-600">
                    事前通知（何時間前）
                  </Label>
                  <Select value={reminderHours} onValueChange={setReminderHours}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1時間前</SelectItem>
                      <SelectItem value="2">2時間前</SelectItem>
                      <SelectItem value="3">3時間前</SelectItem>
                      <SelectItem value="6">6時間前</SelectItem>
                      <SelectItem value="12">12時間前</SelectItem>
                      <SelectItem value="24">24時間前（1日前）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              キャンセル
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingChore ? '更新' : '追加'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}