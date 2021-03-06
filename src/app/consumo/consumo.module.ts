import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ChartsModule } from 'ng2-charts';
import { ConsumoPage } from './consumo.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsumoPage]
})
export class ConsumoPageModule {}
