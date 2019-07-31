import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { BarcodeService } from 'src/app/barcode.service';
import { Events, AlertController } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-tank',
  templateUrl: './tank.page.html',
  styleUrls: ['./tank.page.scss'],
  providers: [BarcodeService],
})
export class TankPage implements OnInit {
  public id: any;
  public tank: any;
  public riciclo: boolean;
  public filling: boolean;
  public mixing: boolean;
  public riciclo_class: string;
  public filling_class: string;
  public mixing_class: string;
  public abilitazione: boolean;
  public percentage:number;
  public status_class:string;
  public status:string; 
  public displaySpinner:string;
  public displayTank:string;
  constructor(private pushservice: PushService , private tts: TextToSpeech,public router:Router, public atrCtrl: AlertController, public events:Events, private barcodeProvider: BarcodeService,private dataService: DataService , private route: ActivatedRoute, private http:HttpClient) { 
    this.tank =  { ID: "pippo" , NOME:""};
    this.riciclo =false;
    this.mixing =false;
    this.filling =false;
    this.percentage = 50;
    this.status_class = "stopped";
    this.displayTank="none";
    this.displaySpinner="block";

    this.status = "STOP";
    this.abilitazione=this.randomInt(0, 1);      
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       this.id = queryParams.get('id');
       console.log("TROVATO PARAMETRO ID:"+this.id);
       
    });
    this.getData();
    var interval = setInterval(()=>{ 
     this.getData();

    }, 500);
 
  }

  ionViewWillEnter(){
  //  A scan has been received
  this.events.subscribe('data:scan', (scanData, time) => {
    //  Update the list of scanned barcodes
    let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
    let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
    //this.scans.unshift({ "data": scannedData, "type": scannedType, "timeAtDecode": time });
    console.log("ZEBRA RECIVED CODE TANK PAGE HANDLER " + scannedData);

    if(scannedData==this.tank.NOME+"_START"){
      this.tts.speak({
        text: "Carico Avviato",
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
      return;
    }
    if(scannedData==this.tank.NOME+"_STOP"){
      this.tts.speak({
        text: "Carico Arrestato",
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
      return; 
    } 
    
    this.tts.speak({
      text: "comando non riconosciuto",
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
    
  });

   }
   ionViewWillLeave(){
     this.events.unsubscribe('data:scan');
   }
  ngOnInit() {

  }

  getData(){
   let tanks = this.pushservice.tanksdata;
   for (let _tank of tanks){
     if (_tank.ID == this.id){
       this.tank = _tank;
       this.displaySpinner="none";
       this.displayTank="block";
       this.percentage=this.tank.PERCENTAGE;
     
     }
   }
      if (this.tank.RECYCLE){
        this.riciclo_class="working";
      }
      else{
        this.riciclo_class="";
      }
      if (this.tank.FILLING){
        this.filling_class="working";
      }
      else{
        this.filling_class="";
      }
      if (this.tank.MIXING){
        this.mixing_class="working";
      }
      else{
        this.mixing_class="";
      }
      
    }
  
  randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 public fabDown() {
  console.log("ZEBRA FABDOWN");
  //this.logincode('ItalProgetti');
  this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
}

//  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
public fabUp() {
  console.log("ZEBRA FABDOWN");
  this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
}
async presentAlert(message) {
  const alert = await this.atrCtrl.create({
    header: 'Alert',
    subHeader: 'Subtitle',
    message: message,
    buttons: ['OK']
  });

  await alert.present();
}
getColor(tank){
  return "rgb("+tank.LIQUID_COLOR+")";

}
}
