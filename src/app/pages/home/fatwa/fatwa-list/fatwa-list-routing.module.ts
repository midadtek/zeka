import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FatwaListPage } from './fatwa-list.page';

const routes: Routes = [
  {
    path: '',
    component: FatwaListPage
  },
  // {
  //   path: 'fatwa-detail',
  //   loadChildren: () => import('./fatwa-detail/fatwa-detail.module').then( m => m.FatwaDetailPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FatwaDetailsPageRoutingModule {}
