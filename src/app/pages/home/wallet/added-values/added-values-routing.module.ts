import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddedValuesPage } from './added-values.page';

const routes: Routes = [
  {
    path: '',
    component: AddedValuesPage
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddedValuesPageRoutingModule {}
