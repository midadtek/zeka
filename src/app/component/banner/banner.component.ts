import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  ptime: number;
  timerId;
  counter = 100;
  constructor(private modalCtr: ModalController) {}
  @Input() banners: string[];
  @Input() index: number;
  ngOnInit() {
    clearTimeout(this.timerId);
    this.index++;
    this.ptime = 1;
    this.StartTimer();
  }
  StartTimer() {
    this.timerId = setTimeout(() => {
      if (this.counter <= 0) {
        return
      }
      this.counter -= 1;
      this.ptime -= 0.01;
      if (this.counter > 0) {
        this.StartTimer();
      } else {
        if (this.index < this.banners.length) {
          this.counter = 100;
          this.StartTimer();
          this.index++;
          this.ptime = 1;
        } else {
          clearTimeout(this.timerId);
          this.modalCtr.dismiss();
        }
      }
    }, 100);
  }
  next() {
    if (this.index < this.banners.length) {
      clearTimeout(this.timerId);
      this.counter = 100;
      this.StartTimer();
      this.index++;
      this.ptime = 1;
    } else {
      this.modalCtr.dismiss();
    }
  }
  cancel() {
    clearTimeout(this.timerId);
    this.modalCtr.dismiss();
  }
  close() {
    clearTimeout(this.timerId);
    this.modalCtr.dismiss();
  }
}