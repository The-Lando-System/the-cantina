import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../../services/song.service';
import { Song } from '../../models/song/song';

import { SongQueueService } from '../../services/song-queue.service';

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

  private orderMessage:string = '';

  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private bcaster: Broadcaster,
    private songQueueSvc: SongQueueService
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.listenForAlbumChange();
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

  saveSongOrder(): void {

    this.loading = true;
    this.orderMessage = '';

    let songIds = [];

    for (let song of this.songsArr) {
      songIds.push(song.id);
    }

    this.songSvc.saveSongOrder(this.currentAlbumId,songIds)
    .subscribe((res:any) => {
      this.loading = false;
      this.orderMessage = 'Order saved!';
    });
  }

  // lower index
  moveUp(song:Song): void {

    let idx = 0;
    for (let i=0; i<this.songsArr.length; i++) {
      if (this.songsArr[i].id === song.id){
        idx = i;
        break;
      }
    }

    if (idx === 0) {
      return;
    }

    this.songsArr.splice(idx,1);
    idx--;
    this.songsArr.splice(idx,0,song);

  }

  // higher index
  moveDown(song:Song): void {
    
    let idx = 0;
    for (let i=0; i<this.songsArr.length; i++) {
      if (this.songsArr[i].id === song.id){
        idx = i;
        break;
      }
    }
    
    if ((this.songsArr.length-1) === idx) {
      return;
    }
    
    this.songsArr.splice(idx,1);
    idx++;
    this.songsArr.splice(idx,0,song);

  }

  playSong(song:Song): void {
    this.songQueueSvc.addSongToQueue(song);
    this.songQueueSvc.playSong(song);
  }

  addSongToQueue(song:Song): void {
    this.songQueueSvc.addSongToQueue(song);
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