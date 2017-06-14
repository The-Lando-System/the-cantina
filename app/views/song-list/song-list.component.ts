import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../../services/song.service';
import { Song } from '../../models/song/song';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Component({
  moduleId: module.id,
  selector: 'song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: [ 'song-list.component.css' ],
  providers: [ SongService ]
})
export class SongListComponent implements OnInit {

  private songs: Observable<Song>;
  private songsArr: Song[] = [];
  
  private songFilter:string = '';

  private songToEdit: Song;

  private currentAlbumId: string;

  private loading = false;

  constructor(
    private userService: UserService,
    private songSvc: SongService,
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
      this.currentAlbumId = albumId;
      this.getSongsByAlbumId(albumId);
    });
  }

  getSongsByAlbumId(albumId:string): void {
    this.loading = true;
    this.songSvc.getSongsByAlbumId(albumId)
    .subscribe((songs:Song[]) => {
      this.songs = Observable.from(songs);
      this.songsArr = songs;
      this.selectSong(songs[0]);
      this.loading = false;
    });
  }

  filter(term:string): void {
    this.songsArr = [];
    this.songs.filter((song:Song) => {
      return song.name.toLowerCase().includes(term.toLowerCase());
    }).map((song:Song) => {
      return song;
    }).subscribe((song:Song) => {
      this.songsArr.push(song);
    });
  }

  private removeSongFromSongs(songId:string){
    for(var i=0; i<this.songsArr.length; i++){
      if (this.songsArr[i].id === songId){
        this.songsArr.splice(i,1);
      }
    }
  }

  private updateSong(song:Song){
    for(var i=0; i<this.songsArr.length; i++){
      if (this.songsArr[i].id === song.id){
        this.songsArr[i] = song;
      }
    }
  }

}