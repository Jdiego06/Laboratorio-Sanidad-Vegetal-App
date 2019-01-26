// Reursos de angular
import { Component } from '@angular/core';
import { IonicPage, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


// Providers
import { RegistrosProvider } from './../../providers/registros/registros';



// ------------------------------------------------------------
//                                                           --
//  Página de configuracion de la ip y puerto del servidor,  --
//  e informacion de la aplicación                           --
//                                                           --
// ------------------------------------------------------------



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


// Pruba la conexíon con el servidor

  TestConection() {

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });

    loading.present();

    this.GuardarConfig()
      .then(() => {

        this.registro.TestConexion()
          .then(() => {
            loading.dismiss();
            this.toast.create()
              .setMessage('Conexión Exitosa')
              .setPosition('bottom')
              .setDuration(3000)
              .present();
          })
          .catch(() => {
            loading.dismiss();
            this.toast.create()
              .setMessage('Error de Conexión')
              .setPosition('bottom')
              .setDuration(3000)
              .present();
          });
      })
      .catch(() => { });
  };


  // Lee la configuracion de ip y puerto del servidor, del almacenamiento nativo

  leerConfig() {

    this.storage.get('UrlServer').then((res) => {
      this.ip = res
    }).catch(() => { });

    this.storage.get('PortServer').then((res) => {
      this.port = res;
    }).catch(() => { });
  };


  // Guarda la configuracion de ip y puerto del servidor, en el almacenamiento nativo

  GuardarConfig() {

    return new Promise((resolve, reject) => {
      this.storage.set('UrlServer', this.ip)
        .then(() => {
          this.storage.set('PortServer', this.port)
            .then(() => {
              resolve()
            })
            .catch(() => {
              reject();
            });
        })
        .catch(() => {
          reject();
        });
    });
  };
};
