import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { AlbumService } from '../album/album.service';
import { Album } from '../album/album';

@Component({
  moduleId: module.id,
  selector: 'album-editor',
  templateUrl: 'album-editor.component.html',
  styleUrls: [ 'album-editor.component.css' ],
  providers: [ AlbumService ]
})
export class AlbumEditorComponent implements OnInit {

  @Input('albumToEdit')
  private album: Album;
  
  constructor(
    private userService: UserService,
    private albumSvc: AlbumService
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
  }

  updateAlbum(): void {
      
  }

  createAlbum(): void {
    this.albumSvc.createAlbum(this.album)
    .then((album:Album) => {

    }).catch((err:any) => {});

  }

}