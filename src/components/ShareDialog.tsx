import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Share2, Twitter, Instagram, Facebook, Copy } from 'lucide-react';
import { ChorePhoto, Chore } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photo: ChorePhoto | null;
  chore: Chore | null;
}

export function ShareDialog({ isOpen, onClose, photo, chore }: ShareDialogProps) {
  const [shareText, setShareText] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  React.useEffect(() => {
    if (photo && chore) {
      const photoCount = photo.imageUrls.length > 1 ? `(${photo.imageUrls.length}枚の写真で記録)` : '';
      const defaultText = `今日は${chore.name}をしました！${chore.icon} ${photoCount} #家事記録 #おうち時間`;
      setShareText(defaultText);
    }
  }, [photo, chore]);

  const handleShareToTwitter = async () => {
    if (!photo || !chore) return;
    
    setIsSharing(true);
    try {
      const text = encodeURIComponent(shareText);
      const url = encodeURIComponent(photo.imageUrls[0]);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      
      window.open(twitterUrl, '_blank', 'width=600,height=400');
      toast('Twitterで共有しました');
      onClose();
    } catch (error) {
      toast('共有に失敗しました');
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareToInstagram = async () => {
    // Instagram APIは複雑なので、ここでは基本的な案内を表示
    toast('Instagramアプリで写真をシェアしてください', {
      description: '写真を保存してInstagramアプリから投稿できます',
      duration: 5000,
    });
  };

  const handleShareToFacebook = async () => {
    if (!photo) return;
    
    setIsSharing(true);
    try {
      const url = encodeURIComponent(photo.imageUrls[0]);
      const quote = encodeURIComponent(shareText);
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
      
      window.open(facebookUrl, '_blank', 'width=600,height=400');
      toast('Facebookで共有しました');
      onClose();
    } catch (error) {
      toast('共有に失敗しました');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    if (!photo) return;
    
    try {
      await navigator.clipboard.writeText(photo.imageUrl);
      toast('リンクをコ���ーしました');
    } catch (error) {
      toast('コピーに失敗しました');
    }
  };

  if (!photo || !chore) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Share2 className="w-5 h-5 inline mr-2" />
            写真をシェア
          </DialogTitle>
          <DialogDescription>
            SNSや他のアプリで写真をシェアしましょう
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 写真プレビュー */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <ImageWithFallback
              src={photo.imageUrls[0]}
              alt={chore.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{chore.icon} {chore.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(photo.takenAt).toLocaleDateString('ja-JP')}
                {photo.imageUrls.length > 1 && (
                  <span className="ml-2 text-blue-600">({photo.imageUrls.length}枚)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                撮影者: {photo.takenByName}
              </p>
            </div>
          </div>

          {/* シェアテキスト編集 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              シェアメッセージ
            </label>
            <Textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="シェアするメッセージを入力..."
              className="min-h-20"
            />
          </div>

          {/* シェアボタン */}
          <div className="space-y-2">
            <Button
              onClick={handleShareToTwitter}
              disabled={isSharing}
              className="w-full bg-blue-400 hover:bg-blue-500"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitterで共有
            </Button>
            
            <Button
              onClick={handleShareToInstagram}
              disabled={isSharing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagramで共有
            </Button>
            
            <Button
              onClick={handleShareToFacebook}
              disabled={isSharing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebookで共有
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              リンクをコピー
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-4"
          >
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}