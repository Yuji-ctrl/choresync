import React, { useState } from 'react';
import { Button } from './ui/button';
import { Grid3x3, Calendar, Filter, ArrowLeft, User } from 'lucide-react';
import { ChorePhoto, Chore } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PhotoAlbumScreenProps {
  photos: ChorePhoto[];
  chores: Chore[];
  onPhotoClick: (photo: ChorePhoto) => void;
  onBack?: () => void;
}

export function PhotoAlbumScreen({ photos, chores, onPhotoClick, onBack }: PhotoAlbumScreenProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [filterChore, setFilterChore] = useState<string>('all');

  const filteredPhotos = photos.filter(photo => 
    filterChore === 'all' || photo.choreId === filterChore
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => 
    new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
  );

  const getChoreById = (choreId: string) => 
    chores.find(chore => chore.id === choreId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-800">家事アルバム</h1>
              <p className="text-sm text-gray-600">
                {photos.reduce((total, photo) => total + photo.imageUrls.length, 0)}枚の写真 ({photos.length}件の投稿)
                {photos.filter(p => p.comment).length > 0 && (
                  <span className="ml-2 text-blue-600">
                    💬 {photos.filter(p => p.comment).length}件にコメント
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* フィルター */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          <Button
            size="sm"
            variant={filterChore === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterChore('all')}
          >
            すべて
          </Button>
          {chores.map(chore => (
            <Button
              key={chore.id}
              size="sm"
              variant={filterChore === chore.id ? 'default' : 'outline'}
              onClick={() => setFilterChore(chore.id)}
            >
              {chore.icon} {chore.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 pb-20">
        {sortedPhotos.length === 0 ? (
          <div>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">📷</div>
              <p className="text-gray-600">まだ写真がありません</p>
              <p className="text-sm text-gray-500">家事を完了して写真を撮ってみましょう</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-left max-w-sm mx-auto">
              <p className="text-sm text-blue-800 mb-2">💡 写真のコメントを見る方法</p>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. 写真をタップして詳細画面を開く</li>
                <li>2. 写真の下にコメント欄が表示されます</li>
                <li>3. 編集ボタンでコメントを変更できます</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">💬マークが付いた写真はコメントがあります</p>
            </div>
          </div>
        ) : (
          <>
            {/* 写真統計情報 */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">📊 写真の統計</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">{sortedPhotos.length}</div>
                  <div className="text-gray-600">投稿数</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-purple-600">{sortedPhotos.reduce((total, photo) => total + photo.imageUrls.length, 0)}</div>
                  <div className="text-gray-600">写真枚数</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">{sortedPhotos.filter(p => p.comment).length}</div>
                  <div className="text-gray-600">コメント付き</div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="space-y-4">
                {sortedPhotos.map((photo) => {
                  const chore = getChoreById(photo.choreId);
                  return (
                    <div key={photo.id} className="bg-white rounded-lg p-4 shadow-sm">
                      {/* 投稿者情報 */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{photo.takenByName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(photo.takenAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <span className="text-lg">{chore?.icon}</span>
                          <span className="text-sm text-gray-600">{chore?.name}</span>
                        </div>
                      </div>
                      
                      {/* 写真グリッド */}
                      <div className={`grid gap-2 ${
                        photo.imageUrls.length === 1 ? 'grid-cols-1' :
                        photo.imageUrls.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2'
                      }`}>
                        {photo.imageUrls.slice(0, 4).map((imageUrl, index) => (
                          <div
                            key={index}
                            className={`relative cursor-pointer group ${
                              photo.imageUrls.length === 3 && index === 0 ? 'col-span-2' : ''
                            }`}
                            onClick={() => onPhotoClick(photo)}
                          >
                            <ImageWithFallback
                              src={imageUrl}
                              alt={`${chore?.name || '家事記録'} ${index + 1}`}
                              className={`w-full object-cover rounded-lg ${
                                photo.imageUrls.length === 1 ? 'h-64' : 'h-32'
                              }`}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                            
                            {/* 枚数インジケーター */}
                            {photo.imageUrls.length > 1 && (
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}/{photo.imageUrls.length}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* コメント */}
                      {photo.comment && (
                        <div className="mt-3 text-sm text-gray-700">
                          <p>{photo.comment}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(
                  sortedPhotos.reduce((acc, photo) => {
                    const date = new Date(photo.takenAt).toLocaleDateString('ja-JP');
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(photo);
                    return acc;
                  }, {} as Record<string, ChorePhoto[]>)
                ).map(([date, dayPhotos]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-1">{date}</h3>
                    <div className="space-y-4">
                      {dayPhotos.map((photo) => {
                        const chore = getChoreById(photo.choreId);
                        return (
                          <div key={photo.id} className="bg-white rounded-lg p-4 shadow-sm">
                            {/* 投稿者情報 */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-800">{photo.takenByName}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(photo.takenAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div className="ml-auto flex items-center gap-1">
                                <span className="text-sm">{chore?.icon}</span>
                                <span className="text-xs text-gray-600">{chore?.name}</span>
                              </div>
                            </div>
                            
                            {/* 写真のサムネイル */}
                            <div className="flex gap-1 overflow-x-auto">
                              {photo.imageUrls.slice(0, 4).map((imageUrl, index) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 w-16 h-16 relative cursor-pointer group"
                                  onClick={() => onPhotoClick(photo)}
                                >
                                  <ImageWithFallback
                                    src={imageUrl}
                                    alt={`${chore?.name || '家事記録'} ${index + 1}`}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded" />
                                  {index === 0 && photo.imageUrls.length > 1 && (
                                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1 rounded-tl">
                                      +{photo.imageUrls.length - 1}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* コメント */}
                            {photo.comment && (
                              <div className="mt-2 text-xs text-gray-700">
                                <p>{photo.comment}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}