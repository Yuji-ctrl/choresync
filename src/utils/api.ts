// Supabaseの使用を停止し、ローカルデータベースに切り替え
// import { projectId, publicAnonKey } from './supabase/info';
import { db } from './database';

// Supabase API呼び出し（コメントアウト）
/*
export const callAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6c12ce20${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
};
*/

/**
 * ローカルデータベースを使用したAPI実装
 */
export const callAPI = async (endpoint: string, options: RequestInit = {}) => {
  // エンドポイントを解析して適切な処理を実行
  const method = options.method || 'GET';
  
  // bodyがFormDataの場合とJSONの場合で処理を分ける
  let body: any = null;
  if (options.body) {
    if (options.body instanceof FormData) {
      body = options.body;
    } else if (typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body);
      } catch {
        body = options.body;
      }
    } else {
      body = options.body;
    }
  }

  try {
    // 写真アップロード
    if (endpoint === '/photos/upload' && method === 'POST') {
      return await uploadPhotos(body);
    }

    // 写真一覧取得
    if (endpoint === '/photos' && method === 'GET') {
      return await getPhotos();
    }

    // 写真コメント更新
    if (endpoint.startsWith('/photos/') && endpoint.endsWith('/comment') && method === 'PUT') {
      const photoId = endpoint.split('/')[2];
      return await updatePhotoComment(photoId, body);
    }

    // メッセージ送信
    if (endpoint === '/messages' && method === 'POST') {
      return await sendMessage(body);
    }

    // メッセージ取得
    if (endpoint === '/messages' && method === 'GET') {
      return await getMessages();
    }

    // 家事データ取得
    if (endpoint === '/chores' && method === 'GET') {
      return await getChores();
    }

    // 家事データ保存
    if (endpoint === '/chores' && method === 'POST') {
      return await saveChore(body);
    }

    // 家事データ更新
    if (endpoint.startsWith('/chores/') && method === 'PUT') {
      const choreId = endpoint.split('/')[2];
      return await updateChore(choreId, body);
    }

    // 家事データ削除
    if (endpoint.startsWith('/chores/') && method === 'DELETE') {
      const choreId = endpoint.split('/')[2];
      return await deleteChore(choreId);
    }

    // 設定取得
    if (endpoint === '/settings' && method === 'GET') {
      return await getSettings();
    }

    // 設定保存
    if (endpoint === '/settings' && method === 'PUT') {
      return await saveSettings(body);
    }

    throw new Error(`Unknown endpoint: ${method} ${endpoint}`);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 写真アップロード処理（FormDataとして受け取る）
async function uploadPhotos(data: any) {
  // bodyが実際のFormDataオブジェクトの場合
  if (data instanceof FormData) {
    return await uploadPhotosFromFormData(data);
  }
  
  // JSONから送られてきた場合（Fileオブジェクトを含む）
  const { files, choreId, comment, userId, userName } = data;
  
  if (!files || files.length === 0 || !choreId) {
    throw new Error('ファイルと家事IDが必要です');
  }

  const imageUrls: string[] = [];
  const timestamp = Date.now();
  const storageBucket = db.getStorageBucket('photos');

  // 複数のファイルをアップロード
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${choreId}/${timestamp}_${i}`;
    
    try {
      const { url } = await storageBucket.upload(fileName, file);
      imageUrls.push(url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }

  if (imageUrls.length === 0) {
    throw new Error('すべてのファイルのアップロードに失敗しました');
  }

  // 写真データを保存
  const photoData = {
    id: timestamp.toString(),
    choreId,
    imageUrls,
    comment: comment || '',
    takenAt: new Date().toISOString(),
    takenBy: userId || '2',
    takenByName: userName || 'お父さん',
  };

  await db.set(`photo:${photoData.id}`, photoData);
  
  return { photo: photoData };
}

// FormDataから直接アップロード
async function uploadPhotosFromFormData(formData: FormData) {
  const files = formData.getAll('files') as File[];
  const choreId = formData.get('choreId') as string;
  const comment = formData.get('comment') as string || '';
  const userId = formData.get('userId') as string || '2';
  const userName = formData.get('userName') as string || 'お父さん';
  
  return uploadPhotos({ files, choreId, comment, userId, userName });
}

// 写真一覧取得
async function getPhotos() {
  const photos = await db.getByPrefix('photo:');
  return { 
    photos: photos.sort((a: any, b: any) => 
      new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    )
  };
}

// 写真コメント更新
async function updatePhotoComment(photoId: string, body: any) {
  const { comment } = body;
  const photo = await db.get(`photo:${photoId}`);
  
  if (!photo) {
    throw new Error('写真が見つかりません');
  }

  const updatedPhoto = { ...photo, comment };
  await db.set(`photo:${photoId}`, updatedPhoto);
  
  return { photo: updatedPhoto };
}

// メッセージ送信
async function sendMessage(body: any) {
  const { userId, userName, text, imageUrl } = body;

  const message = {
    id: Date.now().toString(),
    userId,
    userName,
    text,
    imageUrl: imageUrl || '',
    timestamp: new Date().toISOString(),
    isMe: false,
  };

  await db.set(`message:${message.id}`, message);
  
  return { message };
}

// メッセージ取得
async function getMessages() {
  const messages = await db.getByPrefix('message:');
  return { 
    messages: messages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  };
}

// 家事データ取得
async function getChores() {
  const chores = await db.getByPrefix('chore:');
  return { chores };
}

// 家事データ保存
async function saveChore(chore: any) {
  await db.set(`chore:${chore.id}`, chore);
  return { chore };
}

// 家事データ更新
async function updateChore(choreId: string, updates: any) {
  const existingChore = await db.get(`chore:${choreId}`);
  
  if (!existingChore) {
    throw new Error('家事が見つかりません');
  }

  const updatedChore = { ...existingChore, ...updates };
  await db.set(`chore:${choreId}`, updatedChore);
  
  return { chore: updatedChore };
}

// 家事データ削除
async function deleteChore(choreId: string) {
  await db.delete(`chore:${choreId}`);
  return { success: true };
}

// 設定取得
async function getSettings() {
  const settings = await db.get('app_settings') || {
    darkMode: false,
    fontSize: 'medium',
    notifications: true,
    soundEnabled: true,
    familySharing: false,
    autoBackup: true,
    language: 'ja',
  };
  return { settings };
}

// 設定保存
async function saveSettings(settings: any) {
  await db.set('app_settings', settings);
  return { settings };
}