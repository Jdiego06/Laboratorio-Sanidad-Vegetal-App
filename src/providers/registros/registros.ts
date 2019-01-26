import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


// Provedor que maneja las solicitudes HTTP para la manipulacion de registros


@Injectable()
export class RegistrosProvider {


  UrlRestServer: string = '192.168.1.105';
  PortRestServer: string = '3000';
  FullUrl: string = ''
  resp: boolean = false

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(
    public http: HttpClient,
    private storage: Storage
  ) { }


  // Prueba simple de conexíon con el servidor

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
      setTimeout(() => {
        reject();
      }, 5000);
    });
  };


  // recibe un objeto de datos, y lo envia al servidor, el cual 
  // devuelve el id con el que se creó

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
        () => {
          reject();
        });
    });
  };


  //  Borra del servidor el registro asociado al id enviado

  async BorrarRegistro(_id: string) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {

      this.http.delete(this.FullUrl + `/registros/${_id}`)
        .subscribe((res: any) => {
          resolve();
        }, () => {
          reject();
        });
    });
  };



  // Obtiene todos los registros del servidor, que contienen el campo "query" asociado 
  // a la llave "parametro", de manera páginada, de 10 en 10 
  // ( esta función es ineficiente, Se deberia enviar el campo "parametro", 
  // y no el índice asociado al vector parametroDB)

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

    parametro = parametrosBD[parametro]

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
        }, (() => {
          reject();
        }));
    });
  };


  // Lee la configuracion de ip y puerto del almacenamiento nativo, 
  // esta es utilizada para hacer las peticiones http

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
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

};
