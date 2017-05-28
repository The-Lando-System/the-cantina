import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: [ SongService ]
})
export class HomeComponent implements OnInit {

  user: User;
  songs: Song[];
  cantinaSvcUrl: string = this.globals.svc_domain + '/songs/';

  private homeLoading = false;

  constructor(
    private userSvc: UserService,
    private broadcaster: Broadcaster,
    private songSvc: SongService,
    private globals: Globals
  ){}

  ngOnInit(): void {
    this.homeLoading = true;

    this.listenForLogin();
    this.listenForLogout();
    this.listenForNewSongs();
    this.listenForDeletedSongs();
    
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.getSongs();
    }).catch((res:any) => {
      this.getSongs();
    });
  }

  listenForLogin(): void {
   this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.userSvc.returnUser()
      .then((user:User) => {
        this.user = user;
        this.homeLoading = false;
      }).catch((res:any) => {
        console.log('User is not logged in');
        this.homeLoading = false;
      });
    });
  }

  listenForLogout(): void {
    this.broadcaster.on<string>(this.userSvc.LOGOUT_BCAST)
    .subscribe(message => {
      this.user = null;
    });
  }

  listenForNewSongs(): void {
    this.broadcaster.on<any>("NEW_SONG")
    .subscribe(newSong => {

      if (newSong.id){
        this.removeSongFromSongs('loading');
        this.songs.push(newSong);
      } else if (newSong.name) {
        newSong.id = 'loading';
        this.songs.push(newSong);
      } else {
        console.log("Error creating new song");
        this.getSongs();
      }
      
    });
  }

  listenForDeletedSongs(): void {
    this.broadcaster.on<string>("SONG_DELETED")
    .subscribe(songId => {
      this.removeSongFromSongs(songId);
    });
  }

  getSongs(): void {
    this.songSvc.getSongs()
    .then((songs:Song[]) => {
      this.songs = songs;
      this.homeLoading = false;

    }).catch((res:any) => {
      this.homeLoading = false;
    });
  }

  isUserAdmin(): boolean {
    return this.userSvc.isAdminForApp('the-cantina');
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