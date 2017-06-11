import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { AlbumService } from '../album/album.service';
import { Album } from '../album/album';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'uploader',
  templateUrl: 'uploader.component.html',
  styleUrls: [ 'uploader.component.css' ],
  providers: [ SongService, AlbumService ]
})
export class UploaderComponent implements OnInit {

  private songFile: File;
  private newSong: Song = new Song();
  private loading: boolean = false;
  private albums: Album[];
  private selectedAlbum: Album = new Album();

  constructor(
    private songSvc: SongService,
    private globals: Globals,
    private bcaster: Broadcaster,
    private albumSvc: AlbumService
  ){}

  ngOnInit(): void {
    this.getAlbums();
    this.listenForCreatedAlbum();
    this.listenForUpdatedAlbum();
  }

  uploadNewSong() {
    event.preventDefault();

    this.loading = true;

    this.newSong.albumId = this.selectedAlbum.id;

    this.songSvc.createSong(this.songFile,this.newSong)
    .then((createdSong:Song) => {
        this.bcaster.broadcast("SONG_UPDATED");
        document.getElementById("closeUploaderButton").click();
        this.newSong = new Song();
        this.songFile = null;
        this.loading = false;
    }).catch((err:any) => {
      this.loading = false;  
    });

  }

  selectSongToUpload(event:any): void {
    event.preventDefault();
    let fileList: FileList = event.target.files;
    this.songFile = fileList[0];
    this.newSong.name = this.songFile.name;
    this.newSong.filename = this.songFile.name;
    setTimeout(function() {
      document.getElementById("openUploaderModalButton").click();
    });
  }

  getAlbums(): void {
    this.albumSvc.getAlbums()
    .then((albums:Album[]) => {
      this.albums = albums;
      this.selectedAlbum = albums[0];
    }).catch((res:any) => {});
  }

  selectAlbum(album:Album): void {
    this.selectedAlbum = album;
  }

  listenForUpdatedAlbum(): void {
    this.bcaster.on<any>("ALBUM_UPDATED").subscribe( res => {
      this.getAlbums();
    });
  }

  listenForCreatedAlbum(): void {
    this.bcaster.on<any>("ALBUM_CREATED").subscribe( res => {
      this.getAlbums();
    });
  }

}