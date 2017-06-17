import { Injectable } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { Song } from '../models/song/song';

@Injectable()
export class SongQueueService {

  constructor(
    private bcaster: Broadcaster
  ){}

  private songQueue: Song[] = [];

  addToQueue(song:Song): void {
    this.songQueue.push(song);
  }

  clearQueue(): void {
    this.songQueue = [];
  }

}