import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';
import { FormResPage } from './../form-res/form-res';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
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
  pause: boolean = false;

  filePath: string;
  fileName: string = 'audio0.mp3';
  audio: MediaObject;
  AudioReady: boolean = false;
  playing: boolean = false;
  RegisterFail: boolean = true;
  ServerConection: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
    public file: File,
    public viewCtrl: ViewController,
    public archivo: ArchivosProvider,
    public registro: RegistrosProvider,
    public loadingCtrl: LoadingController

  ) { }

  ionViewDidLoad() {
    this._id = this.navParams.get('_id')
  };

  ionViewWillEnter() {
    this.TestConection();
  };

  ionViewWillLeave() {
    if (this.RegisterFail == true) {
      this.registro.BorrarRegistro(this._id).catch(() => { });
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

  pauseRecord() {
    setTimeout(() => {
      this.audio.pauseRecord();
    }, 500);
    this.recording = false;
    this.pause = true;
  }

  resumeRecord() {
    this.pause = false;
    this.recording = true;
    this.audio.resumeRecord();
  }

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

  BorrarAudio() {
    this.audio = undefined;
    this.AudioReady = false;
  }

  GuardarReg() {

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

  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };

}
