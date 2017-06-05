import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster, UserService } from 'sarlacc-angular-client';

import { AlbumService } from '../album/album.service';
import { Album } from '../album/album';

import { Globals } from '../globals';

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
  }

  getAlbums(): void {
    this.albumSvc.getAlbums()
    .then((albums:Album[]) => {
      this.albums = albums;
      this.selectedAlbum = this.albums[0];
    }).catch((err:any) => {});
  }

  nextAlbum(isNext:boolean): void {
    let newIndex = 0;
    for (let i=0; i<this.albums.length; i++){
        if (this.albums[i].name === this.selectedAlbum.name){
            if (i === this.albums.length - 1 && isNext ){
                this.selectedAlbum = this.albums[0];
                return;
            } else if (i === 0 && !isNext ) {
                this.selectedAlbum = this.albums[this.albums.length - 1];
                return;
            } else if (isNext){
                this.selectedAlbum = this.albums[i+1];
                return;
            } else if (!isNext){
                this.selectedAlbum = this.albums[i-1];
                return;
            }
        }
    }
  }

  isAdmin(): boolean {
    return this.userSvc.isAdminForApp('the-cantina');
  }

}