import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: [ 'song-list.component.css' ],
  providers: [ SongService ]
})
export class SongListComponent implements OnInit {

  private songs: Song[];
  private loading = false;

  private songToEdit: Song;

  private currentAlbumId: string;

  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private globals: Globals,
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.listenForAlbumChange();
  }

  selectSong(song:Song) {
    event.preventDefault();
    this.bcaster.broadcast("SONG_SELECTED",song.id);
  }

  deleteSong(song:Song) {
    event.preventDefault();

    if(!confirm("Are you sure you want to delete this song?")){
      return;
    }

    this.loading = true;

    this.songSvc.deleteSong(song.id)
    .then((res:any) => {
        this.removeSongFromSongs(song.id);
        this.loading = false;
    }).catch((err:any) => {
        this.loading = false;
    });

  }

  isUserAdmin(): boolean {
    return this.userService.isAdminForApp('the-cantina');
  }

  editSong(song:Song) {
    event.preventDefault();
    console.log(song);
    this.songToEdit = song;
  }

  listenForAlbumChange(): void {
    this.bcaster.on<any>("ALBUM_SELECTED")
    .subscribe(albumId => {
      this.loading = true;
      this.currentAlbumId = albumId;
      this.songSvc.getSongsByAlbumId(albumId)
      .then((songs:Song[]) => {
        this.songs = songs;
        this.selectSong(this.songs[0]);
        this.loading = false;
      }).catch((res:any) => {
        this.loading = false;
      });
    });
  }

  private removeSongFromSongs(songId:string){
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === songId){
        this.songs.splice(i,1);
      }
    }
  }

  private updateSong(song:Song){
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === song.id){
        this.songs[i] = song;
      }
    }
  }

}