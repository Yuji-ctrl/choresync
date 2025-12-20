import { Chore, ChorePhoto, FamilyMember, Message, Tip } from '../types';

export const initialChores: Chore[] = [
  {
    id: '1',
    name: '洗濯物を回す',
    icon: '👕',
    position: { x: 20, y: 30 }, // 2階左窓
    isCompleted: true,
    notificationTime: '06:30',
    completedAt: new Date(Date.now() - 7200000),
    completedBy: '1',
    completedByName: 'お母さん',
    timeSpent: 25,
    estimatedTime: 30,
    assignedTo: '1',
    assignedToName: 'お母さん',
    location: '洗面所',
    description: '洗濯機を回して洗濯物を干す',
  },
  {
    id: '2',
    name: 'お米を炊く',
    icon: '🍚',
    position: { x: 72, y: 30 }, // 2階右窓
    isCompleted: false,
    notificationTime: '07:00',
    estimatedTime: 5,
    assignedTo: '2',
    assignedToName: 'お父さん',
    location: 'キッチン',
    description: '毎朝のお米を炊きます',
  },
  {
    id: '3',
    name: '植物の水やり',
    icon: '🌱',
    position: { x: 28, y: 50 }, // 1階左窓
    isCompleted: false,
    notificationTime: '08:00',
    estimatedTime: 10,
    assignedTo: '1',
    assignedToName: 'お母さん',
    location: 'ベランダ',
    description: '観葉植物とベランダの花に水やり',
  },
  {
    id: '4',
    name: '掃除機をかける',
    icon: '🧹',
    position: { x: 50, y: 50 }, // 1階中央窓
    isCompleted: false,
    notificationTime: '09:00',
    estimatedTime: 15,
    assignedTo: '3',
    assignedToName: '太郎',
    location: 'リビング',
    description: 'リビングと寝室に掃除機をかける',
  },
  {
    id: '5',
    name: 'お風呂掃除',
    icon: '🚿',
    position: { x: 72, y: 50 }, // 1階右窓
    isCompleted: false,
    notificationTime: '19:00',
    estimatedTime: 20,
    assignedTo: '2',
    assignedToName: 'お父さん',
    location: 'バスルーム',
    description: '浴槽とシャワーの掃除',
  },
  {
    id: '6',
    name: 'ゴミ出し',
    icon: '🗑️',
    position: { x: 28, y: 70 }, // 1階左下窓
    isCompleted: false,
    notificationTime: '07:30',
    estimatedTime: 5,
    assignedTo: '2',
    assignedToName: 'お父さん',
    location: '玄関',
    description: '燃えるゴミを集積場に出す',
  },
  {
    id: '7',
    name: '食器洗い',
    icon: '🍽️',
    position: { x: 72, y: 70 }, // 1階右下窓
    isCompleted: false,
    notificationTime: '20:00',
    estimatedTime: 10,
    assignedTo: '3',
    assignedToName: '太郎',
    location: 'キッチン',
    description: '夕食後の食器を洗う',
  },
  {
    id: '8',
    name: '洗濯物を畳む',
    icon: '👔',
    position: null, // 窓に配置しない
    isCompleted: false,
    notificationTime: '15:00',
    estimatedTime: 15,
    assignedTo: '1',
    assignedToName: 'お母さん',
    location: 'リビング',
    description: '乾いた洗濯物を畳んでしまう',
  },
  {
    id: '9',
    name: 'ワンちゃんの散歩',
    icon: '🐕',
    position: null,
    isCompleted: false,
    notificationTime: '18:00',
    estimatedTime: 30,
    assignedTo: '2',
    assignedToName: 'お父さん',
    location: '近所',
    description: 'ワンちゃんと一緒に散歩する',
  },
  {
    id: '10',
    name: '猫のトイレ掃除',
    icon: '🐈',
    position: null,
    isCompleted: false,
    notificationTime: '21:00',
    estimatedTime: 10,
    assignedTo: '1',
    assignedToName: 'お母さん',
    location: 'トイレ',
    description: '猫のトイレの砂を交換する',
  },
];

