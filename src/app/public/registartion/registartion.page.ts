
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule ,FormControl} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';


import { Http } from '@angular/http';
import { Route, Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
@Component({
  selector: 'app-registartion',
  templateUrl: './registartion.page.html',
  styleUrls: ['./registartion.page.scss'],
})
export class RegistartionPage implements OnInit {
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
  impianti = environment.impianti;
  public loginForm:FormGroup;
  host:any;
  user:user;
  public displaySpinner:any;
  constructor(public router:Router , public toastController: ToastController,private storage: Storage,public http:Http , private fb: FormBuilder) { 
   
    this.displaySpinner="none";
    this.user={nome:"",cognome:"",username:"",email:"",password:"",c_password:"",plant_code:"",codice_registrazione:"",address:"",role:""};
    this.loginForm = fb.group({
      nome: ["", [Validators.required,]],
      cognome: ["", [Validators.required,]],
      username: ["", [Validators.required,]],
      role: ["", [Validators.required,]],
      address: ["", [Validators.required,]],
      password: ["", [Validators.required,]],
      c_password: ["", [Validators.required,]],
      email: ["", [Validators.required,]],
      plant_code: ["", [Validators.required,]],
      codice_registrazione: ["", [Validators.required,]]
    });
  }

  ngOnInit() {
  }
  register(){
    this.displaySpinner="block";
console.log("REGISTER "+this.user)
      this.http.post("http://3.16.169.253/itproxy/public/register", this.user)
          .subscribe(data => {
            this.displaySpinner="none";
           if (data.status=201){
            this.presentToast("UTENTE CREATO");
            this.loginForm.reset();
            this.router.navigateByUrl("/");
           }
            
           }, error => {
           this.displaySpinner="none";
           this.presentToast("UTENTE NON CREATO");
           console.log(error);
           
          });
    }
 
  

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}

interface user{
  nome:string,
  cognome:string,
  username: string,
  role:string,
  email: string,
  password: string,
  c_password:string,
  plant_code:string,
  codice_registrazione,
  address:string,
}
