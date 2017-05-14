import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { SongService } from '../song/song.service';
import { Song } from '../song/song';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'song',
  templateUrl: 'song.component.html',
  styleUrls: [ 'song.component.css' ],
  providers: [ SongService ]
})
export class SongComponent implements OnInit {

  @Input() song: Song;
  cantinaSvcUrl: string = this.globals.svc_domain + '/songs/';

  constructor(
    private songSvc: SongService,
    private globals: Globals,
    private bcaster: Broadcaster
  ){}

  ngOnInit(): void {
  }

  deleteSong(song:Song) {
    event.preventDefault();

    if(!confirm("Are you sure you want to delete this song?")){
      return;
    }

    this.songSvc.deleteSong(song.id)
    .then((res:any) => {
        this.bcaster.broadcast("SONG_DELETED",song.id);
    }).catch((err:any) => {});

  }


}