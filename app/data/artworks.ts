export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  story: string;
  image: string;
  thumbnail: string;
  category: 'oil' | 'sketch' | 'mixed';
  featured: boolean;
  tags: string[];
}

export const artworks: Artwork[] = [
  {
    id: '1',
    title: '静谧的午后',
    artist: '李明轩',
    year: 2023,
    medium: '布面油画',
    dimensions: '80 × 60 cm',
    description: '这幅作品捕捉了一个宁静午后的光影变化，温暖的阳光透过窗棂洒在室内，营造出一种诗意的氛围。',
    story: '创作这幅画时，我正坐在工作室里，午后的阳光恰好透过百叶窗洒进来。那种光影的变化让我想起了童年时光，那些慵懒的夏日午后。我试图用画笔捕捉这种时光静止的感觉，让观者也能感受到那份宁静与美好。色彩的运用上，我选择了暖色调为主，冷色调为辅，营造出温暖而不失层次的视觉效果。',
    image: '/image/1.JPG',
    thumbnail: '/image/1.JPG',
    category: 'oil',
    featured: true,
    tags: ['风景', '光影', '室内', '温暖']
  },
  {
    id: '2',
    title: '城市印象',
    artist: '王雅琴',
    year: 2023,
    medium: '纸本素描',
    dimensions: '42 × 30 cm',
    description: '用简洁的线条勾勒出现代都市的轮廓，表现了城市的繁华与孤独并存的特质。',
    story: '这是我在咖啡厅里完成的一幅速写。透过玻璃窗看着外面车水马龙的街道，我被那种现代都市特有的节奏感所吸引。每个人都在匆忙地赶路，但又显得那么孤独。我用最简单的线条来表达这种复杂的情感，希望观者能从中感受到现代生活的双重性。',
    image: '/image/2.JPG',
    thumbnail: '/image/2.JPG',
    category: 'sketch',
    featured: false,
    tags: ['城市', '现代', '线条', '情感']
  },
  {
    id: '3',
    title: '花开时节',
    artist: '陈志华',
    year: 2022,
    medium: '布面油画',
    dimensions: '100 × 80 cm',
    description: '春天花园中盛开的花朵，色彩绚烂，生机盎然，展现了大自然的蓬勃生命力。',
    story: '每年春天，我都会到郊外的花园里写生。那些盛开的花朵总是能给我无限的灵感。这幅画是我在一个阳光明媚的早晨完成的，当时花园里的花朵正值盛开期，色彩层次丰富。我试图用厚涂的技法来表现花瓣的质感，让每一朵花都充满生命力。',
    image: '/image/3.JPG',
    thumbnail: '/image/3.JPG',
    category: 'oil',
    featured: true,
    tags: ['花卉', '春天', '色彩', '自然']
  },
  {
    id: '4',
    title: '人物肖像研究',
    artist: '张美丽',
    year: 2023,
    medium: '纸本炭笔',
    dimensions: '35 × 25 cm',
    description: '深入刻画人物的神态和情感，通过光影的处理展现人物内心的复杂性。',
    story: '这是我对人物肖像的一次深入探索。模特是我的朋友，她有着非常有趣的面部轮廓。我花了三个小时来观察她的表情变化，试图捕捉那种微妙的情感流露。炭笔的运用让我能够更好地表现光影的层次，每一个细节都经过了反复的推敲和修改。',
    image: '/image/4.JPG',
    thumbnail: '/image/4.JPG',
    category: 'sketch',
    featured: false,
    tags: ['肖像', '人物', '情感', '技法']
  },
  {
    id: '5',
    title: '抽象构成',
    artist: '刘建国',
    year: 2023,
    medium: '综合材料',
    dimensions: '120 × 90 cm',
    description: '运用抽象的形式语言，探索色彩与形状的关系，表达内心的情感世界。',
    story: '这幅作品是我对抽象艺术的一次尝试。我没有预设的主题，而是让情感引导画笔的走向。不同的色彩代表着不同的情绪状态，而形状的组合则反映了内心的冲突与和谐。整个创作过程就像是一次内心的对话，每一笔都是真实情感的流露。',
    image: '/image/5.JPG',
    thumbnail: '/image/5.JPG',
    category: 'mixed',
    featured: true,
    tags: ['抽象', '色彩', '情感', '实验']
  },
  {
    id: '6',
    title: '山水意境',
    artist: '赵文静',
    year: 2022,
    medium: '布面油画',
    dimensions: '150 × 100 cm',
    description: '融合东西方绘画技法，用油画的方式诠释中国传统山水的意境美。',
    story: '作为一个学习西方绘画技法的艺术家，我一直想要找到一种方式来表达中国传统文化的精神内核。这幅画是我的一次尝试，用油画的厚重感来表现山水的磅礴气势，同时保持中国画的意境美。创作过程中，我反复思考如何在写实与写意之间找到平衡点。',
    image: '/image/6.JPG',
    thumbnail: '/image/6.JPG',
    category: 'oil',
    featured: false,
    tags: ['山水', '意境', '融合', '传统']
  },
  {
    id: '7',
    title: '都市夜景',
    artist: '孙志明',
    year: 2023,
    medium: '纸本水彩',
    dimensions: '40 × 30 cm',
    description: '夜晚城市的霓虹灯光，营造出梦幻般的都市氛围，展现现代生活的多彩面貌。',
    story: '每次夜晚走在城市的街道上，我都会被那些五光十色的霓虹灯所吸引。它们就像是城市的眼睛，诉说着无数个故事。这幅画是我在一个雨夜完成的，湿润的地面反射着灯光，营造出一种朦胧而浪漫的氛围。我用水彩的流动性来表现这种梦幻的感觉。',
    image: '/image/7.JPG',
    thumbnail: '/image/7.JPG',
    category: 'mixed',
    featured: false,
    tags: ['夜景', '城市', '灯光', '氛围']
  },
  {
    id: '8',
    title: '静物写生',
    artist: '李小红',
    year: 2023,
    medium: '布面油画',
    dimensions: '60 × 50 cm',
    description: '经典的静物组合，通过精细的观察和描绘，展现物体的质感和空间关系。',
    story: '静物写生是绘画的基础训练，但我希望在传统的基础上加入自己的理解。这组静物是我精心挑选的，每个物体都有其独特的质感和形态。通过反复的观察和练习，我试图找到最适合表现它们的方式。光线的处理是这幅画的关键，它决定了整个画面的氛围。',
    image: '/image/8.JPG',
    thumbnail: '/image/8.JPG',
    category: 'oil',
    featured: false,
    tags: ['静物', '写生', '质感', '光线']
  }
];

// 获取特色作品
export const getFeaturedArtworks = () => artworks.filter(artwork => artwork.featured);

// 按类别获取作品
export const getArtworksByCategory = (category: Artwork['category']) => 
  artworks.filter(artwork => artwork.category === category);

// 按ID获取作品
export const getArtworkById = (id: string) => 
  artworks.find(artwork => artwork.id === id);

// 获取随机作品
export const getRandomArtworks = (count: number) => {
  const shuffled = [...artworks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};