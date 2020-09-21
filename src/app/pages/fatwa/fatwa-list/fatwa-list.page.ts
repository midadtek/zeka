import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-fatwa-list',
  templateUrl: './fatwa-list.page.html',
  styleUrls: ['./fatwa-list.page.scss'],
})
export class FatwaListPage implements OnInit, OnDestroy {
  public sub: Subscription;
  public name: string;
  private fatawa:[{}] = [{
      gold:{},
      money:{},
      trade:{},
      silver:{},
      stocks:{},
      funds:{}
  }]

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route
        .queryParams
        .subscribe(params => {
          this.name = params['name'];
          console.log(this.name)
        });
  }

  ngOnDestroy() {
   this.sub.unsubscribe()
  }

    onOpenFatwa(id: number) {
        this.router.navigate(['fatwa/fatwa-list/fatwa-detail'], {queryParams: {id:id}});
    }
}
