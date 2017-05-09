import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserService } from 'sarlacc-angular-client';

import { Globals } from '../globals';

import { Song } from './song';

@Injectable()
export class SongService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private songUrl = this.globals.svc_domain + '/songs/';

  getSongs(): Promise<Song[]> {
    return this.http.get(this.songUrl, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  createSong(songFile:File,name:string): Promise<Song> {

    let formData:FormData = new FormData();
    formData.append('song', songFile);
    let headers = new Headers({'Content-Type': 'multipart/form-data'});

    return this.http.post(this.songUrl + name, formData, headers)
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  deleteSong(songId:string): Promise<void> {
    return this.http.delete(this.songUrl + songId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }


}