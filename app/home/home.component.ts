import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';
import { RequestOptions, Http } from '@angular/http';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { Globals } from '../globals';

declare var SockJS: any;
declare var Stomp: any;

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
  websocketUrl: string = this.globals.svc_domain + '/websocket';
  statusTopic: string = '/topic/song-status/';
  songToUpload: string;
  newSong: Song = new Song;
  songFile: File;

  stompClient: any;
  
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

    this.connect();
    this.listenForLogin();
    this.listenForLogout();
    
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.getSongs();
    }).catch((res:any) => {
      this.getSongs();
    });
  }

  connect(): void {
    var socket = new SockJS(this.websocketUrl);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame:any) => {
      console.log('Connected: ' + frame);
      this.subscribe();
    }, (err:any) => {
      console.log(err);
    });
  }

  subscribe():void {
    this.stompClient.subscribe(this.statusTopic, (res:any) => {
        let loadingStatus = JSON.parse(res.body);
        this.updateStatus(loadingStatus.songId, loadingStatus.loading, loadingStatus.status);
    });
  }

  updateStatus(songId:string,songIsLoading:boolean,status:string) {
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === songId){
        this.songs[i].status = status;
        this.songs[i].loading = songIsLoading;
      }
    }
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

  private removeSongFromSongs(songId:string){
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === songId){
        this.songs.splice(i,1);
      }
    }
  }


}