import { RegistrosProvider } from './../../providers/registros/registros';
import { Component } from '@angular/core';
import { IonicPage, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  ip: string = '';
  port: string = '';


  constructor(
    public storage: Storage,
    public registro: RegistrosProvider,
    public toast: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.leerConfig();
  }



  TestConection() {

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });

    loading.present();

    this.GuardarConfig().then(() => {

      this.registro.TestConexion().then(() => {
        loading.dismiss();
        this.toast.create()
          .setMessage('Conexión Exitosa')
          .setPosition('bottom')
          .setDuration(3000)
          .present();
      }).catch(() => {
        loading.dismiss();
        this.toast.create()
          .setMessage('Error de Conexión')
          .setPosition('bottom')
          .setDuration(3000)
          .present();
      });
    }).catch(err => {
      console.log(err);
    });
  };

  Save() {

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });

    loading.present();

    this.GuardarConfig().then(() => {
      loading.dismiss();
      this.toast.create()
        .setMessage('Configuraciones Guardadas')
        .setPosition('bottom')
        .setDuration(3000)
        .present();
    }).catch(() => {
      loading.dismiss();
      this.toast.create()
        .setMessage('Error al guardar')
        .setPosition('bottom')
        .setDuration(3000)
        .present();
    });
  };

  leerConfig() {
    this.storage.get('UrlServer').then((res) => {
      this.ip = res
    }).catch((err) => {
      console.log(err);
    });

    this.storage.get('PortServer').then((res) => {
      this.port = res
    }).catch((err) => {
      console.log(err);
    });
  }


  GuardarConfig() {
    return new Promise((resolve, reject) => {
      this.storage.set('UrlServer', this.ip).then(() => {
        this.storage.set('PortServer', this.port).then(() => {
          resolve()
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });

    });
  };

}
