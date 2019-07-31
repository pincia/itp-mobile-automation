import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from './menu.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
const routes: Routes = [ 
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: '../members/dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path: 'profile',
        loadChildren: '../members/profile/profile.module#ProfilePageModule'
      }
    
    ]
  },
  {
    path: '',
    redirectTo: '/menu/dashboard',
  }
];

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
