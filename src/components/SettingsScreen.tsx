import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Bell, Type, Smartphone, Users, Download, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export interface AppSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  soundEnabled: boolean;
  familySharing: boolean;
  autoBackup: boolean;
  language: 'ja' | 'en';
}

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onClearData: () => void;
  onBack?: () => void;
}

export function SettingsScreen({ 
  settings, 
  onUpdateSettings,
  onExportData,
  onClearData,
  onBack
}: SettingsScreenProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClearData = () => {
    if (showDeleteConfirm) {
      onClearData();
      setShowDeleteConfirm(false);
      toast('データを削除しました');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const getFontSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return '小';
      case 'medium': return '標準';
      case 'large': return '大';
      default: return '標準';
    }
  };

  return (
    <div className="min-h-screen neumorphism-container">
      {/* ヘッダー */}
      <div className="neumorphism-header p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              className="neumorphism-button p-2 text-gray-700"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">設定</h1>
            <p className="text-sm text-gray-600">アプリの設定を変更できます</p>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* 表示設定 */}
        <div className="neumorphism-card p-6">
          <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5" />
            表示設定
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              <Label>文字サイズ</Label>
              <Badge variant="outline">
                {getFontSizeLabel(settings.fontSize)}
              </Badge>
            </div>
            <Select
              value={settings.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large') =>
                onUpdateSettings({ fontSize: value })
              }
            >
              <SelectTrigger className="neumorphism-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">小（読みやすさ重視）</SelectItem>
                <SelectItem value="medium">標準（バランス型）</SelectItem>
                <SelectItem value="large">大（見やすさ重視）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="neumorphism-card p-6">
          <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" />
            通知設定
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>プッシュ通知</Label>
                <p className="text-sm text-gray-600">家事の時間になったら通知</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ notifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>音で通知</Label>
                <p className="text-sm text-gray-600">通知音を再生</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ soundEnabled: checked })
                }
                disabled={!settings.notifications}
              />
            </div>
          </div>
        </div>

        {/* 家族共有設定 */}
        <div className="neumorphism-card p-6">
          <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" />
            家族共有
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>家族間でデータを共有</Label>
                <p className="text-sm text-gray-600">家事の進捗と写真を共有</p>
              </div>
              <Switch
                checked={settings.familySharing}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ familySharing: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>自動バックアップ</Label>
                <p className="text-sm text-gray-600">データを自動的にクラウドに保存</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ autoBackup: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* データ管理 */}
        <div className="neumorphism-card p-6">
          <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Download className="w-5 h-5" />
            データ管理
          </h2>
          <div className="space-y-4">
            <button
              onClick={onExportData}
              className="neumorphism-button w-full p-4 flex items-center justify-start text-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              データをエクスポート
            </button>

            <button
              onClick={handleClearData}
              className={`neumorphism-button w-full p-4 flex items-center justify-start transition-colors ${
                showDeleteConfirm 
                  ? 'text-red-700' 
                  : 'text-gray-700'
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {showDeleteConfirm ? '本当に削除しますか？' : 'すべてのデータを削除'}
            </button>
            
            {showDeleteConfirm && (
              <p className="text-xs text-gray-600 px-2">
                この操作は取り消せません。5秒後に自動的にキャンセルされます。
              </p>
            )}
          </div>
        </div>

        {/* アプリ情報 */}
        <div className="neumorphism-card p-6">
          <h2 className="font-medium text-gray-900 mb-4">アプリ情報</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">バージョン:</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">最終更新:</span>
              <span className="text-gray-900">2024年12月</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">開発者:</span>
              <span className="text-gray-900">おうち家事チーム</span>
            </div>
          </div>
        </div>

        {/* フィードバック */}
        <div className="neumorphism-card p-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              アプリの改善にご協力ください
            </p>
            <button className="neumorphism-button w-full p-4 text-gray-700">
              フィードバックを送る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}