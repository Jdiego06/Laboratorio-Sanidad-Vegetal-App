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



  SubirImagen(fotos: any[], _id) {

    this.leerConfig();

    let PathDir = fotos[0].split('cache')[0];

    return new Promise((resolve, reject) => {
      for (let i = 0; i < fotos.length; i++) {
        this.fileTransfer.upload(fotos[i], this.FullUrl + `/archivos/upload/imagenes/${_id}`, this.optionsImage)
          .then((res: any) => {
            console.log(res.ok);
          }, (err) => {
            console.log(err);
            this.file.removeRecursively(PathDir, 'cache').then(() => {
              console.log('Borrado');
            }).catch(err => {
              console.log(JSON.stringify(err));
            });
            reject(err)
          });
      };
      this.file.removeRecursively(PathDir, 'cache').then(() => {
        console.log('Borrado');
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
      resolve();
    });
  };


  SubirAudio(Audio: string, _id) {
    
    this.leerConfig()

    return new Promise((resolve, reject) => {
      this.fileTransfer.upload(Audio, this.FullUrl + `/archivos/upload/audio/${_id}`, this.optionsAudio).then((res: any) => {
        console.log(res.ok);
        resolve();
      }).catch((err) => {
        console.log(err);
        reject();
      });
    });
  };


  leerConfig() {
    
    this.storage.get('UrlServer').then((res) => {
      this.UrlRestServer = res
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });

    this.storage.get('PortServer').then((res) => {
      this.PortRestServer = res
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });

    this.FullUrl = 'http://' + this.UrlRestServer + ':' + this.PortRestServer

  };

}
