// Recursos de angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

// Recursos Nativos
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

// Páginas
import { Form3Page } from './../../pages/form3/form3';
import { FormResPage } from './../../pages/form-res/form-res';

// Providers
import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';


// ---------------------------------------------------
//                                                  --
//     Página para subir imágenes al servidor       --
//                                                  --
// ---------------------------------------------------



@IonicPage()

@Component({
  selector: 'page-form2',
  templateUrl: 'form2.html',
})

export class Form2Page {

  _id: string = '';
  fotosPath: any[] = [];
  fotosData: any[] = [];
  ButtonDisabled: boolean = true;
  RegisterFail: boolean = true;
  ServerConection: boolean = false;
  foto: any;
  Saved:boolean=false;

  Cameraoptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public file: File,
    public archivos: ArchivosProvider,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public registro: RegistrosProvider,
    public alertCtrl: AlertController,
  ) { }


  ionViewWillEnter() {
    this.TestConection();
  };

// Obtiene el id del registro, al cual se asociarán las imágenes

  ionViewDidLoad() {
    this._id = this.navParams.get('_id')
  }

  // Borra el registro del servidor, si el usuario sale de la página, sin haber guardado

  ionViewWillLeave() {
    if (this.RegisterFail == true) {
      console.log('Se borrará el registro con id: ' + this._id);
      this.registro.BorrarRegistro(this._id).catch(() => { });
    };
  };


  // Pregunta al usuario se desea abandonar la página

  async  ionViewCanLeave() {

    let res = false;
    let prom1 = new Promise((resolve, reject) => {

      if (this.Saved == false) {

        const confirm = this.alertCtrl.create({
          title: 'Abandonar Página',
          message: 'Si abandona la página en este momento, el registro no se guardará.',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => {
                res = false;
                resolve();
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                res = true;
                resolve();
              }
            }
          ]
        });
        confirm.present();
      } else {
        resolve();
        res = true;
      }
    });

    await prom1;
    return (res)
  }


  // Pruba la conexion con el servidor

  TestConection() {
    this.registro.TestConexion().then(() => {
      this.ServerConection = true;
    }).catch(() => {
      this.ServerConection = false;
    });
  };


  doRefresh(refresher) {

    setTimeout(() => {
      refresher.complete();
    }, 4000);

    this.registro.TestConexion().then(() => {
      this.ServerConection = true;
      refresher.complete();
    }).catch(() => {

      this.ServerConection = false;
      refresher.complete();
    });
  };


// Toma una foto con la cámara del dispositivo, o selecciona una de la galeria

  TakePicture(from) {

    this.ButtonDisabled = false;


    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });

    this.Cameraoptions.sourceType = from;

    this.camera.getPicture(this.Cameraoptions).then((imageData) => {
      this.fotosPath.push(imageData);
      this.MostarImagen(imageData, from);
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      },
        1500
      )

    }, (err) => {
      console.log(err);
      if (this.fotosPath.length == 0) {
        this.ButtonDisabled = true;
      };
    });
  };


  // Carga fotografia en base64 al vector imageData para que pueda ser mostrada por la visa
  // (Esta operacion es ineficiente, debe reemplazarse; La vista debe cargar la fotografia, 
  // haciendo uso del path de la misma)

  MostarImagen(imageData, from) {

    if (from == 0) {
      let filename = imageData.substring((imageData.lastIndexOf('/') + 1), imageData.lastIndexOf('?'));
      let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);

      this.file.readAsDataURL(path, filename).then((res: any) => {
        this.fotosData.unshift(res)
      }, (err) => {
        console.log(err);
      });
    } else {

      let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);

      this.file.readAsDataURL(path, filename).then((res: any) => {
        this.fotosData.unshift(res)
      }, (err) => {
        console.log(err);
      });
    };
  };


  // Guarda las imágenes en el servidor

  SaveImages() {

    this.Saved = true;

    if (this.ButtonDisabled) {
      const alert = this.alertCtrl.create({
        title: 'Debe seleccionar al menos una fotografía',
        subTitle: 'Para continuar agregue fotografías al registro',
        buttons: ['Aceptar']
      });
      alert.present();
    } else {

      let loading = this.loadingCtrl.create({
        content: 'Por Favor Espere...'
      });
      loading.present();

      this.archivos.SubirImagen(this.fotosPath, this._id)
        .then(() => {
          loading.dismiss();
          this.RegisterFail = false;
          this.VerForm3Page(this._id);
        }).catch(() => {
          loading.dismiss();
          this.VerFormResPage(false);
        });
    }
  };


// Navega a la página de respuesta, si la operacion de cargar fotografías falla,
// o a la pagina de grabar audio, si estas se cargaron correctamente

  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };


  VerForm3Page(_id) {
    this.navCtrl.push(Form3Page, { _id: _id })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };

}
