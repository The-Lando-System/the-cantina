import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { AlbumService } from '../album/album.service';
import { Album } from '../album/album';

@Component({
  moduleId: module.id,
  selector: 'song-editor',
  templateUrl: 'song-editor.component.html',
  styleUrls: [ 'song-editor.component.css' ],
  providers: [ SongService, AlbumService ]
})
export class SongEditorComponent implements OnInit {

  @Input('songToEdit')
  private song: Song;

  @Input('currentAlbumId')
  private currentAlbumId: string;

  private newAlbum: Album = new Album();

  private albums: Album[];
  
  constructor(
    private userService: UserService,
    private songSvc: SongService,
    private albumSvc: AlbumService,
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
    this.getAlbums();  
    this.getAlbum();
    this.listenForUpdatedSong();
    this.listenForCreatedAlbum();
    this.listenForUpdatedAlbum();
  }

  getAlbums(): void {
    this.albumSvc.getAlbums()
    .then((albums:Album[]) => {
      this.albums = albums;
    }).catch((res:any) => {});
  }

  selectAlbum(album:Album): void {
    this.newAlbum = album;
  }

  updateSong(): void {

    if (this.newAlbum.id !== this.currentAlbumId){
      this.addSongToAlbum(this.newAlbum.id);
    }

    this.songSvc.updateSong(this.song)
    .then((res:any) => {
    }).catch((err:any) => {});
  }

  getAlbum(): void {
    if (this.currentAlbumId){
      this.albumSvc.getAlbumById(this.currentAlbumId)
      .then((album:Album) => {
        this.newAlbum = album;
      }).catch((res:any) => {});
    }
  }

  addSongToAlbum(albumId:string): void {
    this.albumSvc.addSongToAlbum(albumId,this.song.id)
    .then((res:any) => {
      this.bcaster.broadcast('SONG_UPDATED');
    }).catch((res:any) => {});
  }

  listenForUpdatedSong(): void {
    this.bcaster.on<any>("SONG_UPDATED").subscribe( res => {
      this.getAlbums();
    });
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