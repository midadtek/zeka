import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZekatCategoryPage } from './zekat-category.page';

const routes: Routes = [
  {
    path: '',
    component: ZekatCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZekatCategoryPageRoutingModule {}
