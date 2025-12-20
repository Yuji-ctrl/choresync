import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Timer, Star, Trophy, X } from 'lucide-react';

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'memory' | 'puzzle' | 'quiz' | null;
  playTimeSeconds: number;
  onGameComplete: (score: number, bonusPoints: number) => void;
}

// 記憶ゲーム用
const memoryCards = ['🍎', '🌟', '🎵', '🚀', '🌈', '⚡'];

// クイズデータ
const quizQuestions = [
  {
    question: 'お米を美味しく炊くコツは？',
    options: ['強火で短時間', '水は少なめ', 'お米を研ぐ', '塩を入れる'],
    correct: 2,
    explanation: 'お米をしっかり研ぐことで、ぬかや汚れが取れて美味しく炊けます！'
  },
  {
    question: '洗濯物を早く乾かすには？',
    options: ['重ねて干す', '風通しを良く', '日陰に干す', '洗剤を多く'],
    correct: 1,
    explanation: '風通しの良い場所に干すことで、水分が早く蒸発します！'
  },
  {
    question: 'お風呂掃除のベストタイミングは？',
    options: ['お風呂の前', '入浴直後', '翌日の朝', 'いつでも同じ'],
    correct: 1,
    explanation: 'お湯が温かいうちに掃除すると、汚れが落ちやすくなります！'
  }
];

export function MiniGameModal({ 
  isOpen, 
  onClose, 
  gameType, 
  playTimeSeconds, 
  onGameComplete 
}: MiniGameModalProps) {
  const [timeLeft, setTimeLeft] = useState(playTimeSeconds);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'timeout'>('playing');
  const [score, setScore] = useState(0);
  
  // 記憶ゲーム用state
  const [memoryGameCards, setMemoryGameCards] = useState<{id: number, emoji: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  
  // クイズゲーム用state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // タイマー
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gameState]);

  // ゲーム初期化
  useEffect(() => {
    if (!isOpen || !gameType) return;

    setTimeLeft(playTimeSeconds);
    setGameState('playing');
    setScore(0);

    if (gameType === 'memory') {
      const shuffledCards = [...memoryCards, ...memoryCards]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false,
        }));
      setMemoryGameCards(shuffledCards);
      setFlippedCards([]);
      setMatchedPairs(0);
    } else if (gameType === 'quiz') {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setCorrectAnswers(0);
    }
  }, [isOpen, gameType, playTimeSeconds]);

  // 記憶ゲーム：カードクリック
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || 
        flippedCards.includes(cardId) || 
        memoryGameCards[cardId].matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // カードを反転
    setMemoryGameCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, flipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (memoryGameCards[first].emoji === memoryGameCards[second].emoji) {
        // マッチした場合
        setTimeout(() => {
          setMemoryGameCards(prev => prev.map(card =>
            card.id === first || card.id === second ? { ...card, matched: true } : card
          ));
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + 100);
          setFlippedCards([]);
        }, 500);
      } else {
        // マッチしなかった場合
        setTimeout(() => {
          setMemoryGameCards(prev => prev.map(card =>
            card.id === first || card.id === second ? { ...card, flipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // クイズゲーム：回答選択
  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 50);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setGameState('completed');
      }
    }, 2000);
  };

  // ゲーム完了処理
  useEffect(() => {
    if (gameState === 'completed' || gameState === 'timeout') {
      const bonusPoints = Math.floor(score / 10);
      onGameComplete(score, bonusPoints);
    }
  }, [gameState]); // scoreとonGameCompleteを依存配列から削除してループを防ぐ

  // ゲーム終了時の表示
  if (gameState === 'completed' || gameState === 'timeout') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {gameState === 'completed' ? 'ゲームクリア！' : 'タイムアップ！'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {gameState === 'completed' ? 'おめでとうございます！' : '時間切れです'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="text-4xl">
              {gameState === 'completed' ? '🎉' : '⏰'}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{score}点</div>
              <div className="text-sm text-gray-600">
                ボーナスポイント: {Math.floor(score / 10)}pt獲得！
              </div>
            </div>

            {gameType === 'memory' && (
              <div className="text-sm text-gray-600">
                {matchedPairs}/{memoryCards.length}ペア完成
              </div>
            )}

            {gameType === 'quiz' && (
              <div className="text-sm text-gray-600">
                {correctAnswers}/{quizQuestions.length}問正解
              </div>
            )}

            <Button onClick={onClose} className="w-full">
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!gameType) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {gameType === 'memory' && '記憶ゲーム'}
              {gameType === 'puzzle' && 'パズル'}
              {gameType === 'quiz' && '家事クイズ'}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {gameType === 'memory' && '同じ絵柄のカードを見つけてペアを作ろう！'}
            {gameType === 'puzzle' && 'パズルを完成させよう！'}
            {gameType === 'quiz' && '家事に関するクイズに挑戦しよう！'}
          </DialogDescription>
        </DialogHeader>

        {/* 共通ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{score}点</span>
          </div>
        </div>

        <Progress value={((playTimeSeconds - timeLeft) / playTimeSeconds) * 100} className="mb-4" />

        {/* ゲーム内容 */}
        <div className="space-y-4">
          {gameType === 'memory' && (
            <div>
              <div className="text-center mb-4">
                <Badge>{matchedPairs}/{memoryCards.length}ペア完成</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {memoryGameCards.map((card) => (
                  <Card
                    key={card.id}
                    className={`aspect-square flex items-center justify-center text-2xl cursor-pointer transition-all ${
                      card.flipped || card.matched
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } ${card.matched ? 'opacity-75' : ''}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {card.flipped || card.matched ? card.emoji : '?'}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {gameType === 'quiz' && (
            <div className="space-y-4">
              <div className="text-center">
                <Badge>問題 {currentQuestion + 1}/{quizQuestions.length}</Badge>
              </div>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{quizQuestions[currentQuestion].question}</h3>
                
                <div className="space-y-2">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === null ? 'outline' :
                        index === quizQuestions[currentQuestion].correct ? 'default' :
                        index === selectedAnswer ? 'destructive' : 'outline'
                      }
                      className="w-full text-left justify-start"
                      onClick={() => handleQuizAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {showExplanation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {quizQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {gameType === 'puzzle' && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🧩</div>
              <p className="text-gray-600">
                パズルゲームは開発中です！<br />
                今しばらくお待ちください 🚧
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}