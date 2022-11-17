import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  sliderValue: number = 35;
  bufferOffset: number = 70;

  constructor() { }

  ngOnInit(): void {
  }

}
