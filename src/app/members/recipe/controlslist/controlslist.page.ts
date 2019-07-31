import { Component, OnInit } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-controlslist',
  templateUrl: './controlslist.page.html',
  styleUrls: ['./controlslist.page.scss'],
})
export class ControlslistPage implements OnInit {
  idOdpFasi:any;
  idAzioneGroup:any;
  public controlslist:any;
  displaySpinner:any;

  host =  "5dd8db89.ngrok.io";
  constructor(public router:Router, private http:HttpClient, public route:ActivatedRoute) {
    this.displaySpinner = "block";
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       this.idOdpFasi = queryParams.get('idodpfasi');
       this.idAzioneGroup = queryParams.get('idazionegroup');
       
       var re = /,/gi; 
       var azioni = this.idAzioneGroup.replace(re, "X");
       this.http.get('http://'+this.host+'/getcontrolslist/'+azioni)
       .subscribe(data => {
         console.log("CONTROLLI ARRIVATI");
        this.displaySpinner = "none";
        this.controlslist = data;
        
       })

    });

   
  }
  ngOnInit() {
  }
  goToControl(event, control) {
    console.log(control);
  
   this.router.navigate(['/members/control',this.idOdpFasi, control['IDAZIONE'],control['numerico']]);
   }

}
