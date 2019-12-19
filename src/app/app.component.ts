import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { AlertController, LoadingController, NavController } from 
'@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {
  private vibe:boolean;
  private vibration_active:any;
  private interval:any;
  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;
  constructor(
    private oneSignal: OneSignal,
    private vibration:Vibration,
    private nativeAudio: NativeAudio,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private http:HttpClient,

 
    private alertCtrl: AlertController
  ) {
    this.vibration_active=false;
    console.log("INIT ONESIGNAL")
   this.oneSignal.startInit('dc411c31-f344-4ddd-a339-9e1e0016fba3', '294203629540');
    //this.oneSignal.setLogLevel({logLevel: 5, visualLevel: 4});

  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      console.log("NOTIFCATION RECIVED AUTHSTATE: "+this.authenticationService.isAuthenticated());
      if (this.authenticationService.isAuthenticated()){
     // do something when notification is 
    
      console.log(data.payload);
     let type = data.payload['additionalData']['type'] ;
     let machine = data.payload['additionalData']['machine'] ;
     let message = data.payload['additionalData']['message'] ;
    if(type=="ALARM") this.nativeAudio.play('alert');
    if(type=="INFO") this.nativeAudio.play('test2');
      console.log(data);
     this.presentAlert(type,machine+"\n"+message,);
     this.vibrate();
      }
    });
   


    this.oneSignal.handleNotificationOpened().subscribe((data) => {
     
      // do something when a notification is opened
      console.log("HANDLED OPEN PUSHHHHH");
//console.log(data.payload);
      this.presentAlert("ACTION","Alarm Recived");
     
    });
    
    this.oneSignal.endInit();
    
    this.initializeApp();
  }
   

vibrate(){
  console.log("vibrate");
  this.vibration.vibrate([200,100,200,100,200,100,200,100,]);
}
  initializeApp() {
    this.platform.ready().then(() => {
       
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.wav');
      this.nativeAudio.preloadSimple('test2', 'assets/sounds/info.wav');
      
      this.authenticationService.authenticationState.subscribe(state => {
     
        if (state) {
          this.router.navigate(['members/dashboard']);
        } else {
          this.router.navigate(['login']);
        }

      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    
  }
  async presentAlert(type,message){
    this.vibe=true;
    let cssclass = "";
    let header = "";
    if (type=="ALARM") {
      cssclass="alarm";
      header="ALARM";
    }
    if(type=="INFO") {
      cssclass="info";
    header="INFO";
  }
    const  alert = await this.alertCtrl.create({
     header: header,
     message: message,
     buttons: [ {
      text: 'Ok',
      cssClass: cssclass,
      handler: () => {
        this.router.navigate(['alarms']);
        console.log("HANDLED");
      }
    }],
     cssClass: cssclass,  
    
   });
   alert.onDidDismiss().then(
    (data)=>{
console.log("DISMISSED");
this.oneSignal
//clearInterval(this.interval);
    }

   );
  await alert.present();

  
    
  }
}
