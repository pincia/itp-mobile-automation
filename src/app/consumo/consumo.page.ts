import { Component,ViewChild, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.page.html',
  styleUrls: ['./consumo.page.scss'],
})

export class ConsumoPage implements OnInit {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvas_') barCanvas_;
  @ViewChild('doughnutCanvas_') doughnutCanvas_;
  barChart: any;
  barChart_:any;
  doughnutChart_:any;
  host:any;
  id_odp:any
  labels_acqua:any;
  data_acqua:any;
  labels_chimici:any;
  data_chimici:any;
  labels_polveri:any;
  data_polveri:any;
  consumi:any;
  req_id:any;
odp:any;
totale_acqua:number;      
  constructor(public events:Events, public storage: Storage , public http: HttpClient, private route: ActivatedRoute) {
    this.events.subscribe('data:consumi', (data:ListResponse) => {
      console.log("EVENT  data:consumi ")
   
      if(""+data.id==this.req_id){
console.log("CONSUMO PAGE RECIVED DATA")
        console.log(data.eventData)
        this.consumi=data.eventData
        let labels_=[];
        let data_=[];
        let tot_acqua=0;
          data.eventData.acqua.forEach(element => {
            tot_acqua+=+element.QT_DOSED;
          labels_.push(element.PASSO_IGN)
            data_.push(+element.QT_DOSED)
          });
       this.labels_acqua=labels_
       this.data_acqua=data_
       this.totale_acqua=tot_acqua
       labels_=[];
       data_=[];
       data.eventData.chimici.forEach(element => {
      
      labels_.push(element.prodotto)
        data_.push(+element.QT_DOSED)
        this.labels_chimici=labels_
        this.data_chimici=data_
      });
      labels_=[];
       data_=[];
       data.eventData.polveri.forEach(element => {
      
      labels_.push(element.NOME_PRODOTTO)
        data_.push(+element.QT_PESATA)
        this.labels_polveri=labels_
        this.data_polveri=data_
      });
       this.drawGraph();


     }
    });

    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
    this.odp = queryParams.get('odp'); 
   
      this.req_id = Math.floor((Math.random() * 1000000) + 1);
      this.storage.get("plant_name").then(val=>{
        this.http.post('http://3.16.169.253:6001/apps/06be5ce7b43ad4f7/events?auth_key=a0764f6b0a5f586a0e7fcf72ffe3e01f', {
         "channel":"wollsdorf",
         "name": "actionrequest",
         "data":{"action":"getconsumi",
                 "param1":""+this.odp,
                 "id":this.req_id,
                 }  ,
      
       
     }).subscribe((res)=>{
       console.log(res)
     })
   
       })
          })
     

   
   }
   ngOnInit() {

   }
  drawGraph() {
    setTimeout(() => 
    {
      this.barChart = new Chart(this.barCanvas.nativeElement, {

        type: 'bar',
        data: {
            labels: this.labels_acqua,
            datasets: [{
                label: 'Acqua lt.',
                data: this.data_acqua,
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',            
                    'rgba(54, 162, 235, 0.2)'
              
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                  
                ],
                borderWidth: 1
            }]
        },
        
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
  
    });
  


    this.barChart_ = new Chart(this.barCanvas_.nativeElement, {

      type: 'horizontalBar',
        data: {
          labels:this.labels_chimici,
       
            datasets: [{
               label: 'Consumo',
               data: this.data_chimici,
               backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB"
            ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                  
                ],
                borderWidth: 1
            }]
        },
        
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
  
  });

  this.doughnutChart_ = new Chart(this.doughnutCanvas_.nativeElement, {

    type: 'horizontalBar',
   
    data: {
        labels: this.labels_polveri,
        datasets: [{
            label: 'Consumo',
            data: this.data_polveri,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
    }

});

  },
  10);
  
  }


}
interface ConsumoResponse{
  acqua:DosaggioAcqua[];
  chimici:DosaggioChimico[];
  polveri:DosaggioPolvere[];

}
interface ListResponse{
  eventData:ConsumoResponse,
  id:number;

}
interface DosaggioAcqua{
  DATAORA:string
  ID_ODP:string
  PASSO_IGN:string
PASSO_PLC:string    
   ID_PLC:string
NOME:string
TIPOITMX:string
  TEMP:string
  QT_SET:string
   QT_DOSED:string
   AUTOMATICO:string
STATO:string

}

interface DosaggioChimico{
  DATAORA:string
  prodotto:string
  id_prodotto:string
  ID_ODP:string
  PASSO_IGN:string
PASSO_PLC:string    
   ID_PLC:string
NOME:string
TIPOITMX:string
  TEMP:string
  QT_SET:string
   QT_DOSED:string
   AUTOMATICO:string
STATO:string

}

interface DosaggioPolvere{

  DATA:string
  NOME_PRODOTTO:string
  QT_PESATA:string
  PROGRESSIVO:string
  PASSO:string

}