export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
}

export type HotTag = {
  id: number;
  name: string;
  position: number
}

export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}

export type Song = {
  id: number
  name: string;
  url: string;
  // 歌手列表
  ar: Singer[];
  // 歌曲专辑
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  // 播放时长
  dt: number;
}


// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
}

export type SongUrl = {
  id: number;
  url: string;
}
