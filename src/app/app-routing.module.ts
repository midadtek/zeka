import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {InitialGuard} from "./services/initial.guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path : 'home',
    children: [{
      path: '',
      loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
      canLoad:[InitialGuard]

    },

      {
      path: 'zekat-category',
        children:[{
        path: '',
      loadChildren: () => import('./pages/home/zekat-category/zekat-category.module').then(m => m.ZekatCategoryPageModule)
        },
          {
            path: 'add-new-value',
            loadChildren: () => import('./pages/home/zekat-category/add-new-value/add-new-value.module').then(m => m.AddNewValuePageModule)
          }]
    },
      {
        path: 'wallet',
        children:[{
          path:'',
          loadChildren: () => import('./pages/home/wallet/wallet.module').then( m => m.WalletPageModule)
        },
          {
            path: ':id',
            loadChildren: () => import('./pages/home/wallet/added-values/added-values.module').then(m => m.AddedValuesPageModule)
          }
          ]
      },
      {
        path: 'fatwa',
        children:[{
          path: '',
          loadChildren: () => import('./pages/home/fatwa/fatwa.module').then( m => m.FatwaPageModule)
        },
          {
            path: 'fatwa-list',
            children:[{
              path:':id',
              children: [{
                path:'',
            loadChildren: () => import('./pages/home/fatwa/fatwa-list/fatwa-list.module').then( m => m.FatwaListPageModule),
              },
                {
                  path:'fatwa-detail',
                  children:[{
                    path:':id',
                    loadChildren: () => import('./pages/home/fatwa/fatwa-list/fatwa-detail/fatwa-detail.module').then( m => m.FatwaDetailPageModule),
                    }]
                }]
            }
            ]
          },
        ]
      },

      {
        path: ':id',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
      },
      ]
  },

  // {
  //   path: 'zekat-category',
  //   children: [{
  //     path: '',
  //     loadChildren: () => import('./pages/zekat-category/zekat-category.module').then(m => m.ZekatCategoryPageModule)
  //   },

    // ],
  // },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  // },
  // {
  //   path: 'wallet',
  //   children:[{
  //     path:'',
  //   loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  //   },
  //     {
  //       path: ':id',
  //       loadChildren: () => import('./pages/wallet/added-values/added-values.module').then(m => m.AddedValuesPageModule)
  //
  //     }]
  // },
  // {
  //   path: 'contact',
  //   loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  // },
  // {
  //   path: 'fatwa',
  //   children:[{
  //     path: '',
  //   loadChildren: () => import('./pages/fatwa/fatwa.module').then( m => m.FatwaPageModule)
  //   },
  //     {
  //       path: 'fatwa-list',
  //       loadChildren: () => import('./pages/fatwa/fatwa-list/fatwa-list.module').then( m => m.FatwaListPageModule)
  //     },
  //     {
  //       path: 'fatwa-detail',
  //       loadChildren: () => import('./pages/fatwa/fatwa-list/fatwa-detail/fatwa-detail.module').then( m => m.FatwaDetailPageModule)
  //     }]
  // },
  // {
  //   path: 'add-new-value',
  //   loadChildren: () => import('./pages/add-new-value/add-new-value.module').then( m => m.AddNewValuePageModule)
  // },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
