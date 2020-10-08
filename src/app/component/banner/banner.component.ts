import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  ptime: number;
  timerId;
  counter = 100;
  index;
  locenvironment: { production: boolean; is_local: boolean; base_url: string; };
  constructor(private modalCtr: ModalController) {}
  @Input() banners;
  @Input() id: number;
  ngOnInit() {
    this.locenvironment = environment;
    this.index = this.banners.findIndex(x => x.id === this.id);
    clearTimeout(this.timerId);
    this.ptime = 1;
    this.StartTimer();
  }
  StartTimer() {
    this.timerId = setTimeout(() => {
      if (this.counter <= 0) {
        return;
      }
      this.counter -= 1;
      this.ptime -= 0.01;
      if (this.counter > 0) {
        this.StartTimer();
      } else {
        if (this.index + 1 < this.banners.length) {
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
    if (this.index + 1 < this.banners.length) {
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
