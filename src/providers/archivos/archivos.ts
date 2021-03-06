import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';


// Provedor que maneja las solicitudes HTTP para la manipulacion de archivos


@Injectable()

export class ArchivosProvider {

  UrlRestServer = '192.168.1.105';
  PortRestServer = '3000';
  FullUrl: string = ''
  fileTransfer: FileTransferObject;

  optionsImage: FileUploadOptions = {
    fileKey: 'imagenes',
    httpMethod: 'PUT',
    fileName: 'imagen.jpg',
    headers: {},
  }

  optionsAudio: FileUploadOptions = {
    fileKey: 'audio',
    httpMethod: 'PUT',
    fileName: 'audio.mp3',
    headers: {},
  }


  constructor(
    private transfer: FileTransfer,
    private file: File,
    public storage: Storage,
    public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.fileTransfer = this.transfer.create();
    });
  }


  // Recibe un vector de nombres de fotos y las descarga todas del servidor, 
  // retorna el vector con los path de las mismas

  async DescargarImagenes(fotos) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {

      let imgs = [];
      let resp = 0;

      for (let i = 0; i < fotos.length; i++) {

        let name = fotos[i];
        let UrlImg = this.FullUrl + `/archivos/imagen/${name}`

        this.fileTransfer.download(
          UrlImg,
          this.file.dataDirectory + `img${i}.jpg`
        )
          .then((res) => {
            resp++;
            let file = res.toURL();
            imgs.push(file);
            if (resp == (fotos.length)) {
              resolve(imgs);
            }
          })
          .catch(() => {
            reject();
          });
      };
    });
  }


  // Descarga un audio del sevidor, de acuerdo a su nombre, y devuelve el path del mismo

  async DescargarAudio(name) {

    await this.leerConfig();
    let UrlAudio = this.FullUrl + `/archivos/audio/${name}`

    return new Promise((resolve, reject) => {

      this.fileTransfer.download(
        UrlAudio,
        this.file.dataDirectory + `audio0.jpg`
      )
        .then((res) => {
          let file = res.toURL();
          resolve(file);
        })
        .catch(() => {
          reject();
        });
    });
  };


  // Recibe un vector de paths de imagenes, y las sube al servidor

  async SubirImagen(fotos: any[], _id) {

    await this.leerConfig();

    let PathDir = fotos[0].split('cache')[0];
    let UrlImg = this.FullUrl + `/archivos/upload/imagenes/${_id}`

    return new Promise((resolve, reject) => {

      for (let i = 0; i < fotos.length; i++) {

        this.fileTransfer.upload(
          fotos[i],
          UrlImg,
          this.optionsImage
        )
          .then((res: any) => {
            if (i == fotos.length - 1 && res.responseCode == 200) {
              this.BorrarDir(PathDir, 0);
              resolve();
            } else if (i == fotos.length - 1 && res.responseCode != 200) {
              reject();
            };
          })
          .catch(() => {
            reject()
            this.BorrarDir(PathDir, 0);
          });
      };
    });
  };



  // Recibe el path de un objeto de audio, y lo sube al servidor

  async SubirAudio(Audio: string, _id) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {
      this.fileTransfer.upload(
        Audio,
        this.FullUrl + `/archivos/upload/audio/${_id}`,
        this.optionsAudio
      )
        .then((res: any) => {
          if (res.responseCode == 200) {
            resolve();
          } else if (res.responseCode != 200) {
            reject();
          };
        })
        .catch(() => {
          reject();
        });
    });
  };


  // Borra un directorio del almacenamiento nativo,
  // (Esto debería hacerlo otro provider)

  BorrarDir(PathDir, n) {

    if (n == 0) {
      this.file.removeRecursively(PathDir, 'cache')
        .then(() => {
        })
        .catch(() => { });
    } else if (n == 1) {
      let Path = this.file.dataDirectory.split('files')[0];
      this.file.removeRecursively(Path, 'files')
        .then(() => {
        })
        .catch(() => { });
    }
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


}