# データベース移行ドキュメント

## 概要

このアプリケーションは、Supabaseバックエンドから**ローカルのオブジェクト指向データベース**に移行されました。

## 変更内容

### 1. 新しいデータベースシステム

#### `/utils/database.ts`
- `DatabaseManager`: シングルトンパターンを使用したデータベースマネージャークラス
- `LocalDatabase`: LocalStorageを使用したKVストア実装
- `LocalStorageBucket`: 画像などのバイナリファイルを保存するストレージバケット実装

#### 主な機能
- **KVストア操作**: `get()`, `set()`, `delete()`, `getByPrefix()`
- **ストレージバケット**: 画像をBase64形式でLocalStorageに保存
- **データのエクスポート/インポート**: データベース全体を JSON として保存・復元可能

### 2. APIレイヤーの変更

#### `/utils/api.ts`
- Supabase APIへの呼び出しをコメントアウト
- ローカルデータベースを使用する新しい実装に置き換え
- 既存のエンドポイントインターフェースを維持（互換性維持）

#### サポートしているエンドポイント
- `POST /photos/upload` - 写真のアップロード
- `GET /photos` - 写真一覧の取得
- `PUT /photos/:id/comment` - 写真コメントの更新
- `POST /messages` - メッセージの送信
- `GET /messages` - メッセージの取得
- `GET /chores` - 家事データの取得
- `POST /chores` - 家事データの保存
- `PUT /chores/:id` - 家事データの更新
- `DELETE /chores/:id` - 家事データの削除
- `GET /settings` - 設定の取得
- `PUT /settings` - 設定の保存

### 3. データ永続化

#### `/hooks/useDataPersistence.ts`
- アプリケーション起動時にLocalStorageからデータを自動読み込み
- データ変更時に自動保存（デバウンス機能付き）
- 家事データと設定を継続的に保存

### 4. Supabaseコードのコメントアウト

#### `/supabase/functions/server/index.tsx`
- Supabaseエッジファンクション全体をコメントアウト
- 参考用として残されている

#### `/hooks/usePhotos.ts`
- Supabase関連のimport文をコメントアウト
- ローカルAPI呼び出しに変更

## データ構造

### LocalStorageのキー構造

```
app_db_photo:{id}        - 写真データ
app_db_message:{id}      - メッセージデータ
app_db_chore:{id}        - 家事データ
app_db_app_settings      - アプリケーション設定
app_db_storage:photos:{path} - 画像ファイル（Base64）
```

### 写真データの構造
```typescript
{
  id: string,
  choreId: string,
  imageUrls: string[],      // Base64データURLの配列
  comment: string,
  takenAt: string,          // ISO日付文字列
  takenBy: string,          // ユーザーID
  takenByName: string       // ユーザー名
}
```

## 利点

1. **オフライン対応**: インターネット接続なしで完全に動作
2. **即座のレスポンス**: ネットワーク遅延がない
3. **シンプルな構造**: 外部依存なし
4. **プライバシー**: データはすべてブラウザ内に保存
5. **オブジェクト指向設計**: 拡張しやすいクラス構造

## 制限事項

1. **ストレージ容量**: LocalStorageの容量制限（通常5-10MB）
2. **単一デバイス**: データはブラウザローカルに保存（同期なし）
3. **画像サイズ**: 大きな画像はBase64変換により容量を消費
4. **データの永続性**: ブラウザのキャッシュクリアでデータが消失する可能性

## データのバックアップ

設定画面から「データをエクスポート」機能を使用して、データをJSONファイルとしてダウンロードできます。

## 今後の拡張案

1. **IndexedDB対応**: より大きなデータ容量をサポート
2. **圧縮機能**: 画像の圧縮によるストレージ効率の向上
3. **同期機能**: オプションでクラウド同期を追加
4. **データのインポート**: エクスポートしたJSONからデータを復元

## 開発者向けメモ

### データベースの使用方法

```typescript
import { db } from './utils/database';

// データの保存
await db.set('mykey', { data: 'value' });

// データの取得
const data = await db.get('mykey');

// プレフィックスで検索
const items = await db.getByPrefix('photo:');

// ストレージバケットの使用
const bucket = db.getStorageBucket('photos');
const { url } = await bucket.upload('path/to/file', fileObject);
```

### デバッグ

ブラウザの開発者ツール → Application → Local Storage で、保存されているデータを直接確認できます。