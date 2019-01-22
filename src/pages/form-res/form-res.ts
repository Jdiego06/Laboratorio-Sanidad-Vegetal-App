import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-form-res',
  templateUrl: 'form-res.html',
})
export class FormResPage {

  Done:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.Done= this.navParams.get('ok')
  }


  irHome(){
    this.navCtrl.popTo(HomePage)
  }

}
