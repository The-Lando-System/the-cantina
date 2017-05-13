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
  statusTopic: string = '/topic/song-status';
  songToUpload: string;
  newSong: Song = new Song;
  songFile: File;

  stompClient: any;
  uuid: string;

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
    
    this.uuid = this.newGuid();

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
        this.updateStatus(loadingStatus.songId, loadingStatus.clientId, loadingStatus.loading, loadingStatus.status);
    });
  }

  updateStatus(songId:string,clientId:string,songIsLoading:boolean,status:string) {
    for(var i=0; i<this.songs.length; i++){
      if (this.songs[i].id === songId && this.uuid === clientId){
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

  uploadNewSong() {
    
    let song = new Song();

    song.name = this.newSong.name;
    song.id = '';
    song.loading = true;
    song.status = 'Uploading Song...';
    this.songs.push(song);

    this.songToUpload = "";
    this.newSong.name = "";

    this.songSvc.createSong(this.songFile,song.name)
    .then((createdSong:Song) => {
      this.songSvc.getSongById(createdSong.id)
      .then((song:Song) => {
        this.removeSongFromSongs('');
        this.songs.push(song);
      }).catch((err:any) => {});
    }).catch((err:any) => {
      this.removeSongFromSongs('');
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

    if(!confirm("Are you sure you want to delete this song?")){
      return;
    }

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

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
  }


}