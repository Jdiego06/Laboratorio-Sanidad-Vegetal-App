// Recursos de angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

// Recursos nativos
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

// Páginas
import { FormResPage } from './../form-res/form-res';

// Providers
import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';


// -------------------------------------------------------------
//                                                            --
//     Página para grabar audio, y subirlo al servidor        --
//                                                            --
// -------------------------------------------------------------



@IonicPage()
@Component({
  selector: 'page-form3',
  templateUrl: 'form3.html',
})
export class Form3Page {

  _id: string = '';
  recording: boolean = false;
  pause: boolean = false;

  filePath: string;
  fileName: string = 'audio0.mp3';
  audio: MediaObject;
  AudioReady: boolean = false;
  playing: boolean = false;
  RegisterFail: boolean = true;
  ServerConection: boolean = true;
  Saved: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
    public file: File,
    public viewCtrl: ViewController,
    public archivo: ArchivosProvider,
    public registro: RegistrosProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,

  ) { }

  // Obtiene el id, al cual se asociara el audio subido al servidor

  ionViewDidLoad() {
    this._id = this.navParams.get('_id')
  };

  ionViewWillEnter() {
    this.TestConection();
  };


  // Pregunta al usuarío si desea abandonar la página sin haber guardado el registro

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


  // Borra el registro del servidor, si el usuario abandona la página sin haber guardado
  // el registro

  ionViewWillLeave() {
    if (this.RegisterFail == true) {
      this.registro.BorrarRegistro(this._id).catch(() => { });
    };
  };



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


  // Crea el objeto de audio, y empieza la grabación

  startRecord() {
    this.AudioReady = false;
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.recording = true;
  }


  // Pausa la grabación

  pauseRecord() {
    setTimeout(() => {
      this.audio.pauseRecord();
    }, 500);
    this.recording = false;
    this.pause = true;
  }


  // Continua la grabación

  resumeRecord() {
    this.pause = false;
    this.recording = true;
    this.audio.resumeRecord();
  }


  // Detiene la grabación

  stopRecord() {
    setTimeout(() => {
      this.audio.stopRecord();
      this.PlayAudio();
      this.PlayAudio();
    }, 500);

    this.recording = false;
    this.AudioReady = true;
    this.pause = false;
  }


  // Reproduce el audio grabado

  PlayAudio() {
    this.playing = true;
    this.audio.setVolume(1);
    setTimeout(() => {
      this.StopAudio();
    }, this.audio.getDuration() * 1000);
    this.audio.play();
  }


  // Detiene la reproducción de audio

  StopAudio() {
    this.audio.stop();
    this.playing = false;
  }



  // Borra el objeto de audio

  BorrarAudio() {
    this.audio = undefined;
    this.AudioReady = false;
  }


  // Guarda el audio en el servidor 

  GuardarReg() {

    this.Saved = true;

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });
    loading.present();

    if (!this.audio) {
      this.RegisterFail = false;
      this.VerFormResPage(true)
      loading.dismiss();
    } else {
      this.archivo.SubirAudio(this.filePath, this._id)
        .then(() => {
          this.RegisterFail = false;
          loading.dismiss();
          this.VerFormResPage(true);
        })
        .catch(() => {
          loading.dismiss();
          this.VerFormResPage(false);
        });
    };
  };


  // Navega a la página de respuesta, una vez es servidor responde, ya sea que el registro 
  // se guarde correctamente, o que falle al guardar.


  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };

}
