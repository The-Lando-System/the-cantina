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

  private song: Song = new Song();
  private audio: any = {};
  private loading: boolean = false;
  
  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private bcaster: Broadcaster,
    private songQueueSvc: SongQueueService
  ){}

  ngOnInit(): void {
    this.loading = true;
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.listenForSelectedSong();
    this.listenForSongToPlay();
  }

  getSongUrl(): string {
    return this.song.url + '?cb=' + this.song.id;
  }

  listenForSelectedSong(): void {
    this.bcaster.on<string>("SONG_SELECTED")
    .subscribe(songId => {
      this.loading = false;
      this.initAudioBySongId(songId, false);
    });
  }

  listenForSongToPlay(): void {
    this.bcaster.on<Song>(this.songQueueSvc.PLAY)
    .subscribe(song => {
      this.initAudioBySongId(song.id, true);
    });
  }

  initAudioBySongId(songId:string, shouldPlay:boolean): void {
    this.songSvc.getSongById(songId)
    .then((song:Song) => {
      this.song = song;
      this.audio = document.getElementById('my-audio');
      this.audio.src = this.song.url;
      this.audio.load();

      if (shouldPlay) {
        this.audio.play();

        let sqs = this.songQueueSvc;
        let currentSong = this.song;

        this.audio.addEventListener('ended',function() {
          sqs.playNextSong(currentSong);
        });
      }

    }).catch((err:any) => {
      this.loading = false;
    });
  }

  getSongArt(): string {
      return this.song.artUrl || "https://vignette3.wikia.nocookie.net/starwars/images/6/68/Bith-GOI.jpg/revision/latest/scale-to-width-down/160?cb=20131206104539";
  }

}