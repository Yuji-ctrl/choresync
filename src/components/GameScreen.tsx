import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Coins, Heart, Trophy, Star, Gift, Gamepad2, ArrowRight, Play, ArrowLeft } from 'lucide-react';
import { MiniGameModal } from './MiniGameModal';
import { Chore } from './ChoreItem';
import { FamilyMember } from './MessagesScreen';

// ゲーム関連のインターフェース
interface GamePet {
  id: string;
  name: string;
  emoji: string;
  level: number;
  happiness: number;
  hunger: number;
  energy: number;
  evolution: 'egg' | 'baby' | 'adult' | 'special';
}

interface GameItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  category: 'food' | 'toy' | 'decoration';
}

interface UserGameData {
  userId: string;
  points: number;
  totalPoints: number;
  pet: GamePet;
  items: string[];
  achievements: string[];
  lastPlayTime: Date;
}

interface GameScreenProps {
  chores: Chore[];
  familyMembers: FamilyMember[];
  currentUserId?: string;
  onBack?: () => void;
}

const gameItems: GameItem[] = [
  { id: '1', name: 'おいしいごはん', emoji: '🍎', description: '満腹度が大幅回復', cost: 50, category: 'food' },
  { id: '2', name: 'おやつ', emoji: '🍪', description: '幸せ度がアップ', cost: 30, category: 'food' },
  { id: '3', name: 'ボール', emoji: '⚽', description: 'エネルギー消費で幸せ度アップ', cost: 100, category: 'toy' },
  { id: '4', name: 'ぬいぐるみ', emoji: '🧸', description: '安心して休むことができる', cost: 80, category: 'toy' },
  { id: '5', name: '花束', emoji: '💐', description: 'お部屋がきれいになる', cost: 120, category: 'decoration' },
  { id: '6', name: '宝箱', emoji: '📦', description: 'ランダムでアイテムが入っている', cost: 200, category: 'decoration' },
];

const achievements = [
  { id: 'first_chore', name: '初めての家事', emoji: '🌟', description: '最初の家事を完了' },
  { id: 'week_warrior', name: '一週間継続', emoji: '🏆', description: '7日連続で家事を実行' },
  { id: 'time_master', name: 'タイムマスター', emoji: '⏰', description: '累計300分以上家事を実行' },
  { id: 'pet_lover', name: 'ペット愛好家', emoji: '❤️', description: 'ペットの幸せ度を100%に' },
  { id: 'collector', name: 'コレクター', emoji: '🎁', description: '10個以上のアイテムを収集' },
];

