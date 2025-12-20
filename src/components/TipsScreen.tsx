import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { BookOpen, Search, Clock, Star, TrendingUp, Heart, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  publishedAt: Date;
}

interface TipsScreenProps {
  tips: Tip[];
  onTipClick: (tip: Tip) => void;
  onLikeTip: (tipId: string) => void;
  onBack?: () => void;
}

const categories = [
  { id: 'all', label: 'すべて', icon: '📚' },
  { id: 'kitchen', label: 'キッチン', icon: '🍳' },
  { id: 'cleaning', label: '掃除', icon: '🧹' },
  { id: 'laundry', label: '洗濯', icon: '👕' },
  { id: 'organization', label: '整理整頓', icon: '📦' },
  { id: 'timesaving', label: '時短テク', icon: '⏰' },
  { id: 'ecolife', label: 'エコ生活', icon: '🌱' },
];

export function TipsScreen({ tips, onTipClick, onLikeTip, onBack }: TipsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedTips = [...filteredTips].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const featuredTips = tips.filter(tip => tip.likes > 10).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <BookOpen className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">家事コラム</h1>
            <p className="text-sm text-gray-600">お役立ちtipsをチェック</p>
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="家事のコツを検索..."
            className="pl-10"
          />
        </div>

        {/* カテゴリーフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.icon} {category.label}
            </Button>
          ))}
        </div>

        {/* ソート */}
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant={sortBy === 'latest' ? 'default' : 'outline'}
            onClick={() => setSortBy('latest')}
          >
            <Clock className="w-4 h-4 mr-1" />
            最新順
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'popular' ? 'default' : 'outline'}
            onClick={() => setSortBy('popular')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            人気順
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* 注目記事 */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <div>
            <h2 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              注目の記事
            </h2>
            <div className="grid gap-3">
              {featuredTips.map((tip) => (
                <Card 
                  key={tip.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTipClick(tip)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {tip.imageUrl && (
                        <ImageWithFallback
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {tip.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {tip.readTime}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeTip(tip.id);
                            }}
                            className="p-1 h-auto"
                          >
                            <Heart 
                              className={`w-4 h-4 ${tip.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                            />
                            <span className="ml-1 text-xs">{tip.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 記事一覧 */}
        <div>
          <h2 className="font-medium text-gray-900 mb-3">
            {selectedCategory === 'all' ? 'すべての記事' : `${categories.find(c => c.id === selectedCategory)?.label}の記事`}
            <span className="ml-2 text-sm text-gray-600">({sortedTips.length}件)</span>
          </h2>

          {sortedTips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">🔍</div>
              <p className="text-gray-600">記事が見つかりませんでした</p>
              <p className="text-sm text-gray-500">検索条件を変更してみてください</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTips.map((tip) => (
                <Card 
                  key={tip.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTipClick(tip)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {tip.imageUrl && (
                        <ImageWithFallback
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {tip.title}
                          </h3>
                          <Badge variant="outline" className="ml-2 flex-shrink-0">
                            {categories.find(c => c.id === tip.category)?.icon}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {tip.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tip.readTime}
                            </div>
                            <span>
                              {new Date(tip.publishedAt).toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-1">
                              {tip.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLikeTip(tip.id);
                              }}
                              className="p-1 h-auto"
                            >
                              <Heart 
                                className={`w-4 h-4 ${tip.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                              />
                              <span className="ml-1">{tip.likes}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}