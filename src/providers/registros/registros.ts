import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RegistrosProvider {


  UrlRestServer: string = '192.168.1.105';
  PortRestServer: string = '3000';
  FullUrl: string = ''

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  resp: boolean = false


  constructor(public http: HttpClient, private storage: Storage) {
  }



  async TestConexion() {

    await this.leerConfig();

    return new Promise((resolve, reject) => {
      this.http.get(
        this.FullUrl + '/test',
        this.httpOptions
      )
        .subscribe((res: any) => {
          this.resp = res.ok
          if (this.resp == true) {
            resolve();
          };
        }, () => {
          reject();
        });
    });
  };

   async EnviarRegistro(datos) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {
      this.http.post(this.FullUrl + '/registros', datos, this.httpOptions).subscribe((data: any) => {
        if (data.ok) {
          resolve({
            State: true,
            _id: data.Registro._id
          })
        } else {
          reject()
        }
      },
        err => {
          reject();
        });
    });
  };




   async BorrarRegistro(_id: string) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {

      this.http.delete(
        this.FullUrl + `/registros/${_id}`,
        this.httpOptions
      )
        .subscribe((res: any) => {
          console.log('Done');
          resolve();
        }, () => {
          console.log('Fail');
          reject();
        });
    });
  };



   async ObtenerRegistros(parametro, query, pagina) {

    await this.leerConfig();

 
    let parametrosBD = [
      'cultivo',
      'causa',
      'analista',
      'descripcion',
      'metodo_cultivo',
      'metodo_produccion',
      'tipo_fruto',
      'lugar_procedencia',
      'tratamiento_sugerido',
    ];

    parametro=parametrosBD[parametro]

    let Parametros = {
      termino: query,
      parametro: parametro,
      pagina: pagina
    }

    let GetOptions = {
      headers: this.httpOptions.headers,
      params: Parametros
    }

    return new Promise((resolve, reject) => {
      this.http.get(this.FullUrl + `/registros/buscar/`, GetOptions)
        .subscribe((res: any) => {
          resolve(res.registroDb)
        }, (err => {
          reject();
        }));
    });
  };


  async leerConfig() {

    let prom1 = new Promise((resolve, reject) => {
      this.storage.get('UrlServer')
        .then((res) => {
          resolve();
          this.UrlRestServer = res
        })
        .catch(() => {
          reject();
        });
    });

    await prom1;

    let prom2 = new Promise((resolve, reject) => {
      this.storage.get('PortServer')
        .then((res) => {
          resolve();
          this.PortRestServer = res
        })
        .catch(() => {
          reject();
        });
    });

    await prom2
    this.FullUrl = 'http://' + this.UrlRestServer + ':' + this.PortRestServer
    console.log('La Url es: ' + this.FullUrl);
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

};
