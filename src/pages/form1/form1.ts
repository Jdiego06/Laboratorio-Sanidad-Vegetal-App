import { FormResPage } from './../form-res/form-res';
import { Form2Page } from './../form2/form2';
import { RegistrosProvider } from './../../providers/registros/registros';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-form1',
  templateUrl: 'form1.html',
})
export class Form1Page {


  myForm: FormGroup;
  ServerConection = false;


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public registro: RegistrosProvider,
    public loadingCtrl: LoadingController
  ) {
    this.myForm = this.createMyForm();
  }

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


  private createMyForm() {
    return this.formBuilder.group({
      descripcion: ['', Validators.required],
      causa: ['', Validators.required],
      cultivo: ['', Validators.required],
      analista: ['', Validators.required],
      metodo_cultivo: [''],
      metodo_produccion: [''],
      tipo_fruto: [''],
      lugar_procedencia: [''],
      tratamiento_sugerido: [''],
    });
  };


  
  saveData() {

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });

    loading.present();

    this.registro.EnviarRegistro(this.myForm.value).then((res: any) => {
      console.log('Navega Capturar imagenes, id: ' + res._id);
      loading.dismiss();
      this.VerForm2Page(res._id);
    }).catch((err) => {

      console.log('Navega Pagina de error' + err);
      loading.dismiss();
      this.VerFormResPage(false);
    });
  };



  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };


  VerForm2Page(_id) {
    this.navCtrl.push(Form2Page, { _id: _id})
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };
  
};
