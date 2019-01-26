// Reursos de angular
import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Páginas
import { ConfigPage } from './../config/config';
import { SearchPage } from './../search/search';
import { Form1Page } from './../form1/form1';


// Providers
import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';


// ---------------------------------------------------
//                                                  --
//          Página principal de la aplicación       --
//                                                  --
// ---------------------------------------------------


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  ServerConection;
  _id: string = '';
  RegisterFail: boolean = true;




  constructor(
    public navCtrl: NavController,
    public registro: RegistrosProvider,
    public archivo: ArchivosProvider,
    public alertCtrl: AlertController
  ) { }


  ionViewWillEnter() {
    this.TestConection();
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


  // Navega a las demas páginas

  VerConfigPage() {
    this.navCtrl.push(ConfigPage)
  }


  VerSearchPage() {

    if (this.ServerConection == false) {
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Por favor refresque la página o intente mas tarde',
        buttons: ['Aceptar']
      });
      alert.present();
    } else {
      this.navCtrl.push(SearchPage)
    }
  }


  VerForm1page() {

    if (this.ServerConection == false) {
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Por favor refresque la página o intente mas tarde',
        buttons: ['Aceptar']
      });
      alert.present();
    } else {
      this.navCtrl.push(Form1Page)
    }
  }
}
