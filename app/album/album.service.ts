import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserService } from 'sarlacc-angular-client';

import { Globals } from '../globals';

import { Album } from './album';

@Injectable()
export class AlbumService {

  constructor(
    private http: Http,
    private userSvc: UserService
  ){}

  globals: Globals = new Globals();

  private albumUrl = this.globals.svc_domain + '/albums/';

}