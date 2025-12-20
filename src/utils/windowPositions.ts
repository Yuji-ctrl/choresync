import { Chore } from '../types';

// 窓の位置を定義（パーセンテージ）
export const WINDOW_POSITIONS = [
  { x: 20, y: 30, id: 'window-2f-left', name: '2階左窓' },    // 2階左窓
  { x: 72, y: 30, id: 'window-2f-right', name: '2階右窓' },   // 2階右窓
  { x: 28, y: 50, id: 'window-1f-left', name: '1階左窓' },    // 1階左窓
  { x: 50, y: 50, id: 'window-1f-center', name: '1階中央窓' },  // 1階中央窓
  { x: 72, y: 50, id: 'window-1f-right', name: '1階右窓' },   // 1階右窓
  { x: 28, y: 70, id: 'window-1f-bl', name: '1階左下窓' },      // 1階左下窓
  { x: 72, y: 70, id: 'window-1f-br', name: '1階右下窓' },      // 1階右下窓
];

// 空いている窓を取得する関数
export const getAvailableWindow = (existingChores: Chore[]): { x: number; y: number } | null => {
  const occupiedPositions = existingChores
    .filter(chore => chore.position)
    .map(chore => ({ x: chore.position!.x, y: chore.position!.y }));

  for (const window of WINDOW_POSITIONS) {
    const isOccupied = occupiedPositions.some(
      pos => Math.abs(pos.x - window.x) < 5 && Math.abs(pos.y - window.y) < 5
    );
    
    if (!isOccupied) {
      return { x: window.x, y: window.y };
    }
  }
  
  return null; // すべての窓が埋まっている場合
};

// 家事を窓の位置に自動配置する関数
export const assignWindowPositions = (chores: Chore[]): Chore[] => {
  const positionedChores = chores.filter(chore => chore.position);
  
  return positionedChores.map((chore, index) => {
    // 既存のpositionが窓の位置に近い場合はそのまま、そうでなければ新しい窓位置を割り当て
    const isNearWindow = WINDOW_POSITIONS.some(
      window => Math.abs(chore.position!.x - window.x) < 10 && Math.abs(chore.position!.y - window.y) < 10
    );
    
    if (isNearWindow) {
      return chore; // 既に窓の近くにある場合はそのまま
    }
    
    // 新しい窓位置を割り当て
    const windowIndex = index % WINDOW_POSITIONS.length;
    const windowPosition = WINDOW_POSITIONS[windowIndex];
    
    return {
      ...chore,
      position: { x: windowPosition.x, y: windowPosition.y }
    };
  });
};

// 家事が重複している場合の位置調整
export const adjustOverlappingPositions = (chores: Chore[]): Chore[] => {
  const positionedChores = chores.filter(chore => chore.position);
  const result: Chore[] = [];
  
  for (const chore of positionedChores) {
    let position = { ...chore.position! };
    
    // 他の家事と重複していないかチェック
    let attempts = 0;
    while (attempts < 20) { // 無限ループを防ぐ
      const isOverlapping = result.some(existingChore => 
        existingChore.position && 
        Math.abs(existingChore.position.x - position.x) < 8 && 
        Math.abs(existingChore.position.y - position.y) < 8
      );
      
      if (!isOverlapping) {
        break;
      }
      
      // 重複している場合は、利用可能な窓位置を探す
      const availableWindow = WINDOW_POSITIONS.find(window => 
        !result.some(existingChore => 
          existingChore.position && 
          Math.abs(existingChore.position.x - window.x) < 8 && 
          Math.abs(existingChore.position.y - window.y) < 8
        )
      );
      
      if (availableWindow) {
        position = { x: availableWindow.x, y: availableWindow.y };
        break;
      } else {
        // すべての窓が埋まっている場合は少しずらす
        position.x += 5;
        position.y += 3;
      }
      
      attempts++;
    }
    
    result.push({
      ...chore,
      position
    });
  }
  
  return [...result, ...chores.filter(chore => !chore.position)];
};