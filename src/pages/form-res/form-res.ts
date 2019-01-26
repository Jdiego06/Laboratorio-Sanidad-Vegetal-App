// Recursos de angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


// Páginas
import { HomePage } from './../home/home';


// -----------------------------------------------------------------------
//                                                                      --
//    Pagina de respuesta de registro guardado, o fallo al guardar      --
//                                                                      --
// -----------------------------------------------------------------------


@IonicPage()
@Component({
  selector: 'page-form-res',
  templateUrl: 'form-res.html',
})
export class FormResPage {

  Done: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  
  ionViewDidLoad() {
    this.Done = this.navParams.get('ok')
  };


  irHome() {
    this.navCtrl.popTo(HomePage)
  };

}
