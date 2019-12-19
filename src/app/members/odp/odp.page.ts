import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PushService } from 'src/app/services/push.service';
import { DataService } from 'src/app/services/data.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform, Events } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-odp',
  templateUrl: './odp.page.html',
  styleUrls: ['./odp.page.scss'],
})


export class OdpPage implements OnInit {
  private id_odp:any;
  private odp:any;
  private isLoaded:any;
  pdfObj = null;
  logo_path:any;
  public data_:any;
  private image:any;
  host:any;
  drum:Drum;
  base64Img:any;
  displaySpinner:any;
  req_id:string;
  constructor(public events: Events, public router:Router, public storage:Storage, private filePath: FilePath, private platform: Platform, private file: File, private fileOpener: FileOpener,private dataService: DataService, private pushservice: PushService,private route: ActivatedRoute,private http:HttpClient) {
    this.displaySpinner = "block";
    this.isLoaded=false;
    this.events.subscribe('data:odp', (data:ListResponse) => {
   
      if(""+data.id==this.req_id){
        this.displaySpinner = "none";
        this.drum = data.eventData.drum;
        this.isLoaded=true
        this.odp = data.eventData.odp;

     }
    });

    this.convertImgToBase64URL("https://i.ibb.co/F3NSB0F/logo.png", (base64Img)=>{
      this.base64Img=base64Img;
      
  },"image/png");
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       this.id_odp = queryParams.get('idodp');
       this.req_id = ""+Math.floor((Math.random() * 1000000) + 1);
       let host = environment.socketEndpoint;
       
       this.storage.get("plant_name").then(val=>{
         this.http.post('http://3.16.169.253:6001/apps/06be5ce7b43ad4f7/events?auth_key=a0764f6b0a5f586a0e7fcf72ffe3e01f', {
          "channel":"wollsdorf",
          "name": "actionrequest",
          "data":{"action":"getodp",
                  "param1":""+this.id_odp,
                  "id":this.req_id,
                  }  ,
      }).subscribe((res)=>{
  
      })
      });
      
    });
    
  }

  ngOnInit() {
   
  }
  renderClass(line,drum){
    let classes=""
    if (line['PASSO']<drum['PASSO']) classes="done"
    if (line['PASSO']==drum['PASSO']) classes="highlighted"
  return classes;
  }
  getPercentage(line,drum){
    let durata_stimata = +line['DURATA']
    let durata_corrente = +drum['DURATA_CICLO']
    if(!durata_stimata || !durata_corrente) return 1
    durata_stimata = durata_stimata*60
    return (durata_corrente/durata_stimata).toFixed(3)
  }
  isCurrentPass(line,drum){
   
    if (line['PASSO']==drum['PASSO']) return true
    else return false
  }
  goToConsumo(){

 this.router.navigate(['/consumo',this.id_odp]);
 
  }

  createPdf(base64Img) {

   var body = [];
    var j=1;
    //body[0]=["PASSO","DESCRIZIONE","RPM","Tc","Tw","Tp","C°"]
    body[0]=[{text: 'PASSO', style: 'tableHeader'}, {text: 'DESCRIZIONE', style: 'tableHeader'}, {text: 'RPM', style: 'tableHeader'}, {text: 'Tc', style: 'tableHeader'}, {text: 'Tw', style: 'tableHeader'}, {text: 'Tp', style: 'tableHeader'}, {text: 'C°', style: 'tableHeader'}];
				
    for (let step of this.odp) {
     
      body[j]=[""+step.PASSO,step.DESCRIZIONE,step.RUOTA_RPM,step.DURATA,step.RUOTA_GIRA,step.RUOTA_FERMO,step.RUOTA_TEMP];
      j++;
  }
 
    console.log(body);

    var docDefinition = {
      content: [
        {image:base64Img, alignment:'right', margin: [ 0, 0, 0, 20 ]},
        { text: 'ODP '+this.id_odp, style: 'header' },
       // { text: new Date().toTimeString(), alignment: 'center' },
        { text: 'DRUM '+this.drum['NOME'], style: 'subheader',alignment: 'center' },
       
      
        {
          style: 'tableExample',
          table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ 50,120,40,40,40,40,40 ],
  
          body: body,
        
        },
        layout: 'headerLineOnly'
      }
      ],
      styles: {
        header: {
          fontSize: 24,
          alignment: 'center',
          bold: true,
        },
        tableHeader:{
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },

        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPDF() {
    console.log("CREATE PDF");
    this.createPdf(this.base64Img);
    console.log("DOWNLOAD PDF");
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'ODP'+this.id_odp+'.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'ODP'+this.id_odp+'.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

    convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas =<HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}



}

interface OdpResponse{
  odp:object;
  drum:Drum;
}
interface Drum {
ABILITATO: number;
ALARM: string;
AUTOMATICO: string;
DIREZIONE: string;
DT500: null
DURATA_CICLO:  number;
FASE:  number;
FILTRO: string;
FTP_ADDRESS: string;
FTP_DESTINATION_PATH: string;
FTP_PASSWORD: string;
FTP_USER: string;
ID:  number;
ID_BOTTALE:  number;
ID_MACCHINA_TIPO:  number;
ID_ODP:  number;
ID_OPERATORE:  number;
ID_TIPOLOGIA: number;
INFOSTATO1: string;
INVERSIONE:string;
LUCE_GIALLA:string;
LUCE_ROSSA:string;
LUCE_VERDE: string;
MAX_LITRI:  number;
MAX_RPM:  number;
MAX_TEMP: number;
NOME: string;
ORDINE:  number;
OUTPUT1:string;
PASSO: number;
PAUSA_CICLO:  number;
PESO: null
PLC_IPADDR:string;
PLC_PORT:  number;g;
RISCALDAMENTO:string;
RPM: string;
RUNNING:string;
SCHEDA :string;
SIGLA:string;
TEMPERATURA:string;
TEMPERATURA_SET: string;
WORK_CICLO: number;
}

interface ListResponse{
  eventData:OdpResponse,
  id:number;

}