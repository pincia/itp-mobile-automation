import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-notifiche',
  templateUrl: './notifiche.page.html',
  styleUrls: ['./notifiche.page.scss'],
})
export class NotifichePage implements OnInit {
  primaryColor = '#44bbec';
  secondryColor = '#0163fc';
  notify_alarm: boolean;
  notify_info: boolean;
  constructor(private storage: Storage) {
    this.storage.get("notify_alarm").then(res => {
      if (res) {
        this.notify_alarm = res;
      }
      else {
        this.notify_alarm = false;
      }
    });
    this.storage.get("notify_info").then(res => {
      if (res) {
        this.notify_info = res;
      }
      else {
        this.notify_info = false;
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
      })

    });

  }
}
interface Propriety {
  name: string;
  value: boolean;
}