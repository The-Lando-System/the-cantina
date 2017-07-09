import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../../services/song.service';
import { Song } from '../../models/song/song';

import { SongQueueService } from '../../services/song-queue.service';

@Component({
  moduleId: module.id,
  selector: 'song-player',
  templateUrl: 'song-player.component.html',
  styleUrls: [ 'song-player.component.css' ],
  providers: [ SongService ]
})
export class SongPlayerComponent implements OnInit {

  private song: Song;
  private playCount: number = 0;
  private loading: boolean = false;
  private isPlaying: boolean = true;
  private defaultArtUrl:string = 'https://vignette3.wikia.nocookie.net/starwars/images/6/68/Bith-GOI.jpg/revision/latest/scale-to-width-down/160?cb=20131206104539';
  private maxClass: string = 'maximized';

  // Audio controls
  private audio: any = {};
  private normalizedTime: number = 0;
  private volume: number = 100;

  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private bcaster: Broadcaster,
    private songQueueSvc: SongQueueService
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.listenForSongToPlay();
  }

  getSongUrl(): string {
    return this.song.url + '?cb=' + this.song.id;
  }

  listenForSongToPlay(): void {
    this.bcaster.on<Song>(this.songQueueSvc.PLAY)
    .subscribe(song => {
      this.initAudioBySongId(song.id);
      this.getSongPlayCount(song.id);
    });
  }

  initAudioBySongId(songId:string): void {
    this.songSvc.getSongById(songId)
    .then((song:Song) => {
      this.song = song;
      this.audio = document.getElementById('my-audio');
      this.audio.src = this.song.url;
      this.audio.load();
      this.audio.play();
      this.isPlaying = true;
      this.updateCurrentTime();
      this.audio.onended = this.playNext.bind(this);
      this.songSvc.incrementSongPlayCount(song.id).subscribe((res:any) => {});
    }).catch((err:any) => {
      this.loading = false;
    });
  }

  updateCurrentTime(): void {
    setInterval(() => {
      if (this.audio){
        this.normalizedTime = (this.audio.currentTime / this.audio.duration) * 100;
      } else {
        return;
      }
    }, 100);
  }

  updateVolume(newVolume:number): void {
    if (this.audio) {
      this.audio.volume = newVolume;
    } else {
      return;
    }
  }

  play(): void {
    this.audio.play();
    this.isPlaying = true;
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying = false;
  }

  playNext(): void {
    this.isPlaying = false;
    this.songQueueSvc.playNextSong(this.song);
  }

  seek(seconds:number): void {
    let seekTime = this.audio.currentTime + seconds;
    if (seekTime < 0) {
      this.audio.currentTime = 0;
      this.play();
      return;
    }
    if (seekTime > this.audio.duration) {
      this.audio.currentTime = this.audio.duration;
      return;
    }

    this.audio.currentTime = seekTime;
    this.play();
    return;
  }

  getSongArt(): string {
      return this.song.artUrl || this.defaultArtUrl;
  }

  getSongPlayCount(songId:string): void {
    this.songSvc.getSongPlayCount(songId)
    .subscribe((count:number) => {
      this.playCount = count;
    });
  }

}