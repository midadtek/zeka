import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-fatwa-list',
  templateUrl: './fatwa-list.page.html',
  styleUrls: ['./fatwa-list.page.scss'],
})
export class FatwaListPage implements OnInit{
  public sub: Subscription;
  public name: string;
    public id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
      this.id = parseInt(this.route.snapshot.params['id']);
  }


}
