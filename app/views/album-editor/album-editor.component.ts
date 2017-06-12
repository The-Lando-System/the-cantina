import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album/album';

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
    private albumSvc: AlbumService,
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
  }

  updateAlbum(): void {
      this.albumSvc.editAlbum(this.album)
      .then((album:Album) => {
        this.bcaster.broadcast("ALBUM_UPDATED");
      }).catch((err:any) => {});
  }

}