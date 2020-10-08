import {Component, OnInit} from '@angular/core';
import {Category_operationsService} from '../../../services/category_operations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-zekat-category',
  templateUrl: './zekat-category.page.html',
  styleUrls: ['./zekat-category.page.scss'],
})
export class ZekatCategoryPage implements OnInit {

  constructor(private category: Category_operationsService, private router: Router) { }
  // tslint:disable-next-line: variable-name
  zekat_category: any[];
  ngOnInit() {
    this.category.getAllCategory().subscribe(data => {
      this.zekat_category = data;
    });
}
  onAddValue(id) {
    this.router.navigate(['/home/zekat-category/add-new-value'], {queryParams: {id}});
  }
}
