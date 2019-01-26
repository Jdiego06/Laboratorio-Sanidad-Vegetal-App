// Recursos de angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Páginas
import { RegistroDetallePage } from './../registro-detalle/registro-detalle';

// Providers
import { RegistrosProvider } from './../../providers/registros/registros';


// -----------------------------------------------
//                                              --
//          Página para buscar registros        --
//                                              --
// -----------------------------------------------

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  parametro: any;
  query: string = '';
  page: number = 1;
  results: any[] = [];
  desplazamiento: boolean = true;

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public registro: RegistrosProvider
  ) { }


  // Limpia el vector de resultados

  ClearReg() {
    this.results = [];
    this.query = '';
  }

  // Hace una consulta al servidor cada vez que se cambia la barra de búsqueda

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


  // Navega a la pagina de ver registro detallado

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
