import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'particletext',
  templateUrl: './particletext.component.html',
  styleUrls: ['./particletext.component.scss'],
})
export class ParticletextComponent implements OnInit {
  @Input()
  type: "bubbles" | "lines" | "hearts" | "confetti" | "fire" | "sunbeams" = "lines";
  randomNumbers = [];

  constructor() {
    Array(10000).fill(0).forEach(() => {
      this.randomNumbers.push(Math.random())
    })
  }

  getArray(n: number) {
    n = Math.round(n);
    return Array(n).fill(0);
  }

  getRandom(set: number, i: number, m: number, n: number, suffix: string = ""): string {
    /*
    suffix="vmin";
    var factor=.3;
    set=set*factor*2;
    m=m*factor;
    n=n*factor/1.2;

*/


    return (Math.floor(this.randomNumbers[set * 1000 + i] * (n - m + 1)) + m) + suffix;
  }

  ngOnInit() {

  }

}
