import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './../../services/authentication.service'
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';
import { Events, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { BarcodeService } from 'src/app/barcode.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [BarcodeService, Device],
})
export class LoginPage implements OnInit {

  private showPasswordText;
  private loginForm: FormGroup;
  private code: string;
  public impianti:any;
  public displaySpinner:string;
  public codice_impianto:string;
  public constructor(public events:Events,public router:Router, private authService: AuthenticationService, private formBuilder: FormBuilder, public navCtrl: NavController, private barcodeProvider: BarcodeService,
    private changeDetectorRef: ChangeDetectorRef, private device: Device,
    public onesignal:OneSignal,
    public storage:Storage,
    private alertController: AlertController, private platform: Platform, private toastController: ToastController) {
    this.code = "";
   
    this.impianti=environment.impianti;
    this.showPasswordText=false;
    this.displaySpinner="none";
    this.loginForm = this.formBuilder.group({
      id: ['', Validators.required],
      password: [''],
      codice_impianto:['']
    });
    

  }
  ionViewWillEnter(){
    console.log(this.codice_impianto)
    this.storage.get("codice_impianto").then(val=>{
      this.codice_impianto=val; 
      console.log(this.codice_impianto)
    });

  }
  ionViewWillLeave(){

    this.displaySpinner="none";
  
  }
 
  

  ngOnInit() {
    this.events.subscribe('login: done', (res) => {
      this.displaySpinner="none";
    });
    console.log("ngOnInit")
  }
  user = {}

  login() {
    console.log(this.user);
    this.displaySpinner="block";

  this.authService.login(this.user['id'], this.user['password'], this.codice_impianto).subscribe(
    res => {
     
      this.displaySpinner="none";
      this.loginForm.reset();
    },          
    err => {
      this.presentToast("LOGIN E PASSWORD ERRATI")
      this.displaySpinner="none";
    },     
    () => {console.log('all done!');
  }
  );
    
  }

  logincode(code: string) {
    this.displaySpinner="block";
    let param = code.split("_")
    this.authService.login(param[0],param[1],param[2]).subscribe(
      res => {
       
        this.displaySpinner="none";
      },          
      err => {
      
        this.displaySpinner="none";
      },     
      () => {console.log('all done!');
    }
    );
      this.loginForm.reset();
    }

  scanLogin() {
  }
  

  onChange(value){
    
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  reset(){
    
  }
}


interface Propriety {
  name: string;
  value: boolean;
}
