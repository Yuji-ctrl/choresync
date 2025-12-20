import { useEffect } from 'react';
import { callAPI } from '../utils/api';
import { Chore, ChorePhoto, Message, AppSettings } from '../types';

interface UseDataPersistenceProps {
  chores: Chore[];
  photos: ChorePhoto[];
  messages: Message[];
  settings: AppSettings;
  setChores: (chores: Chore[]) => void;
  setPhotos: (photos: ChorePhoto[]) => void;
  setMessages: (messages: Message[]) => void;
  setSettings: (settings: AppSettings) => void;
}

/**
 * データの永続化と初期ロードを管理するフック
 */
export const useDataPersistence = ({
  chores,
  photos,
  messages,
  settings,
  setChores,
  setPhotos,
  setMessages,
  setSettings,
}: UseDataPersistenceProps) => {
  // 初期データのロード
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 家事データの読み込み
        const { chores: loadedChores } = await callAPI('/chores', { method: 'GET' });
        if (loadedChores && loadedChores.length > 0) {
          setChores(loadedChores);
        }

        // 写真データの読み込み
        const { photos: loadedPhotos } = await callAPI('/photos', { method: 'GET' });
        if (loadedPhotos && loadedPhotos.length > 0) {
          setPhotos(loadedPhotos);
        }

        // メッセージの読み込み
        const { messages: loadedMessages } = await callAPI('/messages', { method: 'GET' });
        if (loadedMessages && loadedMessages.length > 0) {
          setMessages(loadedMessages);
        }

        // 設定の読み込み
        const { settings: loadedSettings } = await callAPI('/settings', { method: 'GET' });
        if (loadedSettings) {
          setSettings(loadedSettings);
        }

        console.log('データの初期ロード完了');
      } catch (error) {
        console.error('データのロードエラー:', error);
      }
    };

    loadInitialData();
  }, []); // 初回マウント時のみ実行

  // 家事データの自動保存
  useEffect(() => {
    const saveChores = async () => {
      try {
        for (const chore of chores) {
          await callAPI('/chores', {
            method: 'POST',
            body: JSON.stringify(chore),
          });
        }
      } catch (error) {
        console.error('家事データの保存エラー:', error);
      }
    };

    // データが変更されたら保存（デバウンス付き）
    const timeoutId = setTimeout(() => {
      if (chores.length > 0) {
        saveChores();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [chores]);

  // 設定の自動保存
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await callAPI('/settings', {
          method: 'PUT',
          body: JSON.stringify(settings),
        });
      } catch (error) {
        console.error('設定の保存エラー:', error);
      }
    };

    // 設定が変更されたら保存（デバウンス付き）
    const timeoutId = setTimeout(() => {
      saveSettings();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [settings]);
};