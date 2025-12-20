import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Share2, Edit3, Save, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { ChorePhoto, Chore } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PhotoDetailScreenProps {
  photo: ChorePhoto;
  chore: Chore;
  onBack: () => void;
  onShare: (photo: ChorePhoto) => void;
  onUpdateComment: (photoId: string, comment: string) => void;
}

export function PhotoDetailScreen({ 
  photo, 
  chore, 
  onBack, 
  onShare, 
  onUpdateComment 
}: PhotoDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(photo.comment);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photo.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photo.imageUrls.length) % photo.imageUrls.length);
  };

  const handleSaveComment = () => {
    onUpdateComment(photo.id, editComment);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditComment(photo.comment);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => onShare(photo)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 写真 */}
      <div className="flex items-center justify-center h-[60vh] relative">
        <ImageWithFallback
          src={photo.imageUrls[currentImageIndex]}
          alt={`${chore.name} ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* 複数枚の場合のナビゲーション */}
        {photo.imageUrls.length > 1 && (
          <>
            {/* 前の画像ボタン */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* 次の画像ボタン */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {/* 画像インジケーター */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {photo.imageUrls.length}
            </div>
          </>
        )}
      </div>

      {/* 詳細情報 */}
      <div className="bg-white rounded-t-xl p-4 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{chore.icon}</span>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{chore.name}</h2>
            <p className="text-sm text-gray-600">
              {new Date(photo.takenAt).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{photo.takenByName}</span>
            </div>
            {photo.imageUrls.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                {photo.imageUrls.length}枚の写真
              </p>
            )}
          </div>
        </div>

        {/* サムネイル（複数枚の場合） */}
        {photo.imageUrls.length > 1 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">写真一覧</h3>
            <div className="flex gap-2 overflow-x-auto">
              {photo.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <ImageWithFallback
                    src={url}
                    alt={`${chore.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* コメント */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">コメント</h3>
            {!isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="この家事について感想やメモを書いてみましょう..."
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveComment}>
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" />
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 min-h-20">
              {photo.comment ? (
                <p className="text-gray-700">{photo.comment}</p>
              ) : (
                <p className="text-gray-500 italic">コメントなし</p>
              )}
            </div>
          )}
        </div>

        {/* 場所情報 */}
        {chore.location && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">場所</h3>
            <p className="text-gray-600">{chore.location}</p>
          </div>
        )}

        {/* シェアボタン */}
        <Button 
          className="w-full mt-4"
          onClick={() => onShare(photo)}
        >
          <Share2 className="w-4 h-4 mr-2" />
          この写真をシェア
        </Button>
      </div>
    </div>
  );
}