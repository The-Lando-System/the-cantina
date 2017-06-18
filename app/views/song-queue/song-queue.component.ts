import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { SongQueueService } from '../../services/song-queue.service';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song/song';

@Component({
  moduleId: module.id,
  selector: 'song-queue',
  templateUrl: 'song-queue.component.html',
  styleUrls: [ 'song-queue.component.css' ],
  providers: [ SongService ]
})
export class SongQueueComponent implements OnInit {

  private loading = false;

  private songs:Song[] = [];

  constructor(
    private bcaster: Broadcaster,
    private songQueueSvc: SongQueueService,
    private songSvc: SongService
  ){}

  ngOnInit(): void {
    this.getSongsInQueue();
  }

  getSongsInQueue(): void {
    let songIds = this.songQueueSvc.getSongsInQueue();
    for (let songId of songIds) {
      this.songSvc.getSongById(songId)
      .then((song:Song) => {
        this.songs.push(song);
      }).catch((err:any) => {});
    }
  }

}