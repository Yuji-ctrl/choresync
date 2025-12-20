import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Star, Gift, Zap, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface RewardSystemProps {
  totalPoints: number;
  onRewardClaimed: (rewardId: string) => void;
  unclaimedRewards: string[];
}

interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  pointsRequired: number;
  category: 'daily' | 'weekly' | 'milestone';
  value: number;
}

const rewards: Reward[] = [
  { id: 'daily_10', title: '毎日コツコツ', description: '1日10分以上家事', emoji: '⭐', pointsRequired: 10, category: 'daily', value: 5 },
  { id: 'daily_30', title: '頑張り屋さん', description: '1日30分以上家事', emoji: '🌟', pointsRequired: 30, category: 'daily', value: 15 },
  { id: 'weekly_100', title: '週間チャンピオン', description: '1週間で100分家事', emoji: '🏆', pointsRequired: 100, category: 'weekly', value: 50 },
  { id: 'milestone_500', title: 'マスター認定', description: '累計500分達成', emoji: '👑', pointsRequired: 500, category: 'milestone', value: 200 },
];

export function ChoreRewardSystem({ totalPoints, onRewardClaimed, unclaimedRewards }: RewardSystemProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [newReward, setNewReward] = useState<Reward | null>(null);

  useEffect(() => {
    // 新しい報酬がアンロックされたかチェック
    const availableRewards = rewards.filter(reward => 
      totalPoints >= reward.pointsRequired && !unclaimedRewards.includes(reward.id)
    );

    if (availableRewards.length > 0) {
      const latestReward = availableRewards[availableRewards.length - 1];
      setNewReward(latestReward);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [totalPoints, unclaimedRewards]);

  const handleClaimReward = (reward: Reward) => {
    onRewardClaimed(reward.id);
    setNewReward(null);
  };

  return (
    <div className="space-y-4">
      {/* 新しい報酬のお祝い */}
      {showCelebration && newReward && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <div className="text-6xl">{newReward.emoji}</div>
            <h3 className="text-xl font-bold">🎉 新しい報酬獲得！</h3>
            <div>
              <h4 className="font-semibold">{newReward.title}</h4>
              <p className="text-sm text-gray-600">{newReward.description}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-purple-700">+{newReward.value} ボーナスポイント</span>
            </div>
            <Button onClick={() => handleClaimReward(newReward)}>
              報酬を受け取る
            </Button>
          </Card>
        </motion.div>
      )}

      {/* 報酬一覧 */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          報酬一覧
        </h4>
        <div className="space-y-3">
          {rewards.map(reward => {
            const isUnlocked = totalPoints >= reward.pointsRequired;
            const isClaimed = unclaimedRewards.includes(reward.id);
            const progress = Math.min((totalPoints / reward.pointsRequired) * 100, 100);

            return (
              <div
                key={reward.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isUnlocked && !isClaimed
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : isClaimed
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.emoji}</span>
                    <div>
                      <h5 className="font-medium">{reward.title}</h5>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {reward.pointsRequired}分必要
                        </Badge>
                        {reward.category === 'milestone' && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            マイルストーン
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isClaimed ? (
                      <Badge className="bg-green-100 text-green-800">
                        受取済
                      </Badge>
                    ) : isUnlocked ? (
                      <Button size="sm" onClick={() => handleClaimReward(reward)}>
                        <Gift className="w-3 h-3 mr-1" />
                        受取
                      </Button>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">
                          あと{reward.pointsRequired - totalPoints}分
                        </div>
                        <div className="w-16">
                          <Progress value={progress} className="h-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}