export function GameScreen({ chores, familyMembers, currentUserId = '3', onBack }: GameScreenProps) {
  // 家事時間からポイントを計算（1分＝1ポイント）
  const calculateUserPoints = (userId: string) => {
    const userChores = chores.filter(chore => 
      chore.completedBy === userId && 
      chore.completedAt && 
      chore.timeSpent
    );
    return userChores.reduce((total, chore) => total + (chore.timeSpent || 0), 0);
  };

  const [gameData, setGameData] = useState<UserGameData>({
    userId: currentUserId,
    points: calculateUserPoints(currentUserId),
    totalPoints: calculateUserPoints(currentUserId),
    pet: {
      id: 'my_pet',
      name: 'ぽちょ',
      emoji: '🐱',
      level: Math.floor(calculateUserPoints(currentUserId) / 100) + 1,
      happiness: Math.min(calculateUserPoints(currentUserId) * 2, 100),
      hunger: Math.max(100 - Math.floor(calculateUserPoints(currentUserId) / 5), 20),
      energy: Math.min(80 + Math.floor(calculateUserPoints(currentUserId) / 10), 100),
      evolution: calculateUserPoints(currentUserId) > 300 ? 'special' : 
                 calculateUserPoints(currentUserId) > 150 ? 'adult' : 
                 calculateUserPoints(currentUserId) > 50 ? 'baby' : 'egg',
    },
    items: [],
    achievements: [],
    lastPlayTime: new Date(),
  });

  const [selectedMiniGame, setSelectedMiniGame] = useState<'memory' | 'puzzle' | 'quiz' | null>(null);
  const [gamePlayTime, setGamePlayTime] = useState(0); // 秒
  const [showGameModal, setShowGameModal] = useState(false);

  // アイテム使用
  const handleUseItem = (itemId: string) => {
    const item = gameItems.find(i => i.id === itemId);
    if (!item || gameData.points < item.cost) return;

    setGameData(prev => {
      const newPet = { ...prev.pet };
      
      switch (item.category) {
        case 'food':
          newPet.hunger = Math.max(newPet.hunger - 30, 0);
          newPet.happiness = Math.min(newPet.happiness + 20, 100);
          break;
        case 'toy':
          newPet.energy = Math.max(newPet.energy - 20, 0);
          newPet.happiness = Math.min(newPet.happiness + 30, 100);
          break;
        case 'decoration':
          newPet.happiness = Math.min(newPet.happiness + 10, 100);
          break;
      }

      return {
        ...prev,
        points: prev.points - item.cost,
        pet: newPet,
        items: [...prev.items, itemId],
      };
    });
  };

  // ミニゲーム
  const handlePlayMiniGame = (gameId: 'memory' | 'puzzle' | 'quiz') => {
    const timeAllowed = Math.floor(gameData.points / 10); // 10ポイント = 1秒
    if (timeAllowed <= 0) return;

    setSelectedMiniGame(gameId);
    setGamePlayTime(timeAllowed);
    setShowGameModal(true);
  };

  const handleGameComplete = (score: number, bonusPoints: number) => {
    setGameData(prev => ({
      ...prev,
      points: Math.max(prev.points - Math.floor(gamePlayTime * 10), 0) + bonusPoints, // 使用ポイント分を差し引いてボーナス追加
      totalPoints: prev.totalPoints + bonusPoints,
    }));
    setShowGameModal(false);
    setSelectedMiniGame(null);
  };

  // ランキング計算
  const familyRanking = familyMembers
    .map(member => ({
      ...member,
      points: calculateUserPoints(member.id),
    }))
    .sort((a, b) => b.points - a.points);

  const currentUserRank = familyRanking.findIndex(member => member.id === currentUserId) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b p-4">
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
              <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-500" />
                家事ランド
              </h1>
              <p className="text-sm text-gray-600">家事でポイントを貯めて遊ぼう！</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">{gameData.points}</span>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              #{currentUserRank}位
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs defaultValue="pet" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pet">ペット</TabsTrigger>
            <TabsTrigger value="shop">ショップ</TabsTrigger>
            <TabsTrigger value="games">ゲーム</TabsTrigger>
            <TabsTrigger value="ranking">ランキング</TabsTrigger>
          </TabsList>

          {/* ペットタブ */}
          <TabsContent value="pet" className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-6xl mb-2">{gameData.pet.emoji}</div>
                  <h3 className="font-semibold text-lg">{gameData.pet.name}</h3>
                  <Badge className="bg-purple-100 text-purple-800">
                    Lv.{gameData.pet.level} {gameData.pet.evolution === 'special' ? '✨特別進化' : 
                             gameData.pet.evolution === 'adult' ? '🦋成熟期' : 
                             gameData.pet.evolution === 'baby' ? '🐣成長期' : '🥚卵'}
                  </Badge>
                </div>

                {/* ペットのステータス */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        幸せ度
                      </span>
                      <span className="text-sm font-medium">{gameData.pet.happiness}%</span>
                    </div>
                    <Progress value={gameData.pet.happiness} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">🍽️ 満腹度</span>
                      <span className="text-sm font-medium">{100 - gameData.pet.hunger}%</span>
                    </div>
                    <Progress value={100 - gameData.pet.hunger} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">⚡ エネルギー</span>
                      <span className="text-sm font-medium">{gameData.pet.energy}%</span>
                    </div>
                    <Progress value={gameData.pet.energy} className="h-2" />
                  </div>
                </div>

                {/* 進化条件 */}
                {gameData.pet.evolution !== 'special' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {gameData.pet.evolution === 'egg' && '50ポイントで成長期に進化！'}
                      {gameData.pet.evolution === 'baby' && '150ポイントで成熟期に進化！'}
                      {gameData.pet.evolution === 'adult' && '300ポイントで特別進化！'}
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={
                          gameData.pet.evolution === 'egg' ? (gameData.totalPoints / 50) * 100 :
                          gameData.pet.evolution === 'baby' ? (gameData.totalPoints / 150) * 100 :
                          (gameData.totalPoints / 300) * 100
                        } 
                        className="h-1" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* ペットのお世話 */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">お世話メニュー</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-3"
                  onClick={() => handleUseItem('1')}
                  disabled={gameData.points < 50}
                >
                  <span>🍎</span>
                  <div className="text-left">
                    <div className="text-sm">ごはん</div>
                    <div className="text-xs text-gray-500">50pt</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-3"
                  onClick={() => handleUseItem('3')}
                  disabled={gameData.points < 100}
                >
                  <span>⚽</span>
                  <div className="text-left">
                    <div className="text-sm">遊ぶ</div>
                    <div className="text-xs text-gray-500">100pt</div>
                  </div>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ショップタブ */}
          <TabsContent value="shop" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {gameItems.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{item.emoji}</div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleUseItem(item.id)}
                      disabled={gameData.points < item.cost}
                      className="w-full"
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {item.cost}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ゲームタブ */}
          <TabsContent value="games" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">ミニゲーム</h4>
              <p className="text-sm text-gray-600 mb-4">
                10ポイント = 1秒のプレイ時間 (現在: {Math.floor(gameData.points / 10)}秒プレイ可能)
              </p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => handlePlayMiniGame('memory')}
                  disabled={gameData.points < 10}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div className="text-left">
                      <div className="font-medium">記憶ゲーム</div>
                      <div className="text-sm text-gray-500">カードを覚えて当てよう</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => handlePlayMiniGame('puzzle')}
                  disabled={gameData.points < 10}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧩</span>
                    <div className="text-left">
                      <div className="font-medium">パズル</div>
                      <div className="text-sm text-gray-500">ピースを組み立てよう</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => handlePlayMiniGame('quiz')}
                  disabled={gameData.points < 10}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❓</span>
                    <div className="text-left">
                      <div className="font-medium">家事クイズ</div>
                      <div className="text-sm text-gray-500">家事の豆知識を学ぼう</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>


          </TabsContent>

          {/* ランキングタブ */}
          <TabsContent value="ranking" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                家族ランキング
              </h4>
              <div className="space-y-3">
                {familyRanking.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      member.id === currentUserId ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.points}ポイント</div>
                      </div>
                    </div>
                    {index === 0 && <div className="text-2xl">👑</div>}
                    {index === 1 && <div className="text-2xl">🥈</div>}
                    {index === 2 && <div className="text-2xl">🥉</div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* 達成バッジ */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                達成バッジ
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => {
                  const isUnlocked = 
                    (achievement.id === 'first_chore' && gameData.totalPoints > 0) ||
                    (achievement.id === 'time_master' && gameData.totalPoints >= 300) ||
                    (achievement.id === 'pet_lover' && gameData.pet.happiness >= 100);

                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg text-center space-y-1 ${
                        isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50 opacity-50'
                      }`}
                    >
                      <div className="text-2xl">{achievement.emoji}</div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ミニゲームモーダル */}
        <MiniGameModal
          isOpen={showGameModal}
          onClose={() => {
            setShowGameModal(false);
            setSelectedMiniGame(null);
          }}
          gameType={selectedMiniGame}
          playTimeSeconds={gamePlayTime}
          onGameComplete={handleGameComplete}
        />
      </div>
    </div>
  );
}