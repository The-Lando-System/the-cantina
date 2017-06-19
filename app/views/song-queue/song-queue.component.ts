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
    this.listenForSongs();
  }

  getSongsInQueue(): void {
    this.songs = this.songQueueSvc.getSongsInQueue();
  }

  listenForSongs(): void {
    this.bcaster.onAny([this.songQueueSvc.ADDED, this.songQueueSvc.REMOVED])
    .subscribe(() => {
      this.getSongsInQueue();
    });
  }

}