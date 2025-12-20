/*
 * Supabaseバックエンドを停止しました
 * ローカルデータベース（LocalStorage）を使用するように変更されています
 * 
 * このファイルは参考用に残していますが、使用されていません
 */

/*
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// バケット作成の確認
const ensureBucket = async (bucketName: string) => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false })
      console.log(`Created bucket: ${bucketName}`)
    }
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName}:`, error)
  }
}

// 起動時にバケットを作成
await ensureBucket('make-6c12ce20-photos')

// 写真アップロード（複数枚対応）
app.post('/make-server-6c12ce20/photos/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    const choreId = formData.get('choreId') as string
    const comment = formData.get('comment') as string || ''
    const userId = formData.get('userId') as string || '2'
    const userName = formData.get('userName') as string || 'お父さん'
    
    if (!files.length || !choreId) {
      return c.json({ error: 'ファイルと家事IDが必要です' }, 400)
    }

    const imageUrls: string[] = []
    const timestamp = Date.now()

    // 複数のファイルをアップロード
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${choreId}/${timestamp}_${i}.${fileExt}`
      
      // Supabase Storageにアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('make-6c12ce20-photos')
        .upload(fileName, file)
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue // エラーがあってもスキップして次のファイルを処理
      }

      // 署名付きURLを生成
      const { data: urlData } = await supabase.storage
        .from('make-6c12ce20-photos')
        .createSignedUrl(fileName, 365 * 24 * 60 * 60) // 1年間有効

      if (urlData?.signedUrl) {
        imageUrls.push(urlData.signedUrl)
      }
    }

    if (imageUrls.length === 0) {
      return c.json({ error: 'すべてのファイルのアップロードに失敗しました' }, 500)
    }

    // 写真データを保存（新しい形式）
    const photoData = {
      id: timestamp.toString(),
      choreId,
      imageUrls,
      comment,
      takenAt: new Date().toISOString(),
      takenBy: userId,
      takenByName: userName,
    }

    await kv.set(`photo:${photoData.id}`, photoData)
    
    return c.json({ photo: photoData })
  } catch (error) {
    console.error('Error uploading photos:', error)
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// 写真一覧取得
app.get('/make-server-6c12ce20/photos', async (c) => {
  try {
    const photos = await kv.getByPrefix('photo:')
    return c.json({ photos: photos.sort((a, b) => 
      new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    )})
  } catch (error) {
    console.error('Error fetching photos:', error)
    return c.json({ error: 'データの取得に失敗しました' }, 500)
  }
})

// 写真コメント更新
app.put('/make-server-6c12ce20/photos/:id/comment', async (c) => {
  try {
    const photoId = c.req.param('id')
    const { comment } = await c.req.json()
    
    const photo = await kv.get(`photo:${photoId}`)
    if (!photo) {
      return c.json({ error: '写真が見つかりません' }, 404)
    }

    const updatedPhoto = { ...photo, comment }
    await kv.set(`photo:${photoId}`, updatedPhoto)
    
    return c.json({ photo: updatedPhoto })
  } catch (error) {
    console.error('Error updating photo comment:', error)
    return c.json({ error: 'コメントの更新に失敗しました' }, 500)
  }
})

// メッセージ送信
app.post('/make-server-6c12ce20/messages', async (c) => {
  try {
    const { userId, userName, text, imageFile } = await c.req.json()
    
    let imageUrl = ''
    if (imageFile) {
      // 画像がある場合の処理（簡単な実装）
      const fileName = `messages/${Date.now()}.jpg`
      // 実際のファイルアップロード処理はクライアント側で行う
    }

    const message = {
      id: Date.now().toString(),
      userId,
      userName,
      text,
      imageUrl,
      timestamp: new Date().toISOString(),
      isMe: false, // サーバー側では判定しない
    }

    // メッセージを保存
    await kv.set(`message:${message.id}`, message)
    
    return c.json({ message })
  } catch (error) {
    console.error('Error sending message:', error)
    return c.json({ error: 'メッセージの送信に失敗しました' }, 500)
  }
})

// メッセージ取得
app.get('/make-server-6c12ce20/messages', async (c) => {
  try {
    const messages = await kv.getByPrefix('message:')
    return c.json({ 
      messages: messages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return c.json({ error: 'メッセージの取得に失敗しました' }, 500)
  }
})

// 家事データの保存・取得
app.get('/make-server-6c12ce20/chores', async (c) => {
  try {
    const chores = await kv.getByPrefix('chore:')
    return c.json({ chores })
  } catch (error) {
    console.error('Error fetching chores:', error)
    return c.json({ error: 'データの取得に失敗しました' }, 500)
  }
})

app.post('/make-server-6c12ce20/chores', async (c) => {
  try {
    const chore = await c.req.json()
    await kv.set(`chore:${chore.id}`, chore)
    return c.json({ chore })
  } catch (error) {
    console.error('Error saving chore:', error)
    return c.json({ error: 'データの保存に失敗しました' }, 500)
  }
})

app.put('/make-server-6c12ce20/chores/:id', async (c) => {
  try {
    const choreId = c.req.param('id')
    const updates = await c.req.json()
    
    const existingChore = await kv.get(`chore:${choreId}`)
    if (!existingChore) {
      return c.json({ error: '家事が見つかりません' }, 404)
    }

    const updatedChore = { ...existingChore, ...updates }
    await kv.set(`chore:${choreId}`, updatedChore)
    
    return c.json({ chore: updatedChore })
  } catch (error) {
    console.error('Error updating chore:', error)
    return c.json({ error: 'データの更新に失敗しました' }, 500)
  }
})

app.delete('/make-server-6c12ce20/chores/:id', async (c) => {
  try {
    const choreId = c.req.param('id')
    await kv.del(`chore:${choreId}`)
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting chore:', error)
    return c.json({ error: 'データの削除に失敗しました' }, 500)
  }
})

// アプリ設定の保存・取得
app.get('/make-server-6c12ce20/settings', async (c) => {
  try {
    const settings = await kv.get('app_settings') || {
      darkMode: false,
      fontSize: 'medium',
      notifications: true,
      soundEnabled: true,
      familySharing: false,
      autoBackup: true,
      language: 'ja',
    }
    return c.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return c.json({ error: '設定の取得に失敗しました' }, 500)
  }
})

app.put('/make-server-6c12ce20/settings', async (c) => {
  try {
    const settings = await c.req.json()
    await kv.set('app_settings', settings)
    return c.json({ settings })
  } catch (error) {
    console.error('Error saving settings:', error)
    return c.json({ error: '設定の保存に失敗しました' }, 500)
  }
})

Deno.serve(app.fetch)
*/