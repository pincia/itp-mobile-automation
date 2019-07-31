import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform, Events } from '@ionic/angular';
@Component({
  selector: 'app-odplist',
  templateUrl: './odplist.page.html',
  styleUrls: ['./odplist.page.scss']
})
export class OdplistPage implements OnInit {
  public stato:any;
  public title:string;
  displaySpinner = "none";
  displayTable = "none";
  limit:string;
  host:any;
  public odplist:any;
 rows:any;
  temp = [];
  columns = [{ prop: 'ODP' },  { prop: 'BOTTALE' },{ prop: 'ESEGUITO' }];
  test_data:any;
  req_id:any;


 
    constructor(public events: Events, public storage:Storage, public router:Router, private http:HttpClient, public route:ActivatedRoute) {
      this.displaySpinner = "block";

      this.events.subscribe('data:odplist', (data:ListResponse) => {
   
        if(""+data.id==this.req_id){
        let dat = [];
        this.displayTable = "block";
        console.log(data)
        console.log(data.eventData['odplist'])
       // this.temp = [...this.test_data];
         this.rows =data.eventData['odplist']
       //this.rows=dat;
        this.temp = data.eventData['odplist']
        this.displaySpinner="none";
        this.displayTable="block";
       }
      });
   
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       this.stato = queryParams.get('stato');     
      if(this.stato==0) {
        this.title="ODP in coda"; 
        this.getODPList(this.stato);
      }
   
      if(this.stato==1) {
        this.title="ODP in esecuzione"; 
        this.getODPList(this.stato);
      } 
      if(this.stato==2)  {
        this.title="Archivio ODP";
        this.getODPList(this.stato);
      }
    });
  

    this.fetch(data => {
      // cache our list
      this.temp = [...data];
      
      // push our inital complete list
      this.rows = data;
    });
   }


   getODPList(stato){
     this.req_id = Math.floor((Math.random() * 1000000) + 1);
    this.storage.get("plant_name").then(val=>{
      this.http.post('http://3.16.169.253:6001/apps/06be5ce7b43ad4f7/events?auth_key=a0764f6b0a5f586a0e7fcf72ffe3e01f', {
       "channel":"wollsdorf",
       "name": "actionrequest",
       "data":{"action":"getodplist",
               "param1":""+stato,
               "id":this.req_id,
               }  ,
    
     
   }).subscribe((res)=>{
     console.log(res)
   })
 
     });
   }
   getRowClass(row) {
    return {
      'annullato': row.STATO==-1
    };
  }

ionViewWillEnter(){
}


goToODP(event) {

  if(event.type=="click") {
    
  let odp=event.row.ODP;
  console.log("GOTO ODP "+odp);
 this.router.navigate(['/odp', odp]);
 }
}
ngOnInit() {
  



}

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  clear(){
    const temp = this.temp.filter(function(d) {
      return (""+d.ODP).toLowerCase().indexOf("") !== -1 || !"";
    });

    // update the rows
    this.rows = temp;
  }
  updateFilter(event) {
    console.log(event)
    const val = event.target.value.toLowerCase();
 
    // filter our data
    const temp = this.temp.filter(function(d) {
      return (""+d.ODP).toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}

 interface ListResponse{
   eventData:object,
   id:number;

}