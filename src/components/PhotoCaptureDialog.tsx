import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Camera, Upload, X, Plus } from 'lucide-react';
import { Chore } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PhotoCaptureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chore: Chore | null;
  onSavePhoto: (choreId: string, imageFiles: File[], comment: string) => Promise<void>;
}

export function PhotoCaptureDialog({ 
  isOpen, 
  onClose, 
  chore, 
  onSavePhoto 
}: PhotoCaptureDialogProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 4;

  const handleImageSelect = (file: File) => {
    if (selectedImages.length >= MAX_IMAGES) return;
    
    const newImages = [...selectedImages, file];
    const url = URL.createObjectURL(file);
    const newUrls = [...previewUrls, url];
    
    setSelectedImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (selectedImages.length < MAX_IMAGES) {
        handleImageSelect(file);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Clean up object URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleSave = async () => {
    if (selectedImages.length === 0 || !chore) return;
    
    setIsUploading(true);
    try {
      await onSavePhoto(chore.id, selectedImages, comment);
      handleClose();
    } catch (error) {
      console.error('写真の保存に失敗しました:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setPreviewUrls([]);
    setComment('');
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {chore?.icon} {chore?.name}の記録写真
          </DialogTitle>
          <DialogDescription>
            写真を撮影してタスクの完了を記録しましょう（最大4枚まで）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 写真選択・プレビューエリア */}
          <div className="space-y-3">
            {/* 選択済み画像のグリッド表示 */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <ImageWithFallback
                      src={url}
                      alt={`プレビュー ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
                
                {/* 追加ボタン（4枚未満の場合） */}
                {selectedImages.length < MAX_IMAGES && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-full w-full flex flex-col gap-2"
                    >
                      <Plus className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-400">写真を追加</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* 初回の写真選択エリア */}
            {selectedImages.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">写真を最大4枚まで追加できます</p>
                <p className="text-sm text-gray-500 mb-4">ビフォー・アフターなどの記録に便利です</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    カメラで撮影
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    ファイルから選択
                  </Button>
                </div>
              </div>
            )}
            
            {/* 隠しファイル入力 */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* コメント入力 */}
          {selectedImages.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                コメント（任意）
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="家事を完了した感想やメモを書いてください..."
                className="min-h-20"
              />
            </div>
          )}

          {/* アクションボタン */}
          {selectedImages.length > 0 && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? '保存中...' : `保存 (${selectedImages.length}枚)`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}