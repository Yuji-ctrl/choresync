import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, Share2, Clock, User } from 'lucide-react';
import { Tip } from './TipsScreen';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TipDetailScreenProps {
  tip: Tip;
  onBack: () => void;
  onLike: (tipId: string) => void;
  onShare: (tip: Tip) => void;
}

export function TipDetailScreen({ tip, onBack, onLike, onShare }: TipDetailScreenProps) {
  const categories = [
    { id: 'kitchen', label: 'キッチン', icon: '🍳' },
    { id: 'cleaning', label: '掃除', icon: '🧹' },
    { id: 'laundry', label: '洗濯', icon: '👕' },
    { id: 'organization', label: '整理整頓', icon: '📦' },
    { id: 'timesaving', label: '時短テク', icon: '⏰' },
    { id: 'ecolife', label: 'エコ生活', icon: '🌱' },
  ];

  const category = categories.find(c => c.id === tip.category);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onLike(tip.id)}
            >
              <Heart 
                className={`w-4 h-4 ${tip.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
              <span className="ml-1">{tip.likes}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(tip)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-6">
        {/* メイン画像 */}
        {tip.imageUrl && (
          <div className="aspect-video bg-gray-100">
            <ImageWithFallback
              src={tip.imageUrl}
              alt={tip.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 記事情報 */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            {category && (
              <Badge variant="outline">
                {category.icon} {category.label}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {tip.readTime}
            </div>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-4 leading-7">
            {tip.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <User className="w-4 h-4" />
            <span>おうち家事編集部</span>
            <span>•</span>
            <span>{new Date(tip.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>

          {/* 記事内容 */}
          <div className="prose prose-sm max-w-none">
            {tip.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* タグ */}
          {tip.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">関連タグ</h3>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                onClick={() => onLike(tip.id)}
                variant={tip.isLiked ? "default" : "outline"}
                className="flex-1"
              >
                <Heart 
                  className={`w-4 h-4 mr-2 ${tip.isLiked ? 'fill-current' : ''}`}
                />
                {tip.isLiked ? 'お気に入り済み' : 'お気に入りに追加'}
              </Button>
              <Button
                onClick={() => onShare(tip)}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                シェア
              </Button>
            </div>
          </div>

          {/* 関連情報 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 このtipを活用しよう</h3>
            <p className="text-sm text-blue-800">
              このコツを実践したら、ぜひ写真を撮って記録に残してみてください。
              家族とシェアすることで、みんなで家事のレベルアップができます！
            </p>
          </div>

          {/* フィードバック */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">この記事はどうでしたか？</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">👍 役に立った</Button>
              <Button size="sm" variant="outline">💡 新しい発見</Button>
              <Button size="sm" variant="outline">⭐ すばらしい</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}