import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: './public/login/login.module#LoginPageModule'},
    {path: 'members/recipe', canActivate: [AuthGuard], loadChildren: './members/recipe/tabs/tabs.module#TabsPageModule'},
    // { path: '',  canActivate: [AuthGuard], loadChildren: './menu/menu.module#MenuPageModule'},
    { path: 'odp/:idodp',  canActivate: [AuthGuard], loadChildren: './members/odp/odp.module#OdpPageModule' },
    {path: 'storage', loadChildren: './members/storage/storage.module#StoragePageModule'},
    {path: 'drums', canActivate: [AuthGuard], loadChildren: './members/drums/drums.module#DrumsPageModule'},
    { path: 'settings',  loadChildren: './members/settings/settings.module#SettingsPageModule' },
  
    {path: 'modal', loadChildren: './modals/modal/modal.module#ModalPageModule'},
    { path: 'feedbacks', loadChildren: './settings/feedbacks/feedbacks.module#FeedbacksPageModule' },
    { path: 'polveri', loadChildren: './polveri/polveri.module#PolveriPageModule' },
    { path: 'consumo/:odp', loadChildren: './consumo/consumo.module#ConsumoPageModule' },
    { path: 'odplist/:stato', loadChildren: './odplist/odplist.module#OdplistPageModule' },
    { path: 'notifiche', loadChildren: './settings/notifiche/notifiche.module#NotifichePageModule' },
    { path: 'registartion', loadChildren: './public/registartion/registartion.module#RegistartionPageModule' },
  { path: 'forgotpassword', loadChildren: './public/forgotpassword/forgotpassword.module#ForgotpasswordPageModule' },
  { path: 'calendar', loadChildren: './calendar/calendar.module#CalendarPageModule' },
    { path: 'general', loadChildren: './settings/general/general.module#GeneralPageModule' },
    {path: 'members/tank', loadChildren: './members/tank/tank.module#TankPageModule'},
    {path: 'members/tank/:id', loadChildren: './members/tank/tank.module#TankPageModule'},
    {path: 'carico-modal', loadChildren: './modals/carico-modal/carico-modal.module#CaricoModalPageModule'},
    {path: 'alarms', loadChildren: './public/alarms/alarms.module#AlarmsPageModule'},
    {path: 'profile', loadChildren: './members/profile/profile.module#ProfilePageModule'},
    {path: 'carico', loadChildren: './members/carico/carico.module#CaricoPageModule'},
    {path: 'members/checkproduct/:drum/:step/:odp', loadChildren: './members/checkproduct/checkproduct.module#CheckproductPageModule'},
    {path: 'members/control/:idodpfasi/:idazione/:numerico', loadChildren: './members/recipe/control/control.module#ControlPageModule'},
    {
        path: 'members/controlslist/:idodpfasi/:idazionegroup',
        loadChildren: './members/recipe/controlslist/controlslist.module#ControlslistPageModule'
    },
    {path: '', loadChildren: './menu/menu.module#MenuPageModule'},
  { path: 'home-menu-popover-page', loadChildren: './popover/home-menu-popover-page/home-menu-popover-page.module#HomeMenuPopoverPagePageModule' },

 
  

  
  
  

  
  ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { /*preloadingStrategy: PreloadAllModules, enableTracing: true*/}), CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
