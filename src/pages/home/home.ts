import { Form2Page } from './../form2/form2';
import { FormResPage } from './../form-res/form-res';
import { Form3Page } from './../form3/form3';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Páginas
import { ConfigPage } from './../config/config';
import { SearchPage } from './../search/search';
import { Form1Page } from './../form1/form1';


// Providers

import { RegistrosProvider } from './../../providers/registros/registros';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  ServerConection = false;
  _id: string = '';
  RegisterFail: boolean = true;




  constructor(
    public navCtrl: NavController,
    public registro: RegistrosProvider,
    public navParams:NavParams
  ) { }


  ionViewWillEnter() {
    console.log('Pagina principal');
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
    console.log('Ver ConfigPage');
    this.navCtrl.push(ConfigPage)
  }


  VerSearchPage() {
    console.log('Ver SearchPage');
    this.navCtrl.push(SearchPage)
  }


  VerForm1page() {
    console.log('Ver formulario 1');
    this.navCtrl.push(Form1Page)
    

  }

  VerForm3page() {
    console.log('Ver form3Page');
    this.navCtrl.push(Form3Page)
  }

  VerRespage(ok) {
    console.log('Ver ResPage');
    this.navCtrl.push(FormResPage,{ok:ok});
  }

  VerForm2page(_id) {
    console.log('Ver ResPage');
    this.navCtrl.push(Form2Page,{_id:_id});
  }

}
