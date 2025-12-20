/**
 * オブジェクト指向ローカルデータベース
 * LocalStorageとメモリを使用したデータ管理システム
 */

// データベースのインターフェース定義
interface IDatabase {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  getByPrefix<T>(prefix: string): Promise<T[]>;
  clear(): Promise<void>;
}

// ストレージバケットのインターフェース
interface IStorageBucket {
  upload(path: string, file: File): Promise<{ path: string; url: string }>;
  getSignedUrl(path: string): Promise<string>;
  delete(path: string): Promise<void>;
}

/**
 * LocalStorageベースのデータベース実装
 */
class LocalDatabase implements IDatabase {
  private static instance: LocalDatabase;
  private prefix = 'app_db_';

  private constructor() {
    this.initDatabase();
  }

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  private initDatabase(): void {
    // データベースの初期化（必要に応じて）
    console.log('LocalDatabase initialized');
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async getByPrefix<T>(prefix: string): Promise<T[]> {
    try {
      const results: T[] = [];
      const fullPrefix = this.prefix + prefix;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
          const data = localStorage.getItem(key);
          if (data) {
            results.push(JSON.parse(data));
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error(`Error getting by prefix ${prefix}:`, error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  // ユーティリティメソッド：全てのキーを取得
  async getAllKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }
}

/**
 * LocalStorageベースのストレージバケット実装
 */
class LocalStorageBucket implements IStorageBucket {
  private bucketName: string;
  private db: LocalDatabase;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.db = LocalDatabase.getInstance();
  }

  async upload(path: string, file: File): Promise<{ path: string; url: string }> {
    try {
      // ファイルをBase64に変換
      const base64 = await this.fileToBase64(file);
      
      const fileData = {
        path,
        data: base64,
        type: file.type,
        size: file.size,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };

      // ストレージキーに保存
      const storageKey = `storage:${this.bucketName}:${path}`;
      await this.db.set(storageKey, fileData);

      // データURLを返す
      const url = base64;
      return { path, url };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getSignedUrl(path: string): Promise<string> {
    try {
      const storageKey = `storage:${this.bucketName}:${path}`;
      const fileData = await this.db.get<any>(storageKey);
      
      if (!fileData) {
        throw new Error('File not found');
      }

      return fileData.data;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    try {
      const storageKey = `storage:${this.bucketName}:${path}`;
      await this.db.delete(storageKey);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

/**
 * データベースマネージャー（Singleton）
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: LocalDatabase;
  private storageBuckets: Map<string, LocalStorageBucket>;

  private constructor() {
    this.db = LocalDatabase.getInstance();
    this.storageBuckets = new Map();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // KVストア操作
  async get<T>(key: string): Promise<T | null> {
    return this.db.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return this.db.set(key, value);
  }

  async delete(key: string): Promise<void> {
    return this.db.delete(key);
  }

  async getByPrefix<T>(prefix: string): Promise<T[]> {
    return this.db.getByPrefix<T>(prefix);
  }

  async clear(): Promise<void> {
    return this.db.clear();
  }

  // ストレージバケット操作
  getStorageBucket(bucketName: string): LocalStorageBucket {
    if (!this.storageBuckets.has(bucketName)) {
      this.storageBuckets.set(bucketName, new LocalStorageBucket(bucketName));
    }
    return this.storageBuckets.get(bucketName)!;
  }

  // ユーティリティ：データベース全体のエクスポート
  async exportAll(): Promise<Record<string, any>> {
    const keys = await this.db.getAllKeys();
    const data: Record<string, any> = {};
    
    for (const key of keys) {
      data[key] = await this.db.get(key);
    }
    
    return data;
  }

  // ユーティリティ：データベース全体のインポート
  async importAll(data: Record<string, any>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      await this.db.set(key, value);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const db = DatabaseManager.getInstance();