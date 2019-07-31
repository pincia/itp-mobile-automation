/*
 * Developed by Mannini Andrea (https://github.com/manniniandrea). :bowtie:
 * Last modified 5/2/19 4:09 PM.
 * Copyright 2019-2019 Mannini Andrea (https://github.com/manniniandrea)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import { Injectable } from '@angular/core';
import { EchoService, AngularLaravelEchoModule } from 'angular-laravel-echo';
import { ChannelType } from 'angular-laravel-echo/src/services/lib.service';
import { Observable, Subscription } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { listenToElementOutputs } from '@angular/core/src/view/element';
import { Platform, Events } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})


export class PushService {
    
    private _notifications: Subscription = null;
    private _privateChannels: string[] = [];
    public host: string;
    public tanksdata: any;
    public alarms: any;
    public alarm: any;
    public _drumsdata: any;
    public drumsdata: any;
    public productsdata: any;
    public productscodesdata: any;
    public controlsdata: any;
    public controlslist: any;
    public lastRND:number;
    public lastRNDTime: number;
    public actualRND:number;
    public interval:any;
    public vibration: boolean;
    public actualRNDTime:number;
    public endpoint:any;
    public token:any;
    public vpn_on:boolean;
    public websocket_on:boolean;
    public plant_name:string;
    
    constructor(public _echo: EchoService,
        private alertCtrl: AlertController,
        private oneSignal: OneSignal,
        private http:HttpClient,
        private storage: Storage,
        public events: Events, 
        private platform: Platform
    
    ) {
      

        console.log("PUSH SERVICE STARTED");
       
          this.storage.get('plant_name').then(res => {
            if (res) {
               console.log("PLANT NAME SETTED TO "+res)
            this.plant_name=res;
            this.join_channel();
            }
            else {
                this.join_channel();
            }
          })
          this.storage.get('authtoken').then(res => {
            if (res) {
            this.token=res;
            }
          })
    }


      public join_channel(){
        console.log("PUSHSERVICE-> LISTEN TO CHANNEL "+this.plant_name);
      
        this._echo.echo.channel(this.plant_name).listen('.actionresponse', (e) => {
            console.log("ACTION "+e['action'])
            if(e['action']=="getodplist"){
                console.log("EVENT SEND RESPONSE data:odplist")
            this.events.publish('data:odplist', {"eventData": JSON.parse(e['eventData']),"id":JSON.parse(e['id'])}, new Date().toLocaleTimeString());
            }
            if(e['action']=="getodp"){
                console.log("EVENT DATA RECIVED "+e['eventData'])
                console.log("EVENT SEND RESPONSE data:odp'")
                this.events.publish('data:odp', {"eventData": JSON.parse(e['eventData']),"id":JSON.parse(e['id'])}, new Date().toLocaleTimeString());
            }
            if(e['action']=="getconsumi"){
                console.log("EVENT DATA RECIVED "+e['eventData'])
                console.log("EVENT SEND RESPONSE data:getconsumi'")
                this.events.publish('data:consumi', {"eventData": JSON.parse(e['eventData']),"id":JSON.parse(e['id'])}, new Date().toLocaleTimeString());
            }

        })

        this._echo.echo.channel(this.plant_name).listen('.drumdata', (e) => {
    
            e['eventData']=JSON.parse(e['eventData']);
           // console.log(e['eventData'])
            this._drumsdata = e['eventData']['drums'];
            this.tanksdata = e['eventData']['tanks'];
            this.alarms = e['eventData']['alarms'];
            this.productsdata = e['eventData']['products'];
            this.controlsdata = e['eventData']['controls'];
            this.productscodesdata = e['eventData']['productscodes'];
            this.alarm = e['eventData']['alarm'];
            this.controlslist = e['eventData']['controlslist'];
            this.actualRND = e['eventData']['rnd'];
            let newdrumsdata=[];
            if (this._drumsdata){
            this._drumsdata.forEach(function(_drum){
                let stato = _drum['INFOSTATO1'];
                let output = _drum['OUTPUT1'];
                let allarme_27 = +_drum['ALLARME_27']; 
                let allarme_28 = +_drum['ALLARME_28'];
                let allarme_29 = +_drum['ALLARME_29'];
                let allarme_30 = +_drum['ALLARME_30'];

                _drum['AUTOMATICO']=stato.charAt(1);
                _drum['RUNNING']=stato.charAt(2);
                _drum['DIREZIONE']=stato.charAt(3);
                _drum['FILTRO']=stato.charAt(4);
                _drum['INVERSIONE']=stato.charAt(5);
                _drum['RISCALDAMENTO']=stato.charAt(6);
                _drum['RICETTAON_OFF']=stato.charAt(7);
                _drum['LUCE_VERDE']=stato.charAt(11);
                _drum['LUCE_GIALLA']=stato.charAt(12);
                _drum['LUCE_ROSSA']=stato.charAt(13);
                if((allarme_27+allarme_28+allarme_29+allarme_30)>0) _drum['ALARM']=1;
                else _drum['ALARM']=0;
                newdrumsdata.push(_drum);
          
            })
            this.drumsdata=newdrumsdata;
            //console.log(this.drumsdata)
        }
    });}

      

    public listen(type: ChannelType, name: string, eventName: string): Observable<any> {

        this._echo.join(name, type);
        if (type === 'public') {
            this._privateChannels.push(name);
        }
        return this._echo.listen(name, eventName);
        // .pipe(share());
    }

    public leave(name: string) {
        this._echo.leave(name);
        let index;
        if ((index = this._privateChannels.indexOf(name)) >= 0) {
            this._privateChannels.splice(index, 1);
        }
    }

    private _leaveAll() {
        let channel;
        while ((channel = this._privateChannels.pop()) != null) {
            this.leave(channel);
        }
    }

    private checkCOM(){
        //console.log("CHECK COM");
      //  console.log("ACTUAL    "+this.actualRND);
       // console.log("LAST    "+this.lastRND);
            if (this.lastRND!=this.actualRND){
                this.lastRNDTime= Date.now();
              
                this.lastRND=this.actualRND;
            }
            else{
                let diff = Date.now()-this.lastRNDTime;
                if (diff>1000*100000) {
                    clearInterval(this.interval);
                    this.presentAlert("NO DATA","WEBSOCKET DATA NO COMMUNICATION");
                }
            }
    }

    async presentAlert(header,message){ 
        const  alert = await this.alertCtrl.create({
         header: header,
         message: message,
         buttons: [ {
          text: 'Ok',
          handler: () => {
            console.log("HANDLED");
            this.lastRNDTime=Date.now();
          }
        }],
         cssClass: 'alarm',  
        
       });
       alert.onDidDismiss().then(
        (data)=>{
    console.log("DISMISSED");
    
    this.interval = setInterval(()=>{ 
        this.checkCOM();
       
       }, 1500);
       
       // clearInterval(this.interval);
        }
    
       );
      await alert.present();     
      }

  
     
}
