import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: [ ]
})
export class HomeComponent implements OnInit {

  constructor(
    private userSvc: UserService
  ){}

  ngOnInit(): void {
    this.userSvc.returnUser().then((user:User) => {}).catch((res:any) => {});
  }

  isUserAdmin(): boolean {
    return this.userSvc.isAdminForApp('the-cantina');
  } 

}