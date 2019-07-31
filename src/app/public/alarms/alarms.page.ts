import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { PushService } from 'src/app/services/push.service';



@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
})
export class AlarmsPage implements OnInit {
  public alarms:any;
  public text:string;
  interval:any;
  constructor(private pushservice:PushService, private tts: TextToSpeech, private vibration:Vibration, private dataService: DataService) {
    this.alarms = pushservice.alarms;

   // this.text = 'Allarme '+this.alarms[0]['NOME_MACCHINA']+' '+this.alarms[0]['NOME_ALLARME'].toLowerCase( );
    this.text=""; 
    this.getData();
    this.interval = setInterval(()=>{ 
     this.getData();
    }, 500);
  }


getData(){
  this.alarms = this.pushservice.alarms;

}

  ngOnInit() {
    if(this.dataService.vibration ){
      this.vibration.vibrate([200,100,200,100,200,100,200,100,]);
      this.dataService.vibration = false;

    }
    this.tts.speak({
      text: this.text,
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }


  buttonClick(alarms,index){
    console.log("PIPPO ALARM!");
  }
  trackByAlarm(index,alarm) { 
    return alarm['id_auto']; 
  }
}
