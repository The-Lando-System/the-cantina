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

import { AppComponent }  from './views/app.component';
import { HomeComponent } from './views/home/home.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { LoginComponent } from './views/login/login.component';
import { SongPlayerComponent } from './views/song-player/song-player.component';
import { SongListComponent } from './views/song-list/song-list.component';
import { UploaderComponent } from './views/uploader/uploader.component';
import { SongEditorComponent } from './views/song-editor/song-editor.component';
import { AlbumListComponent } from './views/album-list/album-list.component';
import { AlbumEditorComponent } from './views/album-editor/album-editor.component';
import { AlbumCreatorComponent } from './views/album-creator/album-creator.component';
import { LoadingBarComponent } from './views/common/loading-bar/loading-bar.component';
import { SoundWavesComponent } from './views/common/sound-waves/sound-waves.component';
import { SongQueueComponent } from './views/song-queue/song-queue.component';
import { SeekBarComponent } from './views/common/seek-bar/seek-bar.component';

import { SongQueueService } from './services/song-queue.service';

import { Globals } from './services/globals';

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
    SongEditorComponent,
    SoundWavesComponent,
    AlbumListComponent,
    AlbumEditorComponent,
    AlbumCreatorComponent,
    SongQueueComponent,
    SeekBarComponent
  ],
  providers: [
    Logger,
    CookieService,
    Broadcaster,
    UserService,
    Globals,
    SongQueueService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
