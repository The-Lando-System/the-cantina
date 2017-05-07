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
    }).catch((res:any) => {
    });
  }

}