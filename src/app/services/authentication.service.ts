import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import {Platform, Events, NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from  'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Router } from '@angular/router';
const TOKEN_KEY = 'authtoken';
const USER_KEY = 'userdata';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
 public authenticationState = new BehaviorSubject(false);
  public host:any;
  isLoggedIn:boolean;
  token:any;
appdata:any;
  constructor( private router:Router, private nativeAudio: NativeAudio, private alertCtrl: AlertController,  private oneSignal: OneSignal, public navCtrl: NavController, public events: Events, private storage: Storage, private plt: Platform,private http:HttpClient) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
    this.host ="http://3.16.169.253";
    this.appdata = new Storage({
      name: '__my_custom_db',
      storeName: '_appdata',
      driverOrder: ['sqlite', 'localstorage' ]
    });
   
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  login(id:string,password:string,plant_code:string):Observable<AuthResponse> {
    let url:string = "http://3.16.169.253/itproxy/public/login";
    let user = {"username": id, "password": password, "plant_code": plant_code};
    return  this.http.post(url,user).pipe(
      tap((res:  AuthResponse) => {
        this.token = res.success.token;
        this.registerOnesignal();
         this.storage.set(TOKEN_KEY, this.token).then(
          () => {
            
          },
          error => console.error('Error storing authtoken item', error)
        );
         this.storage.set(USER_KEY, res.success.user).then(
          () => {
          },
          error => console.error('Error storing user_data item', error)
        );
        let url = 'http://3.16.169.253/itproxy/public/api/impianto/'+plant_code;
        console.log(url)
        const httpOptions = {
          headers: new HttpHeaders({
            "Authorization" : "Bearer " + this.token,
          })
        };
        
        this.http.get(url,httpOptions).subscribe(data => {

          this.storage.get("notify_alarm").then(res => {
            if(res){
                      try{
                       this.oneSignal.deleteTag("codice");
                       this.oneSignal.sendTag("codice",data['nome']);
                      }
                      catch(error){
                        console.log("EXCEPTION "+error)
                      }
              }
            })

         this.storage.set("plant_name", data['nome']).then(
          () => { console.log("plant_name STORED: "+data['nome'])
          },
          error => console.error('Error storing plant_name item', error)
        );
        
        
        })



        
        this.isLoggedIn = true;
        this.authenticationState.next(true);
      },
          err => {err=err
            this.isLoggedIn = false;
           console.log(err);
           this.authenticationState.next(false);}
 
      ));
  }
 
    loginWithCode(code:string) {
      let route:string ="http://"+this.host+'logincode/'+code;
 
      this.http.get(route).subscribe(data => {
    
       if (data!='0'){
          console.log("OK LOGGED");
           this.storage.set(TOKEN_KEY, code).then(() => {
          this.authenticationState.next(true);});
          var res= true;
          this.events.publish('login: done', res);
       }
       else{
      
        var res= false;
        this.events.publish('login: done', res);
       }
      })
      
  }
 
  logout(){ 
    this.storage.remove(USER_KEY);
    //DISATTIVO LA RICEZIONE DI NOTIFICHE
    window["plugins"].OneSignal.deleteTag("codice");
    console.log("DELETED ONESIGNAL CODICE TAG")
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
    
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }

  registerOnesignal(){
 console.log("INIT ONESIGNAL")
   this.oneSignal.startInit('dc411c31-f344-4ddd-a339-9e1e0016fba3', '294203629540');
    //this.oneSignal.setLogLevel({logLevel: 5, visualLevel: 4});

  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
    
    
      console.log(data.payload);
     let type = data.payload['additionalData']['type'] ;
     let machine = data.payload['additionalData']['machine'] ;
     let message = data.payload['additionalData']['message'] ;
    if(type=="ALARM") this.nativeAudio.play('alert');
    if(type=="INFO") this.nativeAudio.play('test2');
    
      console.log(data);
     this.presentAlert(type,machine+"\n"+message,);
   
      
    });
   


    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      /*
      let type = data.payload['additionalData']['type'] ;
      let machine = data.payload['additionalData']['machine'] ;
      let message = data.payload['additionalData']['message'] ;*/
      // do something when a notification is opened
      console.log("HANDLED OPEN PUSHHHHH");
//console.log(data.payload);
      this.presentAlert("ACTION","Alarm Recived");
     
    });
    
    this.oneSignal.endInit();
  }

  unregisterOnesignal(){
    
  }

  async presentAlert(type,message){
    //this.vibe=true;
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

export interface AuthResponse {
  success:{
  user: {
    id: number,
    
    name: string,
    username: string,
    email: string,
    email_verified_at: string,
    password: string,
      plant_code: string,
      role: string,
      address: string,
      remember_token: string,
      created_at: string,
   
  }
  token:string,
  token_type:string,
}
}