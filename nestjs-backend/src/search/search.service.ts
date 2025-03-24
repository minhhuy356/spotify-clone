import { ArtistDocument } from '@/artists/schemas/artist.schema';
import { TrackDocument } from '@/tracks/schemas/track.schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('Track')
    private readonly trackModel: SoftDeleteModel<TrackDocument>,
    @InjectModel('Artist')
    private readonly artistModel: SoftDeleteModel<ArtistDocument>,
  ) {}

  async search(query: string) {
    if (!query) return { tracks: [] };

    const regex = new RegExp(query, 'i');

    // 🔹 Tìm kiếm ca sĩ theo tên
    let artists = await this.artistModel
      .find({ name: regex })
      .select('_id name imgUrl')
      .sort({ countLike: -1 })
      .limit(2);

    let allTracks: any[] = [];
    let seenTracks = new Set<string>(); // Set để lưu ID bài hát đã xuất hiện

    // 🔹 Lấy bài hát theo từng ca sĩ
    for (const artist of artists) {
      let tracksByArtist = await this.trackModel
        .find({ artists: artist._id })
        .sort({ countLike: -1 })
        .limit(4)
        .populate({ path: 'artists' });

      allTracks.push({ type: 'artist', data: artist });
      // Kiểm tra và thêm các bài hát chưa xuất hiện vào kết quả
      for (const track of tracksByArtist) {
        if (!seenTracks.has(track._id.toString())) {
          seenTracks.add(track._id.toString()); // Đánh dấu bài hát đã xuất hiện
          allTracks.push({ type: 'track', data: track });
        }
      }
    }

    // 🔹 Nếu vẫn chưa đủ 4 bài hát, lấy thêm bài hát khác
    if (allTracks.length < 4) {
      const remaining = 4 - allTracks.length;
      const moreTracks = await this.trackModel
        .find({ title: regex, _id: { $nin: [...seenTracks] } })
        .sort({ countLike: -1 })
        .limit(remaining)
        .populate({ path: 'artists' });

      moreTracks.forEach((track) => {
        seenTracks.add(track._id.toString());
        allTracks.push({ type: 'track', data: track });
      });
    }

    return {
      tracks: allTracks, // Trả về danh sách bài hát và ca sĩ không bị trùng
    };
  }
}
