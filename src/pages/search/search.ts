import { RegistroDetallePage } from './../registro-detalle/registro-detalle';
import { RegistrosProvider } from './../../providers/registros/registros';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  parametro: any;

  parametros: string[] = [
    'Cultivo',
    'Causa',
    'Analista',
    'Descripción',
    'Método de cultivo',
    'Método de producción',
    'Tipo de fruto',
    'Lugar de procedencia',
    'Tratamiento sugerido'
  ];


  query: string = '';
  page: number = 1;
  results: any[] = [];
  desplazamiento: boolean = true;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public registro: RegistrosProvider
  ) { }


  ClearReg() {
    this.results = [];
    this.query = '';
  }

  onInput() {

    this.results = [];
    this.desplazamiento = true;

    if (this.query != '') {
      this.registro.ObtenerRegistros(this.parametro, this.query, 0).then((Registros: any[]) => {
        if (Registros) {
          this.results = Registros;
        }
      }).catch(() => { });
    };
  };


  VerRegistro(registro) {
    this.navCtrl.push(RegistroDetallePage, registro)
  }


  doInfinite(infiniteScroll) {

    if (this.desplazamiento == true) {
      this.page = this.page + 1;

      this.registro.ObtenerRegistros(this.parametro, this.query, this.page).then((Registros: any[]) => {
        if (Registros[0] != undefined) {
          Registros.forEach(element => {
            this.results.push(element);
          });
        } else {
          this.desplazamiento = false;
        }
      }).catch(() => { });
    };

    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
