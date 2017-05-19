import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

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
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
  }

  uploadNewSong() {

    this.newSong.loading = true;
    this.bcaster.broadcast("NEW_SONG",this.newSong);

    this.songSvc.createSong(this.songFile,this.newSong)
    .then((createdSong:Song) => {
        createdSong.loading = false;
        this.bcaster.broadcast("NEW_SONG",createdSong);

    }).catch((err:any) => {
        this.bcaster.broadcast("NEW_SONG",new Song());
    });

    this.newSong = new Song();
    this.songFile = null;
  }

  selectSongToUpload(event:any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.songFile = fileList[0];
      this.newSong.name = this.songFile.name;
      this.newSong.filename = this.songFile.name;
    }
  }

}