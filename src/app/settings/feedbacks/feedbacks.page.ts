import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.page.html',
  styleUrls: ['./feedbacks.page.scss'],
})
export class FeedbacksPage implements OnInit {
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
feed_vocal:boolean;
feed_hapt:boolean;
feed_vibe:boolean;
feed_sound:boolean;
  constructor(private storage:Storage) {
    this.storage.get("feed_vocal").then(res => {
      if (res) {
         this.feed_vocal=res;      }
      else{
        this.feed_vocal=false;
      }
    });
    this.storage.get("feed_sound").then(res => {
      if (res) {
         this.feed_sound=res;      }
      else{
        this.feed_sound=false;
      }
    });
    this.storage.get("feed_vibe").then(res => {
      if (res) {
         this.feed_vibe=res;      }
      else{
        this.feed_vibe=false;
      }
    });
    this.storage.get("feed_hapt").then(res => {
      if (res) {
         this.feed_hapt=res;      }
      else{
        this.feed_hapt=false;
      }
    });



   }

  ngOnInit() {
  }
  getHeaderStyle() {
    return { background: this.primaryColor };
  }
  setPropriety(propriety){
    this.storage.get(propriety).then(res => {


    this.storage.set(propriety, !res).then(res2 => {
    })

  });

  }
}
interface Propriety {
  name: string;
  value: boolean;
}