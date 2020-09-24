import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Category_operationsService} from "../../../services/category_operations.service";

@Component({
  selector: 'app-fatwa',
  templateUrl: './fatwa.page.html',
  styleUrls: ['./fatwa.page.scss'],
})
export class FatwaPage implements OnInit {

  constructor(private router: Router, private cat: Category_operationsService) { }

  ngOnInit() {
  }

  async showFatwa(name) {
    await this.router.navigate(['/home/fatwa/fatwa-list'], {queryParams: {name: name}});
  }

}
