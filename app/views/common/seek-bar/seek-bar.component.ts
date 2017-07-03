import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'seek-bar',
  templateUrl: 'seek-bar.component.html',
  styleUrls: [ 'seek-bar.component.css' ]
})
export class SeekBarComponent implements OnInit{

  private position: string;
  private seekVal: number;

  constructor() {
    this.seekVal = 0;
    setInterval(() => {
      if (this.seekVal === 100) {
        return;
      }
      this.seekVal = this.seekVal + 1;
      this.seek(this.seekVal);
    }, 1000);
    
  }

  ngOnInit(): void {

  }

  seek(value:number): void {
    console.log(value);
    this.position = value + '%';
  }

}