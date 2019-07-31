import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
  codice_impianto:string;
  websocket_on:boolean;
  impianti = environment.impianti;
  constructor(private storage:Storage) {
    this.storage.get("codice_impianto").then(res => {
    if (res) {
      this.codice_impianto=res;      
    }
   else{
     this.codice_impianto="";
   }
 
 });
 this.storage.get("websocket_on").then(res => {
   if (res) {
      this.websocket_on=res;      }
   else{
     this.websocket_on=false;
   } 
 });

   }

  ngOnInit() {
  }

  getHeaderStyle() {
    return { background: this.primaryColor };
  }
  setPropriety(propriety){
    this.storage.get(propriety).then(res => {


    this.storage.set(propriety, !res).then(res2 => {
    })

  });

  }

  onChange(value){
    this.codice_impianto=value;
    this.storage.set("codice_impianto",value)
    window["plugins"].OneSignal.deleteTag("codice");
    window["plugins"].OneSignal.sendTag("codice",value);
    this.impianti.forEach(impianto=>{
      console.log(impianto);
      console.log(impianto.codice_impianto);
      if(impianto.codice_impianto==this.codice_impianto){
        this.storage.set("api_host",impianto.api_host);
        this.storage.set("socket_host",impianto.socket_host);
        this.storage.set("codice_registrazione",impianto.codice_registrazione);
      }
    })
  }
}
interface Propriety {
  name: string;
  value: boolean;
}
