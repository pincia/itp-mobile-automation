import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BarcodeService } from 'src/app/barcode.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PushService } from 'src/app/services/push.service';
@Component({
  selector: 'app-checkproduct',
  templateUrl: './checkproduct.page.html',
  styleUrls: ['./checkproduct.page.scss'],
  providers: [BarcodeService],
})
export class CheckproductPage implements OnInit {
  public drum:string;
  public step:string;
  public odp:string;
  public drumid:number;
  public product:string;
  public productsdata:any;
  public displayDrum:string;
  public stato:number;
  public displayProdotto:string;
  public displaySpinner:string;
  public feed_vocal:boolean;
  public message:string;
  constructor(private pushservice: PushService,private storage:Storage,private route: ActivatedRoute,public router:Router,private dataService: DataService,private events:Events, private tts: TextToSpeech, private barcodeProvider: BarcodeService) {
    this.displayDrum = "none";
    this.displayProdotto = "none";
    this.displaySpinner = "none";
    this.stato = 0;
    this.message="SCANSIONA CODICE BOTTALE";
    this.productsdata =pushservice.productsdata;
    this.route.paramMap.subscribe((queryParams: ParamMap) => {
      this.drum = queryParams.get('drum');
      this.step = queryParams.get('step');
      this.odp = queryParams.get('odp');
   });

   this.storage.get("feed_vocal").then(res => {
    if (res) {
       this.feed_vocal=res;      }
    else{
      this.feed_vocal=false;
    }
    console.log("FEED VOCAL "+this.feed_vocal);
  });
   }
   ionViewWillEnter(){
    this.events.subscribe('data:scan', (scanData, time) => {
      //  Update the list of scanned barcodes
      let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
      let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
      //this.scans.unshift({ "data": scannedData, "type": scannedType, "timeAtDecode": time });
      console.log("ZEBRA RECIVED CODE CARICO PAGE HANDLER" + scannedData);
      this.codeRead(scannedData);
    });
     }
     ionViewWillLeave(){
       this.events.unsubscribe('data:scan');
     }
  ngOnInit() {
    if(this.feed_vocal){
    this.tts.speak({
      text: "Scansiona codice bottale",
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
}
  }

  public fabDown() {
    
    //this.logincode('ItalProgetti');
 this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    console.log("ZEBRA FABDOWN");

  this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

  codeRead(data){
    switch(this.stato){
      case 0:{
        console.log("CODICE LETTO STATO 0");
        this.findDrum(data);
        break;
      }
      case 1:{
        console.log("CODICE LETTO STATO 1");
        this.findProduct(data);
        break;
      }
    }
    console.log("CODE READ:"+data);
  }

  findDrum(data){
    console.log("FIND TANK "+data+ "ODP "+this.odp);
    console.log(this.productsdata);
    for (let t in this.productsdata){
      console.log("VERIFICO "+this.productsdata[t].NOME_BOTTALE+" - "+this.productsdata[t].ID_ODP);
      if (this.productsdata[t].NOME_BOTTALE==data && this.productsdata[t].ID_ODP== this.odp ){
     
        this.stato=1;
        this.drum=data;
        this.drumid = this.productsdata[t].ID_BOTTALE;
        this.displayDrum = "block";
        if(this.feed_vocal){
           this.speak("Bottale "+this.drum+" selezionato correttamente. Scansiona codice contenitore.");
        }
        this.message="SCANSIONA CODICE CONTENITORE";
      return;
      }
    }
    if(this.feed_vocal){
    this.speak("Codice bottale non corretto"); }
  }

    findProduct(data){
      this.displayProdotto = "block";
      if(this.feed_vocal){
      this.tts.speak({
        text: "Contenitore  selezionato.",
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => {
    this.message="VERIFICA CONTENITORE IN CORSO"
      this.verifyContanier()
    }
     )
    .catch((reason: any) => console.log(reason));  
  }
  else{
    this.message="VERIFICA CONTENITORE IN CORSO"
      this.verifyContanier()
  }
    }
    speak(text){
      if(this.feed_vocal){
      this.tts.speak({
        text: text,
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }
    }
    verifyContanier(){
      this.displaySpinner = "block";
      if (true){
        if(this.feed_vocal){
        this.tts.speak({
          text: "Inserimento completato.",
          locale: 'it-IT',
          rate: 1.25
      })
      .then(() => {
      this.message="VERIFICA OK";
      this.stato = 0;
       this.router.navigate(['/members/recipe'])
    })
      .catch((reason: any) => console.log(reason));  
    }
      }
    }
}
