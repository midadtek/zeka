import {Component, OnInit} from '@angular/core';
import {Category_operationsService} from '../../../services/category_operations.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-zekat-category',
  templateUrl: './zekat-category.page.html',
  styleUrls: ['./zekat-category.page.scss'],
})
export class ZekatCategoryPage implements OnInit {
  public zekat_category;
  constructor(private categoryService: Category_operationsService, private router: Router) { }
  ngOnInit() {
 this.zekat_category = this.categoryService.categoryList;
}
  onAddValue(id) {
    this.router.navigate(['/home/zekat-category/add-new-value'], {queryParams: {id: id}});
  }
}