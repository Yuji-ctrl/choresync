import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardHeader, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Chore } from '../types';

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
  { icon: '🧺', name: '洗濯かご' },
  { icon: '🚽', name: 'トイレ' },
  { icon: '🏠', name: '玄関' },
  { icon: '🌿', name: '庭' },
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

const familyMembers = [
  { id: '1', name: 'お母さん' },
  { id: '2', name: 'お父さん' },
  { id: '3', name: '太郎' },
];

interface ChoreDetailScreenProps {
  chore: Chore | null;
  onBack: () => void;
  onSave: (chore: Partial<Chore>) => void;
  onDelete?: (choreId: string) => void;
  isNew?: boolean;
}

export function ChoreDetailScreen({ 
  chore, 
  onBack, 
  onSave, 
  onDelete,
  isNew = false 
}: ChoreDetailScreenProps) {
  const [formData, setFormData] = useState({
    name: chore?.name || '',
    description: chore?.description || '',
    icon: chore?.icon || '🍳',
    customIconUrl: chore?.customIconUrl || '',
    notificationTime: chore?.notificationTime || '08:00',
    location: chore?.location || 'キッチン',
    assignedTo: chore?.assignedTo || '2', // デフォルトでお父さんを選択
    dueDate: chore?.dueDate ? chore.dueDate.toISOString().split('T')[0] : '',
    dueTime: chore?.dueDate ? chore.dueDate.toTimeString().slice(0, 5) : '',
    reminderHours: chore?.reminderHours?.toString() || '2',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData({ ...formData, customIconUrl: imageUrl, icon: 'custom' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '家事の名前は必須です';
    }
    
    if (!formData.notificationTime) {
      newErrors.notificationTime = '通知時間は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    console.log('ChoreDetailScreen handleSave called:', { chore, formData });
    
    if (!validateForm()) return;

    const assignedMember = familyMembers.find(m => m.id === formData.assignedTo);
    
    // 期限の日時を組み合わせ
    let dueDateObj: Date | undefined;
    if (formData.dueDate && formData.dueTime) {
      dueDateObj = new Date(`${formData.dueDate}T${formData.dueTime}`);
    } else if (formData.dueDate) {
      dueDateObj = new Date(`${formData.dueDate}T23:59`);
    }

    const choreData: Partial<Chore> = {
      ...formData,
      customIconUrl: formData.icon === 'custom' ? formData.customIconUrl : undefined,
      dueDate: dueDateObj,
      reminderHours: formData.reminderHours ? parseInt(formData.reminderHours) : undefined,
      assignedToName: assignedMember?.name,
      id: chore?.id || Date.now().toString(),
      position: chore?.position || { x: 50, y: 50 },
      isCompleted: chore?.isCompleted || false,
    };

    console.log('Calling onSave with:', choreData);
    onSave(choreData);
    onBack();
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              タスクの設定
            </h1>
            <p className="text-sm text-gray-600">詳細設定</p>
          </div>
        </div>
        
        {/* ボタン群 */}
        <div className="flex gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1"
          >
            {isNew ? '追加' : '更新'}
          </Button>
        </div>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-4 pb-20 space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <h2 className="font-medium text-gray-900">基本情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">家事の名前 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 炊飯器でお米を炊く"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="家事の詳細や注意事項を入力..."
                className="min-h-20"
              />
            </div>

            <div>
              <Label>担当者</Label>
              <div className="flex gap-2 mt-2">
                <button
                  className={`
                    p-2 rounded-lg border-2 transition-colors flex-1 text-sm
                    ${!formData.assignedTo 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setFormData({ ...formData, assignedTo: '' })}
                >
                  未設定
                </button>
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    className={`
                      p-2 rounded-lg border-2 transition-colors flex-1 text-sm
                      ${formData.assignedTo === member.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setFormData({ ...formData, assignedTo: member.id })}
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アイコン設定 */}
        <Card>
          <CardHeader>
            <h2 className="font-medium text-gray-900">アイコン</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {choreIcons.map((item) => (
                <button
                  key={item.icon}
                  className={`
                    aspect-square p-2 rounded-lg border-2 transition-colors text-lg
                    ${formData.icon === item.icon 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setFormData({ ...formData, icon: item.icon })}
                >
                  {item.icon}
                </button>
              ))}
              
              {/* カスタムアイコン表示 */}
              {formData.customIconUrl && (
                <button
                  className={`
                    aspect-square p-1 rounded-lg border-2 transition-colors
                    ${formData.icon === 'custom' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setFormData({ ...formData, icon: 'custom' })}
                >
                  <img 
                    src={formData.customIconUrl} 
                    alt="カスタムアイコン" 
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              )}
              
              {/* アップロードボタン */}
              <button
                className="aspect-square p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors flex items-center justify-center text-lg"
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
          </CardContent>
        </Card>

        {/* 時間と場所 */}
        <Card>
          <CardHeader>
            <h2 className="font-medium text-gray-900">時間と場所</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="time">通知時間 *</Label>
              <Input
                id="time"
                type="time"
                value={formData.notificationTime}
                onChange={(e) => setFormData({ ...formData, notificationTime: e.target.value })}
                className={errors.notificationTime ? 'border-red-500' : ''}
              />
              {errors.notificationTime && (
                <p className="text-sm text-red-600 mt-1">{errors.notificationTime}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">場所（任意）</Label>
              <Select value={formData.location || "unset"} onValueChange={(value) => setFormData({ ...formData, location: value === "unset" ? "" : value })}>
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
          </CardContent>
        </Card>

        {/* 期限設定 */}
        <Card>
          <CardHeader>
            <h2 className="font-medium text-gray-900">期限設定</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dueDate">期限日</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dueTime">時刻</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  disabled={!formData.dueDate}
                />
              </div>
            </div>
            
            {formData.dueDate && (
              <div>
                <Label htmlFor="reminderHours">事前通知（何時間前）</Label>
                <Select value={formData.reminderHours} onValueChange={(value) => setFormData({ ...formData, reminderHours: value })}>
                  <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* 履歴情報（既存の家事の場合） */}
        {chore && !isNew && (
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">履歴情報</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">状態:</span>
                <span className={chore.isCompleted ? 'text-green-600' : 'text-orange-600'}>
                  {chore.isCompleted ? '完了' : '未完了'}
                </span>
              </div>
              {chore.completedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">最終完了日:</span>
                  <span className="text-gray-900">
                    {new Date(chore.completedAt).toLocaleString('ja-JP')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">写真数:</span>
                <span className="text-gray-900">{chore.photos?.length || 0}枚</span>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </ScrollArea>
    </div>
  );
}