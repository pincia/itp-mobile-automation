import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IonicModule } from '@ionic/angular';

import { OdplistPage } from './odplist.page';

const routes: Routes = [
  {
    path: '',
    component: OdplistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OdplistPage]
})
export class OdplistPageModule {}