export const generateSampleChoreHistory = (): Chore[] => {
  const sampleHistory: Chore[] = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    
    sampleHistory.push({
      id: `sample-rice-${i}`,
      name: 'お米を炊く',
      icon: '🍚',
      position: { x: 65, y: 35 },
      isCompleted: true,
      completedAt: new Date(date.getTime() + (7 * 60 * 60 * 1000)),
      completedBy: i % 2 === 0 ? '1' : '2',
      completedByName: i % 2 === 0 ? 'お母さん' : 'お父さん',
      timeSpent: 5 + Math.floor(Math.random() * 5),
      estimatedTime: 5,
      notificationTime: '07:00',
      location: 'キッチン',
      description: '毎朝のお米を炊きます',
    });
    
    sampleHistory.push({
      id: `sample-dishes-${i}`,
      name: '食器洗い',
      icon: '🍽️',
      position: { x: 35, y: 80 },
      isCompleted: true,
      completedAt: new Date(date.getTime() + (20 * 60 * 60 * 1000)),
      completedBy: i % 3 === 0 ? '3' : (i % 2 === 0 ? '1' : '2'),
      completedByName: i % 3 === 0 ? '太郎' : (i % 2 === 0 ? 'お母さん' : 'お父さん'),
      timeSpent: 8 + Math.floor(Math.random() * 7),
      estimatedTime: 10,
      notificationTime: '20:00',
      location: 'キッチン',
      description: '夕食後の食器を洗う',
    });
    
    if (i % 2 === 0) {
      sampleHistory.push({
        id: `sample-vacuum-${i}`,
        name: '掃除機をかける',
        icon: '🧹',
        position: { x: 65, y: 50 },
        isCompleted: true,
        completedAt: new Date(date.getTime() + (9 * 60 * 60 * 1000)),
        completedBy: i % 2 === 0 ? '2' : '1',
        completedByName: i % 2 === 0 ? 'お父さん' : 'お母さん',
        timeSpent: 12 + Math.floor(Math.random() * 8),
        estimatedTime: 15,
        notificationTime: '09:00',
        location: 'リビング',
        description: 'リビングと寝室に掃除機をかける',
      });
    }
    
    if (i % 3 === 0) {
      sampleHistory.push({
        id: `sample-bath-${i}`,
        name: 'お風呂掃除',
        icon: '🚿',
        position: { x: 35, y: 65 },
        isCompleted: true,
        completedAt: new Date(date.getTime() + (19 * 60 * 60 * 1000)),
        completedBy: i % 2 === 0 ? '1' : '2',
        completedByName: i % 2 === 0 ? 'お母さん' : 'お父さん',
        timeSpent: 18 + Math.floor(Math.random() * 10),
        estimatedTime: 20,
        notificationTime: '19:00',
        location: 'バスルーム',
        description: '浴槽とシャワーの掃除',
      });
    }
  }
  
  return sampleHistory;
};

export const samplePhotos: ChorePhoto[] = [
  {
    id: 'sample1',
    choreId: '2',
    imageUrls: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
      'https://images.unsplash.com/photo-1533421821268-87e42c076d7e?w=500'
    ],
    comment: '今日のお米は特にふっくら炊けました！新しいお米を使ったからかな。炊く前と炊いた後の比較写真です。',
    takenAt: new Date('2024-01-15T07:30:00'),
    takenBy: '2',
    takenByName: 'お父さん',
  },
  {
    id: 'sample2', 
    choreId: '3',
    imageUrls: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500',
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500'
    ],
    comment: 'ベランダの花たちも元気です🌸 水やりのビフォー・アフターと全体の様子です。',
    takenAt: new Date('2024-01-15T08:15:00'),
    takenBy: '1',
    takenByName: 'お母さん',
  },
  {
    id: 'sample3',
    choreId: '5',
    imageUrls: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500'
    ],
    comment: 'お風呂掃除完了！カビ防止スプレーも使いました。',
    takenAt: new Date('2024-01-14T19:45:00'),
    takenBy: '1',
    takenByName: 'お母さん',
  },
  {
    id: 'sample4',
    choreId: '7',
    imageUrls: [
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500',
      'https://images.unsplash.com/photo-1584536588095-c6b326378e78?w=500',
      'https://images.unsplash.com/photo-1610828913717-7c6c7bf4a952?w=500',
      'https://images.unsplash.com/photo-1556909114-6f52e73e9ad1?w=500'
    ],
    comment: 'ピカピカになりました✨ 洗う前、洗った後、乾燥中、片付け完了の4段階で記録しました！',
    takenAt: new Date('2024-01-14T20:15:00'),
    takenBy: '3',
    takenByName: '太郎',
  },
];

