import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Clock, Users, TrendingUp, Award, Calendar, Gamepad2, Zap, Camera } from 'lucide-react';
import { Chore } from './ChoreItem';
import { FamilyMember } from './MessagesScreen';

interface FamilyStatsScreenProps {
  chores: Chore[];
  familyMembers: FamilyMember[];
  onNavigateToAlbum?: () => void;
}

interface ChoreStats {
  memberId: string;
  memberName: string;
  totalTime: number;
  choreCount: number;
  averageTime: number;
}

interface WeeklyStats {
  week: string;
  memberId: string;
  memberName: string;
  time: number;
}

export function FamilyStatsScreen({ chores, familyMembers, onNavigateToAlbum }: FamilyStatsScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // 家族ごとの統計データを計算
  const calculateFamilyStats = (): ChoreStats[] => {
    const stats: Record<string, ChoreStats> = {};
    
    // 家族メンバーごとの初期化
    familyMembers.forEach(member => {
      stats[member.id] = {
        memberId: member.id,
        memberName: member.name,
        totalTime: 0,
        choreCount: 0,
        averageTime: 0,
      };
    });

    // 完了した家事データから統計を計算
    const period = selectedPeriod === 'week' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period);

    chores
      .filter(chore => 
        chore.isCompleted && 
        chore.completedAt && 
        chore.completedBy &&
        chore.completedAt > cutoffDate
      )
      .forEach(chore => {
        const memberId = chore.completedBy!;
        if (stats[memberId]) {
          stats[memberId].totalTime += chore.timeSpent || chore.estimatedTime || 15;
          stats[memberId].choreCount += 1;
        }
      });

    // 平均時間を計算
    Object.values(stats).forEach(stat => {
      if (stat.choreCount > 0) {
        stat.averageTime = Math.round(stat.totalTime / stat.choreCount);
      }
    });

    return Object.values(stats).sort((a, b) => b.totalTime - a.totalTime);
  };

  // 週次データの計算
  const calculateWeeklyData = (): WeeklyStats[] => {
    const weeklyData: WeeklyStats[] = [];
    const weeks = ['先週', '今週'];
    
    weeks.forEach((week, weekIndex) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weekIndex === 0 ? 14 : 7));
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (weekIndex === 0 ? 7 : 0));

      familyMembers.forEach(member => {
        const memberTime = chores
          .filter(chore => 
            chore.isCompleted && 
            chore.completedAt &&
            chore.completedBy === member.id &&
            chore.completedAt >= startDate &&
            chore.completedAt <= endDate
          )
          .reduce((total, chore) => 
            total + (chore.timeSpent || chore.estimatedTime || 15), 0
          );

        weeklyData.push({
          week,
          memberId: member.id,
          memberName: member.name,
          time: memberTime,
        });
      });
    });

    return weeklyData;
  };

  const familyStats = calculateFamilyStats();
  const weeklyData = calculateWeeklyData();
  const totalTime = familyStats.reduce((sum, stat) => sum + stat.totalTime, 0);

  // パイチャート用のデータ
  const pieData = familyStats
    .filter(stat => stat.totalTime > 0)
    .map(stat => ({
      name: stat.memberName,
      value: stat.totalTime,
      percentage: totalTime > 0 ? Math.round((stat.totalTime / totalTime) * 100) : 0,
    }));

  // カラーパレット
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // 最も活躍したメンバー
  const topPerformer = familyStats.find(stat => stat.totalTime > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">みんなの頑張り</h1>
            <p className="text-sm text-gray-600">
              今週のMVPは？
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
            >
              週間
            </Button>
            <Button
              size="sm"
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
            >
              月間
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">合計時間</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">参加人数</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800">
              {familyStats.filter(stat => stat.totalTime > 0).length}人
            </div>
          </Card>
        </div>

        {/* MVP カード */}
        {topPerformer && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-800">今{selectedPeriod === 'week' ? '週' : '月'}のMVP</h3>
                <p className="text-sm text-gray-600">
                  {topPerformer.memberName} - {Math.floor(topPerformer.totalTime / 60)}h {topPerformer.totalTime % 60}m
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="pie" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pie">負担割合</TabsTrigger>
            <TabsTrigger value="bar">時間比較</TabsTrigger>
            <TabsTrigger value="trend">推移</TabsTrigger>
          </TabsList>

          {/* 負担割合（パイチャート） */}
          <TabsContent value="pie">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">家事時間の負担割合</h3>
              {pieData.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}分`, '時間']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="text-sm text-gray-700">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium">{entry.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだデータがありません
                </div>
              )}
            </Card>
          </TabsContent>

          {/* 時間比較（バーチャート） */}
          <TabsContent value="bar">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">家族別家事時間</h3>
              {familyStats.some(stat => stat.totalTime > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={familyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="memberName" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: '時間(分)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}分`, '家事時間']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar dataKey="totalTime" fill="#8884d8" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだデータがありません
                </div>
              )}
              
              {/* 詳細リスト */}
              <div className="mt-4 space-y-2">
                {familyStats
                  .filter(stat => stat.totalTime > 0)
                  .map(stat => (
                    <div key={stat.memberId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{stat.memberName}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{Math.floor(stat.totalTime / 60)}h {stat.totalTime % 60}m</div>
                        <div className="text-xs text-gray-600">{stat.choreCount}件完了</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          </TabsContent>

          {/* 推移（ラインチャート） */}
          <TabsContent value="trend">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">週次推移</h3>
              {weeklyData.some(data => data.time > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis label={{ value: '時間(分)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value}分`, name]}
                      />
                      {familyMembers.map((member, index) => (
                        <Line 
                          key={member.id}
                          type="monotone" 
                          dataKey="time"
                          data={weeklyData.filter(d => d.memberId === member.id)}
                          stroke={colors[index % colors.length]} 
                          strokeWidth={2}
                          name={member.name}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだデータがありません
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* 便利機能へのアクセス */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          {/* アルバムへのアクセス */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-blue-800">家事の写真アルバム</h3>
                  <p className="text-sm text-blue-700">完了した家事の写真を確認できます</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={onNavigateToAlbum}
                className="bg-blue-500 hover:bg-blue-600"
              >
                アルバムを見る
              </Button>
            </div>
          </Card>

          {/* ゲーム機能への誘導 */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-purple-800">家事ランドで遊ぼう！</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-purple-700">
                家事をするほどゲームポイントが貯まります！ペットのお世話やミニゲームを楽しもう🎮
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg">
                  <div className="text-lg">🐱</div>
                  <div className="text-xs text-gray-600">ペット育成</div>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <div className="text-lg">🏪</div>
                  <div className="text-xs text-gray-600">アイテム交換</div>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <div className="text-lg">🏆</div>
                  <div className="text-xs text-gray-600">ランキング</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">現在のポイント: {familyStats.find(s => s.memberId === '3')?.totalTime || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 改善提案 */}
        <Card className="p-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold">改善提案</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            {totalTime === 0 ? (
              <p>家事の完了時に担当者と時間を記録して、負担の見える化を始めましょう！</p>
            ) : familyStats.filter(stat => stat.totalTime > 0).length === 1 ? (
              <p>他の家族メンバーにも家事をお願いして、負担を分散してみましょう。</p>
            ) : (
              <>
                <p>バランスよく家事が分散されています！この調子で続けましょう。</p>
                {topPerformer && topPerformer.totalTime > totalTime * 0.6 && (
                  <p className="text-amber-600">
                    {topPerformer.memberName}の負担が大きめです。他のメンバーで分担を検討してみませんか？
                  </p>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}