import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';
import { RequestOptions, Http } from '@angular/http';

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
  songToUpload: string;
  newSong: Song = new Song;
  songFile: File;

  private homeLoading = false;

  constructor(
    private userSvc: UserService,
    private broadcaster: Broadcaster,
    private songSvc: SongService,
    private globals: Globals,
    private http: Http
  ){}

  ngOnInit(): void {
    this.homeLoading = true;
    
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.getSongs();
    }).catch((res:any) => {
      this.getSongs();
    });

    this.listenForLogin();
    this.listenForLogout();
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

  getSongs(): void {
    this.songSvc.getSongs()
    .then((songs:Song[]) => {
      this.songs = songs;
      this.homeLoading = false;
    }).catch((res:any) => {
      this.homeLoading = false;
    });
  }

  uploadNewSong() {
    this.homeLoading = true;
    this.songSvc.createSong(this.songFile,this.newSong.name)
    .then((createdSong:Song) => {
      this.songs.push(createdSong);
      this.homeLoading = false;
    }).catch((err:any) => {
      this.homeLoading = false;
    });
  }

  selectSongToUpload(event:any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.songFile = fileList[0];
      this.songToUpload = this.songFile.name;
      this.newSong.name = this.songFile.name;
    }
  }

  deleteSong(song:Song) {
    event.preventDefault();
    console.log(song);

    this.songSvc.deleteSong(song.id)
    .then((res:any) => {
      this.removeSongFromSongs(song.id);
    }).catch((err:any) => {});

  }

  private removeSongFromSongs(songId:string){
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === songId){
        this.songs.splice(i,1);
      }
    }
  }

}