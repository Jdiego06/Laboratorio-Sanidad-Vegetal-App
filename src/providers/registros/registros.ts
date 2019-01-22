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



  TestConexion() {

    return new Promise((resolve, reject) => {
      this.leerConfig().then(() => {
        this.http.get(this.FullUrl + '/test', this.httpOptions).subscribe((res: any) => {
          this.resp = res.ok
          if (this.resp == true) {
            resolve(true);
          }
        }, (err) => {
          console.log(JSON.stringify(err));
          reject();
        });
      });
    });
  };

  EnviarRegistro(datos) {
    this.leerConfig();

    return new Promise((resolve, reject) => {
      this.http.post(this.FullUrl + "/registros", datos, this.httpOptions).subscribe((data: any) => {
        if (data.ok) {
          resolve({
            State: true,
            _id: data.Registro._id
          })
        } else {
          reject(data.err)
        }
      },
        err => {
          reject(err);
        });
    });
  };




  BorrarRegistro(_id: string) {
    this.leerConfig();

    return new Promise((resolve, reject) => {
      this.http.delete(this.FullUrl + `/registros/${_id}`, this.httpOptions).subscribe((res: any) => {
        this.resp = res.ok
        if (this.resp == true) {
          resolve();
        }
      }, (err) => {
        console.log(err);
        reject();
      });
    });
  };

  leerConfig() {


    return new Promise((resolve, reject) => {

      this.storage.get('UrlServer').then((res1) => {
        this.UrlRestServer = res1
        this.storage.get('PortServer').then((res2) => {
          this.PortRestServer = res2
          this.FullUrl = 'http://' + this.UrlRestServer + ':' + this.PortRestServer
          resolve()
        }).catch((err) => {
          reject(err)
          console.log(err);
        });
      }).catch((err) => {
        reject(err)
        console.log(err);
      });
    });
  };




};
