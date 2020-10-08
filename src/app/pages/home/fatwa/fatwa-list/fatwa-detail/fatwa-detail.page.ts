import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-fatwa-detail',
  templateUrl: './fatwa-detail.page.html',
  styleUrls: ['./fatwa-detail.page.scss'],
})
export class FatwaDetailPage implements OnInit {
  public id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
      this.id = parseInt(this.route.snapshot.params['id']);
  }

}
