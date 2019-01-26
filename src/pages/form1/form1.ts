import { FormResPage } from './../form-res/form-res';
import { Form2Page } from './../form2/form2';
import { RegistrosProvider } from './../../providers/registros/registros';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.myForm = this.createMyForm();
  }

  ionViewWillEnter() {
    this.TestConection();
  };



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

    if (!this.myForm.valid) {
      const alert = this.alertCtrl.create({
        title: 'Aún hay campos vacíos',
        subTitle: 'Para continuar llene los campos obligatorios marcados con *',
        buttons: ['OK']
      });
      alert.present();
    } else {


      let loading = this.loadingCtrl.create({
        content: 'Por Favor Espere...'
      });

      loading.present();

      this.registro.EnviarRegistro(this.myForm.value)
        .then((res: any) => {
          loading.dismiss();
          this.VerForm2Page(res._id);
        })
        .catch(() => {
          loading.dismiss();
          this.VerFormResPage(false);
        });
    }
  };



  VerFormResPage(ok) {
    this.navCtrl.push(FormResPage, { ok: ok })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };


  VerForm2Page(_id) {
    this.navCtrl.push(Form2Page, { _id: _id })
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  };

};
