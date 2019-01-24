import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()

export class ArchivosProvider {

  UrlRestServer = '192.168.1.105';
  PortRestServer = '3000';
  FullUrl: string = ''

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
    public file: File,
    public storage: Storage
  ) { }

  fileTransfer: FileTransferObject = this.transfer.create();



  // SubirImagen(fotos: any[], _id) {

  //   this.leerConfig();

  //   let PathDir = fotos[0].split('cache')[0];

  //   return new Promise((resolve, reject) => {
  //     for (let i = 0; i < fotos.length; i++) {
  //       this.fileTransfer.upload(fotos[i], this.FullUrl + `/archivos/upload/imagenes/${_id}`, this.optionsImage)
  //         .then((res: any) => {
  //           console.log(res.ok);
  //         }, (err) => {
  //           console.log(err);
  //           this.file.removeRecursively(PathDir, 'cache').then(() => {
  //             console.log('Borrado');
  //           }).catch(err => {
  //             console.log(JSON.stringify(err));
  //           });
  //           reject(err)
  //         });
  //     };
  //     this.file.removeRecursively(PathDir, 'cache').then(() => {
  //       console.log('Borrado');
  //     }).catch(err => {
  //       console.log(JSON.stringify(err));
  //     });
  //     resolve();
  //   });
  // };



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
            if (i == fotos.length - 1) {
              this.BorrarDir(PathDir);
              resolve();
            };
          })
          .catch((err) => {
            reject()
            this.BorrarDir(PathDir);
          });
      };
    });
  };


  BorrarDir(PathDir) {
    this.file.removeRecursively(PathDir, 'cache')
      .then(() => {
        console.log('Dir Imagenes Borrado');
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  };


  // SubirAudio(Audio: string, _id) {

  //   this.leerConfig()

  //   return new Promise((resolve, reject) => {
  //     this.fileTransfer.upload(Audio, this.FullUrl + `/archivos/upload/audio/${_id}`, this.optionsAudio).then((res: any) => {
  //       resolve();
  //     }).catch((err) => {
  //       console.log(err);
  //       reject();
  //     });
  //   });
  // };


  async SubirAudio(Audio: string, _id) {

    await this.leerConfig();

    return new Promise((resolve, reject) => {
      this.fileTransfer.upload(
        Audio,
        this.FullUrl + `/archivos/upload/audio/${_id}`,
        this.optionsAudio
      )
        .then((res: any) => {
          resolve();
        })
        .catch((err) => {
          reject();
        });
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




  // leerConfig() {

  //   this.storage.get('UrlServer').then((res) => {
  //     this.UrlRestServer = res
  //     console.log(res);
  //   }).catch((err) => {
  //     console.log(err);
  //   });

  //   this.storage.get('PortServer').then((res) => {
  //     this.PortRestServer = res
  //     console.log(res);
  //   }).catch((err) => {
  //     console.log(err);
  //   });

  //   this.FullUrl = 'http://' + this.UrlRestServer + ':' + this.PortRestServer

  // };


}