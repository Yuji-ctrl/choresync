import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Image, Camera, Gamepad2, BookOpen } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// 名前から適切なアバター文字を取得する関数
const getAvatarInitials = (name: string, allNames: string[] = []) => {
  if (!name) return '?';
  
  // 1文字目を取得
  const firstChar = name[0];
  
  // 同じ1文字目を持つ他の名前があるかチェック
  const conflictingNames = allNames.filter(n => n !== name && n[0] === firstChar);
  
  if (conflictingNames.length === 0) {
    // 競合がない場合は1文字目を返す
    return firstChar;
  } else {
    // 競合がある場合は2文字目も含める（2文字目がない場合は1文字目のみ）
    return name.length > 1 ? firstChar + name[1] : firstChar;
  }
};

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  imageUrl?: string;
  timestamp: Date;
  isMe: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: Date;
}

interface MessagesScreenProps {
  messages: Message[];
  familyMembers: FamilyMember[];
  currentUserId: string;
  onSendMessage: (text: string, imageFile?: File) => Promise<void>;
  onNavigateToGame?: () => void;
  onNavigateToTips?: () => void;
}

export function MessagesScreen({ 
  messages, 
  familyMembers, 
  currentUserId, 
  onSendMessage,
  onNavigateToGame,
  onNavigateToTips
}: MessagesScreenProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedImage) || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage, selectedImage || undefined);
      setNewMessage('');
      setSelectedImage(null);
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return '昨日 ' + messageDate.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageDate.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">家族チャット</h1>
            <div className="flex items-center gap-2 mt-2">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {getAvatarInitials(member.name, familyMembers.map(m => m.name))}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 便利機能ボタン */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onNavigateToGame}
              className="flex items-center gap-1"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs">ゲーム</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onNavigateToTips}
              className="flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs">知恵袋</span>
            </Button>
          </div>
        </div>
      </div>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">💬</div>
            <p className="text-gray-600">まだメッセージがありません</p>
            <p className="text-sm text-gray-500">家族と家事の情報を共有しましょう</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.isMe ? 'flex-row-reverse' : ''}`}>
                {!message.isMe && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback>
                      {getAvatarInitials(message.userName, familyMembers.map(m => m.name))}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`space-y-1 ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!message.isMe && (
                    <span className="text-xs text-gray-600 px-1">{message.userName}</span>
                  )}
                  
                  <div
                    className={`
                      rounded-2xl px-4 py-2 max-w-xs
                      ${message.isMe 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-gray-200'
                      }
                    `}
                  >
                    {message.imageUrl && (
                      <div className="mb-2">
                        <ImageWithFallback
                          src={message.imageUrl}
                          alt="共有画像"
                          className="w-full rounded-lg max-w-48"
                        />
                      </div>
                    )}
                    {message.text && (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                  
                  <span className={`text-xs text-gray-500 px-1 ${message.isMe ? 'text-right' : ''}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t p-4 pb-20">
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <ImageWithFallback
              src={URL.createObjectURL(selectedImage)}
              alt="選択された画像"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white hover:bg-gray-900"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Image className="w-5 h-5" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending}
            className="flex-1"
          />
          
          <Button 
            onClick={handleSend}
            disabled={isSending || (!newMessage.trim() && !selectedImage)}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}