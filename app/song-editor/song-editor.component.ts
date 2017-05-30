import { Component, OnInit, Input } from '@angular/core';
import { UserService, Broadcaster, User } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

@Component({
  moduleId: module.id,
  selector: 'song-editor',
  templateUrl: 'song-editor.component.html',
  styleUrls: [ 'song-editor.component.css' ],
  providers: [ SongService ]
})
export class SongEditorComponent implements OnInit {

  @Input('songToEdit')
  private song: Song;
  
  constructor(
    private userService: UserService,
    private songSvc: SongService
  ){}

  ngOnInit(): void {
    this.userService.returnUser().then((user:User) => {}).catch((err:any) => {});
  }

  updateSong(): void {
    this.songSvc.updateSongArt(this.song.artUrl,this.song.id)
    .then((res:any) => {})
    .catch((err:any) => {});
  }

}