import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Páginas
import { ConfigPage } from './../config/config';
import { SearchPage } from './../search/search';
import { Form1Page } from './../form1/form1';


// Providers
import { RegistrosProvider } from './../../providers/registros/registros';
import { ArchivosProvider } from './../../providers/archivos/archivos';




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
    public archivo: ArchivosProvider
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




  VerConfigPage() {
    this.navCtrl.push(ConfigPage)
  }


  VerSearchPage() {
    this.navCtrl.push(SearchPage)
  }


  VerForm1page() {
    this.navCtrl.push(Form1Page)
  }

}
