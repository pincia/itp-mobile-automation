import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import {Platform, Events, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from  'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(public navCtrl: NavController, public events: Events, private storage: Storage, private plt: Platform,private http:HttpClient) { 
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
         try{
          window["plugins"].OneSignal.deleteTag("codice");
          window["plugins"].OneSignal.sendTag("codice",data['nome']);
         }
         catch(error){
           console.log("EXCEPTION "+error)
         }
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
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
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