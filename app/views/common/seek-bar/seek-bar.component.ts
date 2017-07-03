import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'seek-bar',
  templateUrl: 'seek-bar.component.html',
  styleUrls: [ 'seek-bar.component.css' ]
})
export class SeekBarComponent implements OnInit{

  private position: string;

  @Input('seekVal')
  set value(seekVal:number) {
    this.seek(seekVal);
  }

  constructor() {

  }

  ngOnInit(): void {

  }

  seek(value:number): void {
    this.position = value + '%';
  }

}