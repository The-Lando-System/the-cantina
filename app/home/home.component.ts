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
  cantinaSvcUrl: string;
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

      this.cantinaSvcUrl = this.globals.svc_domain + '/songs/';
      this.getSongs();

      this.homeLoading = false;
    }).catch((res:any) => {
      console.log('User is not logged in');
      this.homeLoading = false;
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
    }).catch((res:any) => {});
  }

  uploadNewSong() {
    console.log(this.songFile);

    this.http.post('http://localhost:8090/songs/' + this.newSong.name, this.songFile)
    .toPromise()
    .then((res:any) => {
      console.log(res);
    }).catch((err:any) => {
      console.log(err);
    })

  }

  selectSongToUpload(event:any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.songFile = fileList[0];
      this.songToUpload = this.songFile.name;
      this.newSong.name = this.songFile.name;

      // let formData:FormData = new FormData();
      // formData.append('uploadFile', file, file.name);

      // console.log(formData);

      // let headers = new Headers();
      // headers.append('Content-Type', 'multipart/form-data');
      // headers.append('Accept', 'application/json');

    }
  }


}