import { Injectable, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

@Injectable()
export class SongQueueService implements OnInit {

  public PLAY:string = 'PLAY_SONG';
  public NEXT:string = 'NEXT_SONG';

  private songQueue: string[] = [];

  constructor(
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.listenForSongComplete();
  }

  addSongToQueue(songId:string): void {
    this.songQueue.push(songId);
  }

  addSongsToQueue(songIds:string[]): void {
    for(let songId of songIds) {
      this.songQueue.push(songId)
    }
  }

  playQueue(): void {
    if (this.songQueue.length > 0) {
      this.playSong(this.songQueue[0]);
    }
  }

  playSong(songId:string): void {
    this.bcaster.broadcast(this.PLAY, songId);
  }

  nextSong(songId:string): void {
    this.bcaster.broadcast(this.NEXT, songId);
  }

  clearQueue(): void {
    this.songQueue = [];
  }

  listenForSongComplete(): void {
    this.bcaster.on(this.NEXT)
    .subscribe((songId:string) => {
      this.playNextSong(songId);
    });
  }

  playNextSong(completedSongId:string): void {
    this.removeFromQueue(completedSongId);
    this.playSong(this.songQueue[0]);
  }

  removeFromQueue(songId:string): void {
    for(var i=0; i<this.songQueue.length; i++){
      if (this.songQueue[i] === songId){
        this.songQueue.splice(i,1);
      }
    }
  }

}