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
   
  }
}
interface Propriety {
  name: string;
  value: boolean;
}
