import { Component, OnInit, Input } from '@angular/core';
import { RequestOptions, Http } from '@angular/http';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { Globals } from '../globals';

declare var SockJS: any;
declare var Stomp: any;

@Component({
  moduleId: module.id,
  selector: 'uploader',
  templateUrl: 'uploader.component.html',
  styleUrls: [ 'uploader.component.css' ],
  providers: [ SongService ]
})
export class UploaderComponent implements OnInit {

  cantinaSvcUrl: string = this.globals.svc_domain + '/songs/';
  songFile: File;
  newSong: Song = new Song();

  constructor(
    private songSvc: SongService,
    private globals: Globals,
    private http: Http
  ){}

  ngOnInit(): void {
  }

  uploadNewSong() {
    this.songSvc.createSong(this.songFile,this.newSong.name)
    .then((createdSong:Song) => {
        this.newSong = new Song();
        this.songFile = null;
    }).catch((err:any) => {

    });
  }

  selectSongToUpload(event:any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.songFile = fileList[0];
      this.newSong.name = this.songFile.name;
    }
  }

}