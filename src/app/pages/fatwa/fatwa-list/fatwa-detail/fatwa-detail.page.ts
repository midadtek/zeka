import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-fatwa-detail',
  templateUrl: './fatwa-detail.page.html',
  styleUrls: ['./fatwa-detail.page.scss'],
})
export class FatwaDetailPage implements OnInit, OnDestroy {
  private sub: Subscription;
  public id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route
        .queryParams
        .subscribe(params => {
          this.id = +params['id'];
          console.log(this.id)
        });
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
