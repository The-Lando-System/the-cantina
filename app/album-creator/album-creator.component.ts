import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { AlbumService } from '../album/album.service';
import { Album } from '../album/album';

@Component({
  moduleId: module.id,
  selector: 'album-creator',
  templateUrl: 'album-creator.component.html',
  styleUrls: [ 'album-creator.component.css' ],
  providers: [ AlbumService ]
})
export class AlbumCreatorComponent implements OnInit {

  private album: Album;
  
  constructor(
    private userService: UserService,
    private albumSvc: AlbumService
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
  }

  createAlbum(): void {
    this.albumSvc.createAlbum(this.album)
    .then((album:Album) => {

    }).catch((err:any) => {});

  }

}