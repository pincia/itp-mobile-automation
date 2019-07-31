import { Component,ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Storage } from '@ionic/storage';
const USER_KEY = 'userdata';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  profile = "overview";
  public loading;
  public url;
  public token;
  public resp;
  public profileData: any = {};
  public role: any;
  public roleId: any;
  public educationDetails: any;
  public exprienceInfo: any;
  public imagePath;
  public profileImage;
  noEducation = false;
  noExperience = false;
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
  user_id: any;
user_data:any;
  public colorCode: any;
  constructor(private storage: Storage,router: Router,public navCtrl: NavController, public dataService: DataService,private route: ActivatedRoute) {
    storage.get(USER_KEY).then((val) => {
      this.user_data=val;
      console.log("USER DATA ");
      console.log(val);
    });
    
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       var id = queryParams.get('id');
       console.log("TROVATO PARAMETRO ID:"+id);
       if (id) {
        this.user_id = id;
      }
      else {
        this.user_id = "";
      }
    });
    this.colorCode = {
      'background-color': localStorage.getItem('colorCode'),
    }
 

    
   }

   getstyle() {
    return {
      background:
        "linear-gradient(" + this.primaryColor + "," + this.secondryColor + ")"
    };
  }
  getProgresstyle() {
    return {
      background:
        "linear-gradient(to right," + this.secondryColor + "," + this.primaryColor + ")"
    };
  }
  getHeaderStyle() {
    return { background: this.primaryColor };
  }

  ionViewWillEnter(){
    
    this.profileData = {
      "fullname":"Federico Pinciaroli",
      "designation":"Programmatore Software",
      "avatar":"assets/imgs/user.jpg",
      "city":"San Miniato",
      "address":"Via LAndeschi, 7",
      "conuntry":"Italy",
      "phone":"339412486",
      "email":"f.pinciaroli@italprogetti.it"

    }
    console.log(this.profileData);
    if (this.profileData.address == '-') {
      this.profileData.address = '';
    }
    if (this.profileData.city == '-') {
      this.profileData.city = '';
    }
    if (this.profileData.country == '-') {
      this.profileData.country = '';
    }
    this.profileImage = this.profileData.avatar;
    this.educationDetails = JSON.parse(this.profileData.education_details);
    if (this.educationDetails.length == 0) {
      this.noEducation = true;
    }
    this.exprienceInfo = JSON.parse(this.profileData.experience_information);
    if (this.exprienceInfo.length == 0) {
      this.noExperience = true;
    }
  }
  editProfile() {
    //this.navCtrl.push(EditprofilePage);
  }

  

  setDefaultPic() {
    this.profileImage = "assets/imgs/user.jpg";
  }

}
