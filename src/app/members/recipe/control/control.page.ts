import { Component, OnInit, ɵConsole } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
  providers: [Camera,
    File,
  
    FilePath,
    WebView,
    AndroidPermissions]
})
 
export class ControlPage implements OnInit {
  index = 1;
  idOdpFasi: any;
  idAzione: any;
  controlsdata: any;
  current_selected = -1;
  image = "";
  pictures = [];
  filepaths = [];
  public drum: any;
  public options =[];
  public values:any;
  public kind = "SELECT";
  public odp: any;
  public passo: any
  public showSelection:any;
  public host = "5dd8db89.ngrok.io";
  cameraOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.CAMERA,
    saveToPhotoAlbum: false,
    correctOrientation: false
    /*
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA */
  }
  constructor(private router: Router, private toastController: ToastController, private http: HttpClient, private loadingController: LoadingController, private storage: Storage, private file: File, private filePath: FilePath, private webview: WebView,
    private DomSanitizer: DomSanitizer, private androidPermissions: AndroidPermissions,
    private camera: Camera, private dataService: DataService,
    private alertController: AlertController, public route: ActivatedRoute) {


    
    this.route.paramMap
      .subscribe((queryParams: ParamMap) => {
        this.idOdpFasi = queryParams.get('idodpfasi');
        this.idAzione = queryParams.get('idazione');
        this.showSelection =(queryParams.get('numerico')=='1')?false:true;
console.log("SHOW: "+this.showSelection);
        this.controlsdata = dataService.controlsdata;
        this.http.get<Object[]>('http://'+this.host+'/getcontrolvalues/'+this.idAzione)
        .subscribe(data => {
        // this.displaySpinner = "none";
        for (let i=0;i< data.length; i++) {
       //   let stat = new object(data[i].valore, data[i].numero);
          this.options.push(data[i]['VALORE']);
          console.log(data[i]);
         console.log(data[i]['VALORE']);
      }


          
        
      
        })
        var idodp = this.idOdpFasi;
        this.controlsdata.forEach((control, index) => {
          console.log(control);
          console.log(this.idOdpFasi);
          if (control.id_odp_fasi == this.idOdpFasi) {
            this.odp = control.odp;
            this.drum = control.bottale;
            this.passo = control.passo;

          }
        });

        
      });


  }

  ngOnInit() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );


  }
  ionViewWillLeave() {

  }
  showPicture() {
    return this.image != "";
  }
  takePicture() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      this.filePath.resolveNativePath(imageData).then(filePath => {
        console.log(filePath)
        let photo = this.webview.convertFileSrc(filePath);
        console.log(photo);
        //this.image = this.webview.convertFileSrc(filePath);
        this.pictures.push(photo);
        this.filepaths.push(filePath);
        //this.startUpload(filePath);

      });

      let base64Image = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      console.log(err);
    });
  }
  save() {
    this.filepaths.forEach(filepath=>{
      this.startUpload(filepath);
    });
    this.router.navigate(['members/recipe']);
  }
  startUpload(filePath) {
    this.file.resolveLocalFilesystemUrl(filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        console.log('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      console.log(imgBlob);
      formData.append('file', imgBlob, this.drum + "_" + this.odp + "_" + this.passo + "_" + this.index);
      this.uploadImageData(formData);
      this.index += 1;
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
  //  const loading = await this.loadingController.create();
    //await loading.present();

    this.http.post("http://c7183545.ngrok.io/upload/", formData)
      .pipe(
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('File upload complete.')
         // loading.dismiss();
        } else {
          this.presentToast('File upload failed.')
          //loading.dismiss();
        }
      });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  highlight(i) {

    this.current_selected = i;
  }
  async deletePicture(i) {
    const alert = await this.alertController.create({
      header: 'Elimina',
      message: 'Confermi eliminazione?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('ANNULLATO');
          }
        }, {
          text: 'SI',
          handler: () => {
        
            this.pictures.splice(i,1);
            this.filepaths.splice(i,1);
            this.current_selected = -1;
            console.log('CANCELLATO');
          }
        }
      ]
    });

    await alert.present();
    
  }

 
}
