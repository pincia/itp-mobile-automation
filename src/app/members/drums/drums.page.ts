import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-drums',
  templateUrl: './drums.page.html',
  styleUrls: ['./drums.page.scss'],
})
export class DrumsPage implements OnInit {
  value = 0;
  drumdata:any;
  router:Router;
  public primaryColor: any;
  public current_frame:any[];
  scene:any;
  data_interval:any;
  drums_animations:Timer[];

  constructor( public alertCtrl:AlertController, private pushservice: PushService, private dataService: DataService, private http:HttpClient, router:Router,private modalController:ModalController, private popoverController: PopoverController){
    console.log("DRUMS PAGE CONSTRUCTOR")
    this.router=router;
    this.drums_animations = new Array<Timer>( this.countProperties(pushservice.drumsdata))
   this.primaryColor = localStorage.getItem('primary_color');
    this.current_frame = new Array<number>( this.countProperties(pushservice.drumsdata))
   
    


  }
 countProperties (obj) {
    var count = 0;

    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }

    return count;
}

// Outputs: 4
ionViewWillLeave(){
  for (var i = 0 ; i<this.drums_animations.length ; i++){
    console.log("CLEAR INTERVAL "+i)
    clearInterval(this.drums_animations[i].interval)
  }
  clearInterval(this.data_interval);
}

ionViewWillEnter(){
  for(let i=0;i<this.countProperties(this.pushservice.drumsdata);i++){
    this.current_frame[i]=0;
  }
  for (var i = 0 ; i<this.drums_animations.length ; i++){
    let rpm = parseFloat(this.pushservice.drumsdata[i]['RPM'])
   // rpm = Math.random()*(9 - 3) + 3;
    let direzione = +this.pushservice.drumsdata[i]['DIREZIONE']
  //direzione = Math.trunc(Math.random()*3)
    let frames_per_minute = rpm*52
    let interval_time=0
    if (frames_per_minute == 0) interval_time =20000000
    else interval_time = (1/(frames_per_minute/60))*1000
   // console.log("RPM: "+rpm+ " DIRECTION: "+direzione+" INTERVAL TIME: "+interval_time)
    this.drums_animations[i] = new Timer(interval_time,i,this,direzione)
    
  }
  console.log(this.drums_animations)
  this.getData();
  this.data_interval = setInterval(()=>{ 

  this.getData();
  }, 10000);
  }

  setFrame(i){
    //console.log("SET FRAME "+i)
    let dir = this.drums_animations[i].direzione
    if (dir==1){
      this.current_frame[i]+=1
      if (this.current_frame[i]>51) this.current_frame[i]=0
      
    }
    if (dir==0){
      this.current_frame[i]-=1
      if (this.current_frame[i]<0) this.current_frame[i]=51
    }

}
getData(){
  if(this.drumdata){
    for (var i=0; i<this.drumdata.length; i++){
      if (this.drumdata[i]['RPM']!=this.pushservice.drumsdata[i]['RPM']){
        console.log("velocità cambiata");
        let rpm = parseFloat(this.pushservice.drumsdata[i]['RPM'])
        // rpm = Math.random()*(9 - 3) + 3;
        let direzione = +this.pushservice.drumsdata[i]['DIREZIONE']
       //direzione = Math.trunc(Math.random()*3)
         let frames_per_minute = rpm*52
         let interval_time=0
         if (frames_per_minute == 0) interval_time =20000000
         else interval_time = (1/(frames_per_minute/60))*1000
        // console.log("RPM: "+rpm+ " DIRECTION: "+direzione+" INTERVAL TIME: "+interval_time)
        clearInterval(this.drums_animations[i].interval)
       
        this.drums_animations[i] = new Timer(interval_time,i,this,direzione)
/*
        this.drums_animations[i].interval=
        setInterval(()=>{ 
          
          this.setFrame(i);
         }, interval_time);
         */
      }
    }
  }
     this.drumdata = this.pushservice.drumsdata;
     console.log(this.drumdata)
     console.log(this.drums_animations)
     
     //aggiorno le direzioni

     for (var i = 0 ; i<this.drums_animations.length ; i++){
      // console.log("getData() "+this.drums_animations)
     this.drums_animations[i].direzione=  +this.pushservice.drumsdata[i]['DIREZIONE']

      let rpm = parseFloat(this.pushservice.drumsdata[i]['RPM'])
     //rpm = Math.random()*(9 - 3) + 3; //test
      let direzione = this.pushservice.drumsdata[i]['DIREZIONE']
      //direzione = Math.trunc(Math.random()*2)  //test
       let frames_per_minute = rpm*52
       let interval_time=0
       if (frames_per_minute == 0) interval_time =20000000
       else interval_time = (1/(frames_per_minute/60))*1000
       /*
       clearInterval(this.drums_animations[i].interval)
       this.drums_animations[i].interval = setInterval(()=>{ 
        console.log("SET FRAMEE "+i)
        this.setFrame(i,direzione);
       }, interval_time);*/
    }


}
getHeaderStyle() {
  return { 'background': this.primaryColor }
};
goToODP(event, drum) {
  console.log("GOTO ODP "+drum['ID_ODP']);
 this.router.navigate(['/odp', drum['ID_ODP']]);
 }


async openAlarms(nome) {
  let alarms = [];
  console.log(this.pushservice.alarms)
this.pushservice.alarms.forEach((element: Alarm)=> {

    if(element['NOME_MACCHINA'].includes(nome)){
     alarms.push(element['NOME_ALLARME'])
    }
});
let alarms_text = alarms.toString().replace(/,/g,"<br/>")
console.log(alarms_text)
 const alert = await this.alertCtrl.create({
    header: "ALLARMI",
    //subHeader: event.desc,
    message: alarms_text,
    buttons: [{
      text:"CHIUDI",
      cssClass:"alarm-alert-close-button",
    }],
    cssClass:"alarm-alert",
  });
  alert.present();
}

trackByDrum(index,drum) { 
  return drum.ID; 
}
ngOnInit() {

  }

}

interface Alarm{
nome_macchina:string;
nome_allarme:string;
priorita:string;
}


export class Timer{

  interval_time:number;
  index:number;
  public direzione:number;
  public interval:any;
  constructor (interval_time,index,page:DrumsPage,dir){
    console.log("CREATA ANIMAZIONE "+index)
    this.interval_time=interval_time
    this.index=index
    this.direzione=dir;

    this.interval = setInterval(()=>{ 

      page.setFrame(index);
     }, interval_time);
  }

}