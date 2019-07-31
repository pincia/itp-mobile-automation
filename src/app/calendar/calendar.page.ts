import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  event = {
    title: '',
    drum:'',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  num:number;
  host:any;
  minDate = new Date().toISOString();
  displaySpinner:string;
  displayTable:string;
  eventSource = [];
  viewTitle;
 req_id:string;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 
  constructor(public events:Events ,public router:Router, public storage:Storage,public http:HttpClient ,   private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) {
    this.num=0;
    this.displaySpinner = "block" 
    this.events.subscribe('data:odplist', (data:ListResponse) => {
 
      if(""+data.id==this.req_id){
        let list:ODP[]=data.eventData.odplist 
       
       this.displayTable = "block";
       list.forEach((odp)=>{
         this.addEvent({
          title: odp.ODP+" - "+odp.BOTTALE,
          drum: odp.BOTTALE,
          desc: odp.TIPOLOGIA,
          startTime: odp.ESEGUITO,
          endTime: odp.ESEGUITO,
          duration: odp.DURATA,
          allDay: false
         })
       })
       this.displaySpinner="none"
     }
    });

   }

   
ionViewWillEnter(){
  this.req_id = ""+Math.floor((Math.random() * 1000000) + 1);
  this.storage.get("plant_name").then(val=>{
    this.http.post('http://3.16.169.253:6001/apps/06be5ce7b43ad4f7/events?auth_key=a0764f6b0a5f586a0e7fcf72ffe3e01f', {
     "channel":"wollsdorf",
     "name": "actionrequest",
     "data":{"action":"getodplist",
             "param1":"4",
             "id":this.req_id,
             }  ,
  
   
 }).subscribe((res)=>{


 })

   });
 
}


goToODP(idodp) {
  console.log("GOTO ODP "+idodp);
 this.router.navigate(['/odp', idodp]);
}
 
  ngOnInit() {
    this.resetEvent();
  }
 
  resetEvent() {
    this.event = {
      title: '',
      drum:'',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }
 
  // Create the right event format and reload source
  addEvent(ev) {
    console.log(ev)
    let olddate = new Date(ev.endTime)
    let date = new Date(olddate.getTime() + ev.duration*60000)

    
    
    let eventCopy = {
      title: ev.title,
      startTime:  new Date(ev.startTime),
      endTime: date,
      allDay: ev.allDay,
      desc: ev.desc
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 console.log(eventCopy)
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

  // Change current month/week/day
 next() {
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slideNext();
}
 
back() {
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slidePrev();
}
 
// Change between month/week/day
changeMode(mode) {
  this.calendar.mode = mode;
}
 
// Focus today
today() {
  this.calendar.currentDate = new Date();
}
 
// Selected date reange and hence title changed
onViewTitleChanged(title) {
  this.viewTitle = title;
}
 
// Calendar event was clicked
async onEventSelected(event) {
  // Use Angular date pipe for conversion
  let start = formatDate(event.startTime, 'medium', this.locale);
  let end = formatDate(event.endTime, 'medium', this.locale);
 
  const alert = await this.alertCtrl.create({
    header: event.title,
    subHeader: event.desc,
    message: '<b>INZIO:</b> ' + start + '<br><br><b>FINE:</b> ' + end,
    buttons: [{
      text:"CHIUDI"
    },
    {
      text:"APRI ODP",
      handler: () => {
        let str = ""+event.title
       this.goToODP(+str.split("-")[0])
        }
    }],
    cssClass: "calendar-alert",
  });
  alert.present();
}
 
// Time slot was clicked
onTimeSelected(ev) {
  console.log("on time selected "+ev['drum'])
  console.log("on time selected "+ev['title'])
  let selected = new Date(ev.selectedTime);
  this.event.startTime = selected.toISOString();
  selected.setHours(selected.getHours() + 1);
  this.event.endTime = (selected.toISOString());
}
}

interface ODPResponse{
  odplist:ODP[]
}
interface ListResponse{
  eventData:ODPResponse,
  id:number;

}
interface ODP{
  ODP:string,
  BOTTALE:string,
  PELLI:string,
  KG:string,
  ESEGUITO:string,
  STATO:number,
  TIPOLOGIA:string,
  ID_TIPOLOGIA:number
  DURATA:number
}