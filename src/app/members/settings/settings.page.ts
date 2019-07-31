import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public primaryColor:any;
  constructor(public router: Router) {
    this.primaryColor =  '#44bbec';
  }

   ngOnInit() {
  }
  changePassword(){
    //this.navCtrl.push(ChangepasswordPage);
  };
  
  openCompanySetting(){
    //this.navCtrl.push(CompanySettingsPage)
  }
  getHeaderStyle(){
    return { 'background':this.primaryColor}
  };

  openNotification(){
  //  this.navCtrl.push(NotificationSettingsPage);
  }
  openLeaveTypes(){
   // this.navCtrl.push(LeaveTypesPage);
  }
  openLocalization(){
   // this.navCtrl.push(LocalizationPage);
  }
  openEmailSetting(){
 //   this.navCtrl.push(EmailSettingsPage);
  }
  openSalary(){
  //  this.navCtrl.push(SalarySettingsPage);
  }
  openInvoice(){
   // this.navCtrl.push(InvoiceSettingsPage);
  }
}

 