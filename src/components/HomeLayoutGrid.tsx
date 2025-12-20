import React from 'react';
import { ChoreItem } from './ChoreItem';
import { HouseLayout } from './HouseLayout';
import { Chore } from '../types';

interface HomeLayoutGridProps {
  chores: Chore[];
  onComplete: (id: string) => void;
  onEdit: (chore: Chore) => void;
  onTakePhoto: (chore: Chore) => void;
}

// 3×3グリッドの位置を定義（パーセンテージ）
const GRID_POSITIONS = [
  { x: 25, y: 39 }, { x: 50, y: 39 }, { x: 75, y: 39 }, // 上段
  { x: 25, y: 56 }, { x: 50, y: 56 }, { x: 75, y: 56 }, // 中段
  { x: 25, y: 73 }, { x: 50, y: 73 }, { x: 75, y: 73 }, // 下段
];

export function HomeLayoutGrid({ chores, onComplete, onEdit, onTakePhoto }: HomeLayoutGridProps) {
  // 最大9個のタスクに制限し、3×3グリッドに配置
  const gridChores = chores.slice(0, 9).map((chore, index) => ({
    ...chore,
    gridPosition: GRID_POSITIONS[index]
  }));

  return (
    <div className="relative w-full h-full">
      {/* 背景の家の画像 */}
      <HouseLayout />
      
      {/* 家事アイテムを3×3グリッドで配置 */}
      {gridChores.map((chore, index) => (
        <div
          key={chore.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${chore.gridPosition.x}%`, 
            top: `${chore.gridPosition.y}%`,
            zIndex: 10 + index
          }}
        >
          <ChoreItem
            chore={chore}
            isUnified={true}
            onComplete={onComplete}
            onEdit={onEdit}
            onTakePhoto={onTakePhoto}
          />
        </div>
      ))}
      
      {/* 家事がない場合のメッセージ */}
      {chores.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-gray-500">家事を追加してみましょう</p>
          </div>
        </div>
      )}
    </div>
  );
}