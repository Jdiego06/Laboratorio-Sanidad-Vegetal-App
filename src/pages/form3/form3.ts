import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';
import { FormResPage } from './../form-res/form-res';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';



@IonicPage()
@Component({
  selector: 'page-form3',
  templateUrl: 'form3.html',
})
export class Form3Page {

  _id: string = '';
  recording: boolean = false;
  filePath: string;
  fileName: string = 'audio0.mp3';
  audio: MediaObject;
  AudioReady: boolean = false;
  playing: boolean = false;
  RegisterFail: boolean = true;
  ServerConection:boolean=true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
    public file: File,
    public viewCtrl: ViewController,
    public archivo: ArchivosProvider,
    public registro: RegistrosProvider

  ) { }

  ionViewDidLoad() {
    this._id = this.navParams.get('_id')
  };

  ionViewWillEnter() {
    console.log('Pagina principal');
    this.TestConection();
  };

  ionViewWillLeave() {
    if (this.RegisterFail == true) {
      console.log('Se borrará el registro con id: ' + this._id);
      this.registro.BorrarRegistro(this._id)
    };
  };

  // Pruba la conexion con el rest server

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




  startRecord() {
    this.AudioReady = false;
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.recording = true;
  }


  stopRecord() {
    setTimeout(() => {
      this.audio.stopRecord();
      this.PlayAudio();
      this.PlayAudio();
    }, 500);

    this.recording = false;
    this.AudioReady = true;
  }

  PlayAudio() {
    this.playing = true;
    this.audio.setVolume(1);
    setTimeout(() => {
      this.StopAudio();
    }, this.audio.getDuration() * 1000);
    this.audio.play();
  }


  StopAudio() {
    this.audio.stop();
    this.playing = false;
  }



  GuardarReg() {


    if (!this.audio) {
      this.RegisterFail = false;
      this.VerFormResPage(true)
    } else {
      this.archivo.SubirAudio(this.filePath, this._id).then(() => {
        console.log('Se subio El archivo');
        this.RegisterFail = false;
        this.VerFormResPage(true);
      }).catch((err) => {
        console.log(err);
        this.VerFormResPage(false);
      });
    };
  };


  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };

}