export const sampleTips: Tip[] = [
  {
    id: '1',
    title: 'キッチンの油汚れを簡単に落とす方法',
    content: '重曹とお酢を使った自然派クリーナーで、頑固な油汚れもスッキリ落ちます。重曹大さじ2とお酢大さじ1を混ぜて使用してください。\n\n作り方：\n1. 重曹をスポンジに付ける\n2. お酢をスプレーで吹きかける\n3. 泡立ったら軽くこすって水で流す\n\nこの方法なら化学洗剤を使わずに安全に掃除できます。',
    category: 'kitchen',
    readTime: '3分',
    imageUrl: 'https://images.unsplash.com/photo-1714058973555-a255930b9a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwY2xlYW5pbmclMjB0aXBzfGVufDF8fHx8MTc1Njk1NzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['重曹', '自然派', '油汚れ'],
    likes: 24,
    isLiked: false,
    publishedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    title: '洗濯物を早く乾かす裏技',
    content: '梅雨の時期や冬場に洗濯物がなかなか乾かない時の対処法をご紹介します。\n\n1. タオルを一緒に回す：厚手のタオルを一緒に洗濯機で回すと、水分を吸収してくれます。\n\n2. アーチ干し：長いものを外側に、短いものを内側にして風の通りを良くします。\n\n3. 扇風機を活用：扇風機の風を直接当てることで乾燥時間が半分になります。',
    category: 'laundry',
    readTime: '2分',
    imageUrl: 'https://images.unsplash.com/photo-1603057360282-927e9eca0d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwZHJ5aW5nJTIwdGlwc3xlbnwxfHx8fDE3NTY5NTcxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['時短', '部屋干し', '乾燥'],
    likes: 18,
    isLiked: true,
    publishedAt: new Date('2024-11-25'),
  },
  {
    id: '3',
    title: '15分で部屋がスッキリ！片付けのコツ',
    content: '忙しい日常でも短時間で部屋を整理整頓できる方法をお教えします。\n\n「15分ルール」を実践してみましょう：\n\n1. タイマーを15分にセット\n2. 一番気になる場所から始める\n3. 「使う・使わない・迷う」の3つに分類\n4. 使わないものはすぐに処分または移動\n\n毎日続けることで、常にキレイな状態をキープできます。',
    category: 'organization',
    readTime: '4分',
    imageUrl: 'https://images.unsplash.com/photo-1687953413905-731f620177ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb3JnYW5pemF0aW9ufGVufDF8fHx8MTc1Njk1NzIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['片付け', '時短', '整理整頓'],
    likes: 32,
    isLiked: false,
    publishedAt: new Date('2024-11-20'),
  },
];

export const sampleFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'お母さん', lastSeen: new Date() },
  { id: '2', name: 'お父さん', lastSeen: new Date(Date.now() - 3600000) },
  { id: '3', name: '太郎', lastSeen: new Date(Date.now() - 7200000) },
];

export const sampleMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    userName: 'お母さん',
    text: 'お父さん、お疲れ様！洗濯が終わったので、干すのをお願いできる？',
    timestamp: new Date(Date.now() - 3600000),
    isMe: false,
  },
  {
    id: '2',
    userId: '1',
    userName: 'お母さん',
    text: 'ベランダに干し竿を準備しておきました。よろしくお願いします🙏',
    timestamp: new Date(Date.now() - 3500000),
    isMe: false,
  },
  {
    id: '3',
    userId: '2',
    userName: 'お父さん',
    text: 'わかりました！今から干しますね',
    timestamp: new Date(Date.now() - 1800000),
    isMe: true,
  },
];