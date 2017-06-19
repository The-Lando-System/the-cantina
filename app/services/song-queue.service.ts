import { Injectable, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { Song } from '../models/song/song';

@Injectable()
export class SongQueueService implements OnInit {

  public PLAY:string = 'PLAY_SONG';
  public NEXT:string = 'NEXT_SONG';
  public ADDED:string = 'ADD_SONG';
  public REMOVED:string = 'REMOVE_SONG';

  private songQueue: Song[] = [];

  constructor(
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.listenForSongComplete();
  }

  addSongToQueue(song:Song): void {
    this.songQueue.push(song);
    this.bcaster.broadcast(this.ADDED);
  }

  addSongsToQueue(songs:Song[]): void {
    for(let song of songs) {
      this.addSongToQueue(song);
    }
  }

  playQueue(): void {
    if (this.songQueue.length > 0) {
      this.playSong(this.songQueue[0]);
    }
  }

  playSong(song:Song): void {
    this.bcaster.broadcast(this.PLAY, song);
  }

  nextSong(song:string): void {
    this.bcaster.broadcast(this.NEXT, song);
  }

  clearQueue(): void {
    this.songQueue = [];
    this.bcaster.broadcast(this.REMOVED);
  }

  listenForSongComplete(): void {
    this.bcaster.on<Song>(this.NEXT)
    .subscribe((song:Song) => {
      this.playNextSong(song);
    });
  }

  playNextSong(completedSong:Song): void {
    this.removeFromQueue(completedSong);
    this.playSong(this.songQueue[0]);
  }

  removeFromQueue(song:Song): void {
    for(var i=0; i<this.songQueue.length; i++){
      if (this.songQueue[i].id === song.id){
        this.songQueue.splice(i,1);
        this.bcaster.broadcast(this.REMOVED);
        return;
      }
    }
  }

  getSongsInQueue(): Song[] {
    return this.songQueue;
  }

}