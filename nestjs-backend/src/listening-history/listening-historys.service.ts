import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';

import aqp from 'api-query-params';
import {
  ListeningHistory,
  ListeningHistoryDocument,
} from './schemas/listening-history.schema';
import { CreateListeningHistorysDto } from './dto/create-listening-history.dto';
import { UpdateListeningHistorysDto } from './dto/update-listening-history.dto';
import mongoose from 'mongoose';
import { TrackArtistsService } from '@/track-artist/track-artist.service';
const defaultPopulation = [
  {
    path: 'track',
    populate: [
      { path: 'genres' },
      { path: 'releasedBy' },
      {
        path: 'album',
        match: { _id: { $exists: true } },
      },
      {
        path: 'tags',
      },
    ],
  },
  {
    path: 'album',
    populate: [{ path: 'releasedBy' }],
  },
  {
    path: 'artist',
  },
];
@Injectable()
export class ListeningHistorysService {
  constructor(
    @InjectModel(ListeningHistory.name)
    private ListeningHistoryModel: SoftDeleteModel<ListeningHistoryDocument>,
  ) {}

  async recordPlay(
    trackId: string,
    albumId: string,
    artistId: string,
    userId: string,
  ) {
    return await this.ListeningHistoryModel.create({
      track: trackId ? trackId : null,
      album: albumId ? albumId : null,
      artist: artistId ? artistId : null,
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  async getMonthlyRecord(dateLimit: Date) {
    const listeners = await this.ListeningHistoryModel.aggregate([
      { $match: { createdAt: { $gte: dateLimit } } },
      {
        $lookup: {
          from: 'trackartists',
          localField: 'track',
          foreignField: 'track',
          as: 'trackArtistData',
        },
      },
      { $unwind: '$trackArtistData' },
      {
        $group: {
          _id: { artist: '$trackArtistData.artist', user: '$user' },
        },
      },
      {
        $group: {
          _id: '$_id.artist',
          count: { $sum: 1 },
        },
      },
    ]);

    return listeners;
  }

  async getTrendingTracksByReleasedBy(
    releasedBy: string,
    dateLimitInDays: number,
    limit: number,
  ) {
    const now = new Date();
    const dateLimit = new Date(
      now.getTime() - dateLimitInDays * 24 * 60 * 60 * 1000,
    );

    const plays: any = await this.ListeningHistoryModel.find({
      createdAt: { $gte: dateLimit },
    })
      .populate([
        {
          path: 'track',
          populate: [
            { path: 'genres' },
            { path: 'releasedBy' },
            {
              path: 'album',
              match: { _id: { $exists: true } },
            },
            { path: 'tags' },
          ],
        },
      ])
      .lean();

    const filtered = plays.filter(
      (play) =>
        play.track &&
        play.track.releasedBy &&
        play.track.releasedBy._id?.toString() === releasedBy,
    );

    const countMap = new Map<string, any>();

    for (const play of filtered) {
      const trackId = play.track._id.toString();
      if (!countMap.has(trackId)) {
        countMap.set(trackId, { count: 1, track: play.track });
      } else {
        countMap.get(trackId)!.count++;
      }
    }

    const topTracks = Array.from(countMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((item) => item.track);

    return topTracks;
  }

  async fetchAlbumListenedByUser(user: IUser) {
    const albums = (
      await this.ListeningHistoryModel.find({ user: user._id }).populate(
        defaultPopulation,
      )
    ).map((item) => item.album);

    return albums.filter((item: any) => item?.type === 'album');
  }

  async fetchTrendingAlbumsLatestActivity() {
    const recentActivities = await this.ListeningHistoryModel.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate(defaultPopulation);

    const albums = recentActivities.map((item) => item.album);

    return albums;
  }

  async getRecently(user: IUser) {
    const histories = await this.ListeningHistoryModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate(defaultPopulation);

    const uniqueItems: any[] = [];
    const seenIds = new Set<string>();

    for (const item of histories) {
      let entity: any = null;
      let type: string = '';

      if (item.album) {
        entity = item.album;
        type = 'album';
      } else if (item.artist) {
        entity = item.artist;
        type = 'artist';
      } else if (item.track) {
        entity = item.track;
        type = 'track';
      }

      if (entity && !seenIds.has(entity._id.toString())) {
        seenIds.add(entity._id.toString());
        uniqueItems.push({
          type,
          data: entity,
        });

        if (uniqueItems.length === 8) break;
      }
    }

    return uniqueItems;
  }
}
