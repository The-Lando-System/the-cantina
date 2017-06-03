import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

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
    private songSvc: AlbumService,
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.getAlbums();
  }

  getAlbums(): void {

    let a1:Album = new Album();
    a1.name = 'This is a Long Album Name';
    a1.description = 'Album 1 description';
    a1.songIds = ['1','2','3'];

    let a2:Album = new Album();
    a2.name = 'Album 2';
    a2.description = 'Album 2 description';
    a2.songIds = ['1','2','3'];

    let a3:Album = new Album();
    a3.name = 'Album 3';
    a3.description = 'Album 3 description';
    a3.songIds = ['1','2','3'];

    this.albums.push(a1,a2,a3);

    this.selectedAlbum = a1;

    // this.songSvc.getSongs()
    // .then((songs:Song[]) => {
    //   this.songs = songs;
    //   this.bcaster.broadcast("SONG_SELECTED",this.songs[0].id);
    //   this.loading = false;
    // }).catch((res:any) => {
    //   this.loading = false;
    // });
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

}