import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Device } from '@ionic-native/device/ngx';
import { FormBuilder } from '@angular/forms';
import { Events, AlertController, Platform, ToastController, NavController, ModalController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CaricoModalPage } from 'src/app/modals/carico-modal/carico-modal.page';
import { DataService } from 'src/app/services/data.service';
import { PushService } from 'src/app/services/push.service';
//import { CaricoModalPage } from 'src/app/modals/carico-modal/carico-modal.page';



@Component({
  selector: 'app-storage',
  templateUrl: './storage.page.html',
  styleUrls: ['./storage.page.scss'],
  providers: [Device],
})
export class StoragePage implements OnInit , OnDestroy {
  private code : string;
  router:Router;
  tanksdata:any;
  interval:any;
  public constructor(private pushservice: PushService, private dataService: DataService, private authService: AuthenticationService, public navCtrl: NavController, 
    public events: Events, private changeDetectorRef: ChangeDetectorRef, private device: Device,
    private http:HttpClient, router:Router,public modalController: ModalController,
    private alertController: AlertController, private platform: Platform, private toastController: ToastController) {
      this.code = "";
      this.router=router;
      this.tanksdata = dataService.tanksdata;
    
    this.getData();
    this.interval = setInterval(()=>{ 
     this.getData();
    
    }, 500);
  


    };
  ngOnInit() {
    console.log("URL    "+this.router.url);
  }
  //  Function to handle the floating action button onDown.  Start a soft scan.
  
  ngOnDestroy(): void {
    clearInterval(this.interval);
   }
getData(){
  this.tanksdata = this.pushservice.tanksdata;
  
}
  goToTank(event, tank) {
   console.log("GOTO TANKKKKKK"+tank);
  this.router.navigate(['/members/tank', tank['ID']]);
  }
  ionViewWillEnter(){


    console.log(this.router.url);
  }

  getColor(tank){
    return "rgb("+tank.LIQUID_COLOR+")";
  
}
  async openModal(){
    console.log("Opne modal");
    const modal = await this.modalController.create({
      component: CaricoModalPage
   
      
    });
    modal.onDidDismiss().then((data) => {
      if (data !== null) {
        console.log('The result:', data);
      }
   });
    modal.present();
  }
  trackByTank(index,tank) { 
    return tank.ID; 
  }
}
