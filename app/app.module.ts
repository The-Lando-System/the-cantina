import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import 'hammerjs/hammer.js';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Logger } from 'angular2-logger/core';
import { ChartsModule } from 'ng2-charts';

import { UserService, Broadcaster } from 'sarlacc-angular-client';
import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SongPlayerComponent } from './song-player/song-player.component';
import { SongListComponent } from './song-list/song-list.component';
import { UploaderComponent } from './uploader/uploader.component';
import { SongEditorComponent } from './song-editor/song-editor.component';

import { LoadingBarComponent } from './common/loading-bar/loading-bar.component';

import { Globals } from './globals';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    LoadingBarComponent,
    SongPlayerComponent,
    SongListComponent,
    UploaderComponent,
    SongEditorComponent
  ],
  providers: [
    Logger,
    CookieService,
    Broadcaster,
    UserService,
    Globals
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
