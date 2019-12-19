import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-notifiche',
  templateUrl: './notifiche.page.html',
  styleUrls: ['./notifiche.page.scss'],
})
export class NotifichePage implements OnInit {
  primaryColor = '#44bbec';
  secondryColor = '#0163fc';
  notify_alarm: boolean;
  codice_impianto:any;
  constructor(private storage: Storage,  private oneSignal: OneSignal) {
    this.storage.get("notify_alarm").then(res => {
      if (res) {
        this.notify_alarm = res;
      }
      else {
        this.notify_alarm = false;
      }
    });
    this.storage.get("codice_impianto").then(res => {
      if (res) {
        this.codice_impianto = res;
      }
      else {
        this.codice_impianto = "test";
      }
    });
  }

  ngOnInit() {
  }
  getHeaderStyle() {
    return { background: this.primaryColor };
  }
  setPropriety(propriety) {
    this.storage.get(propriety).then(res => {
      this.storage.set(propriety, !res).then(res2 => {
        this.oneSignal.startInit('dc411c31-f344-4ddd-a339-9e1e0016fba3', '294203629540');
        if(!res==false){ 
          this.oneSignal.deleteTag("codice");
        }
        else{
          this.oneSignal.deleteTag("codice");
          this.oneSignal.sendTag("codice","wollsdorf_test");//TEST

      //   this.oneSignal.sendTag("codice",this.codice_impianto);
        }
        this.oneSignal.endInit();
      })

    });

  }
}
interface Propriety {
  name: string;
  value: boolean;
}