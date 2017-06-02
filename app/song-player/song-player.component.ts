import { Component, OnInit, Input, NgZone } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

@Component({
  moduleId: module.id,
  selector: 'song-player',
  templateUrl: 'song-player.component.html',
  styleUrls: [ 'song-player.component.css' ],
  providers: [ SongService ]
})
export class SongPlayerComponent implements OnInit {

  private song: Song;
  private audio: any;
  
  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private bcaster: Broadcaster,
    private zone: NgZone
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.listenForSelectedSong();
  }

  getSongUrl(): string {
    return this.song.url + '?cb=' + this.song.id;
  }

  listenForSelectedSong(): void {
    this.bcaster.on<string>("SONG_SELECTED")
    .subscribe(songId => {
      this.initAudioBySongId(songId);
    });
  }

  initAudioBySongId(songId:string): void {
    this.songSvc.getSongById(songId)
    .then((song:Song) => {
      this.song = song;
      this.audio = document.getElementById('my-audio');
      this.audio.src = this.song.url;
      this.audio.load();
    });
  }

  getSongArt(): string {
      return this.song.artUrl || "https://vignette3.wikia.nocookie.net/starwars/images/6/68/Bith-GOI.jpg/revision/latest/scale-to-width-down/160?cb=20131206104539";
  }

}