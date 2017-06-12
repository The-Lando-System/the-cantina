import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserService } from 'sarlacc-angular-client';

import { Globals } from './globals';

import { Album } from '../models/album/album';

@Injectable()
export class AlbumService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private albumUrl = this.globals.svc_domain + '/albums/';

  getAlbums(): Promise<Album[]> {
    return this.http.get(this.albumUrl)
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  getAlbumById(albumId:string): Promise<Album> {
    return this.http.get(this.albumUrl + albumId)
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  createAlbum(newAlbum:Album): Promise<Album> {
    return this.http.post(this.albumUrl, newAlbum, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  deleteAlbum(albumId:string): Promise<void> {
    return this.http.delete(this.albumUrl + albumId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {})
    .catch((err:any) => {
      console.log(err);
    });
  }

  editAlbum(editedAlbum:Album): Promise<Album> {
    return this.http.put(this.albumUrl + editedAlbum.id, editedAlbum, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  editAlbumArt(albumId:string, artUrl:string): Promise<Album> {

    let album:Album = new Album();
    album.id = albumId;
    album.artUrl = artUrl;

    return this.http.put(this.albumUrl + album.id, album, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {
      return res.json();
    }).catch((err:any) => {
      console.log(err);
    });
  }

  addSongToAlbum(albumId:string, songId:string): Promise<void> {
    return this.http.post(this.albumUrl + albumId + '/' + songId, null, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {})
    .catch((err:any) => {
      console.log(err);
    });
  }

  removeSongFromAlbum(albumId:string, songId:string): Promise<void> {
    return this.http.delete(this.albumUrl + albumId + '/' + songId, {headers: this.userSvc.getAuthHeaders()})
    .toPromise()
    .then((res:any) => {})
    .catch((err:any) => {
      console.log(err);
    });
  }

}