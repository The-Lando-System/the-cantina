import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster, UserService } from 'sarlacc-angular-client';

import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album/album';

@Component({
  moduleId: module.id,
  selector: 'album-list',
  templateUrl: 'album-list.component.html',
  styleUrls: [ 'album-list.component.css' ],
  providers: [ AlbumService ]
})
export class AlbumListComponent implements OnInit {

  private selectedAlbum: Album = new Album();
  private albums: Album[] = [];
  private loading = false;

  constructor(
    private albumSvc: AlbumService,
    private bcaster: Broadcaster,
    private userSvc: UserService
  ){}

  ngOnInit(): void {
    this.userSvc.returnUser().then((res:any) => {}).catch((err:any) => {});
    this.getAlbums();

    this.listenForUpdates();
  }

  private listenForUpdates(): void {
    this.bcaster.onAny<any>(['ALBUM_CREATED','ALBUM_UPDATED','SONG_UPDATED']).subscribe( res => {
      this.getAlbums();
    });
  }

  getAlbums(): void {
    this.loading = true;
    this.albumSvc.getAlbums()
    .then((albums:Album[]) => {
      this.albums = albums;
      this.selectAlbum(albums[0]);
      this.loading = false;
    }).catch((err:any) => {
      this.loading = false;
    });
  }

  nextAlbum(isNext:boolean): void {
    let newIndex = 0;
    for (let i=0; i<this.albums.length; i++){
        if (this.albums[i].name === this.selectedAlbum.name){
            if (i === this.albums.length - 1 && isNext ){
                this.selectAlbum(this.albums[0]);
                return;
            } else if (i === 0 && !isNext ) {
                this.selectAlbum(this.albums[this.albums.length - 1]);
                return;
            } else if (isNext){
                this.selectAlbum(this.albums[i+1]);
                return;
            } else if (!isNext){
                this.selectAlbum(this.albums[i-1]);
                return;
            }
        }
    }
  }

  selectAlbum(album:Album): void {
    this.selectedAlbum = album;
    this.bcaster.broadcast("ALBUM_SELECTED",album.id);
  }

  deleteAlbum(): void {

    if (!confirm('Are you sure you want to delete this album? All songs on this album will be unassigned.')) {
      return;
    }

    if (this.selectedAlbum.songIds.length > 0){
      alert('You cannot delete this album until you reassign or remove all of its songs!');
      return;
    }

    this.albumSvc.deleteAlbum(this.selectedAlbum.id)
    .then((res:any) => {
      this.getAlbums();
      this.bcaster.broadcast("ALBUM_UPDATED");
    }).catch((res:any) => {});

  }

  playAlbum(album:Album): void {
    
  }

  isAdmin(): boolean {
    return this.userSvc.isAdminForApp('the-cantina');
  }

}