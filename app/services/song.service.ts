import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserService } from 'sarlacc-angular-client';
import { Observable } from 'rxjs/Observable';

import { Globals } from './globals';

import { Song } from '../models/song/song';

@Injectable()
export class SongService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private songUrl = this.globals.svc_domain + '/songs/';

  getSongs(): Promise<Song[]> {
    return this.http.get(this.songUrl)
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  getSongById(songId:string): Promise<Song> {
    return this.http.get(this.songUrl + songId)
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  } 

  createSong(songFile:File,songToCreate:Song): Promise<Song> {

    let formData:FormData = new FormData();
    formData.append('name', songToCreate.name);
    formData.append('filename', songToCreate.filename);
    formData.append('albumId', songToCreate.albumId);
    formData.append('song', songFile);

    let headers = this.userSvc.getAuthHeaders();
    headers.delete('Content-Type');

    return this.http.post(this.songUrl, formData, {headers: headers})
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
    }).catch((err:any) => {
      console.log(err);
    });
  }

  updateSong(updatedSong:Song): Promise<void> {
    return this.http.put(this.songUrl + updatedSong.id, updatedSong, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {})
    .catch((err:any) => {
      console.log(err);
    });
  }

  getSongsByAlbumId(albumId:string): Observable<Song[]> {
    return this.http.get(this.songUrl + 'album/' + albumId)
    .map((res:any) => {
      return res.json();
    }).catch((err:Response) => {
      console.log(err);
      return Observable.throw(err);
    });
  }

  saveSongOrder(albumId:string, songIds:string[]): Observable<void> {
    return this.http.post(this.songUrl + 'order/' + albumId, songIds, {headers: this.userSvc.getAuthHeaders()})
    .map((res:any) => {
      return;
    }).catch((err:Response) => {
      console.log(err);
      return Observable.throw(err);
    });
  }

}