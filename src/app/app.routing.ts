import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MerchantLayoutComponent } from './layouts/merchant-layout/merchant-layout.component';
import { RootAdminLayoutComponent } from './layouts/root-admin-layout/root-admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { RootCreationComponent } from './pages/root-creation/root-creation.component';
import { RootWelcomeComponent } from './pages/root-welcome/root-welcome.component';

const routes: Routes =[
  /*{
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  }, */
  {
    path: '', component: RootWelcomeComponent
  },
  {
    path: 'rootCreation', component: RootCreationComponent
  }, //ruta /
  {
    path: '',
    component: RootAdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/root-admin-layout/root-admin-layout.module#RootAdminLayoutModule'
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      }
    ]
  },
  {
    path: '',
    component: MerchantLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/merchant-layout/merchant-layout.module#MerchantLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'userCreation' //poner página 404
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})

export class AppRoutingModule { }
