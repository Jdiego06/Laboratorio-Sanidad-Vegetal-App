// Recursos de angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

// Providers
import { ArchivosProvider } from './../../providers/archivos/archivos';

// Recursos nativos
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';


// ------------------------------------------------------------------------
//                                                                       --
//      Página que muestra la informacion detallada de un registro       --
//                                                                       --
// ------------------------------------------------------------------------




@IonicPage()
@Component({
  selector: 'page-registro-detalle',
  templateUrl: 'registro-detalle.html',
})
export class RegistroDetallePage {

  fotosData: any[] = [];
  audio: MediaObject;
  playing: boolean = false;
  pathAudio: string = '';
  pathImg: string = '';

  registro: any = {
    _id: '',
    imagenes: [],
    descripcion: '',
    causa: '',
    cultivo: '',
    metodo_cultivo: '',
    metodo_produccion: '',
    tipo_fruto: '',
    lugar_procedencia: '',
    tratamiento_sugerido: '',
    analista: 0,
    fecha_creacion: {
      fecha: ''
    }
  }


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private archivo: ArchivosProvider,
    private loadingCtrl: LoadingController,
    private media: Media
  ) { }



  // Descarga toda la informacion correspondiente a un registro

  async ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      content: 'Por Favor Espere...'
    });
    loading.present();

    this.registro = this.navParams.data

    if (this.registro.imagenes) {

      this.archivo.DescargarImagenes(this.registro.imagenes)
        .then((res) => {
          this.MostarImagen(res)
        })
        .catch(() => { });
    }

    if (this.registro.nota_voz) {
      this.archivo.DescargarAudio(this.registro.nota_voz)
        .then((res: string) => {
          this.audio = this.media.create(res);
          this.PlayAudio();
        }).catch(() => { })
    } else {
      this.audio = undefined;
    };

    loading.dismiss();

  };


  //  Borra el directorio donde se almacena el audio al salir

  ionViewWillLeave() {
    this.audio = undefined;
    this.archivo.BorrarDir(this.pathImg, 1);
  }


  // Carga las imagenes en base64 al vector imageData,
  //  esto es ineficiente (ver MostrarImagen en form2Page)

  MostarImagen(imageData) {

    this.fotosData = [];

    imageData.forEach((Data) => {
      let filename = Data.substring(Data.lastIndexOf('/') + 1);
      let path = Data.substring(0, Data.lastIndexOf('/') + 1);
      this.pathImg = path;

      this.file.readAsDataURL(path, filename)
        .then((res: any) => {
          this.fotosData.unshift(res);
        })
        .catch(() => { });
    });
  };


  // Reproduce el objeto de audio

  PlayAudio() {
    this.audio.setVolume(1);
    setTimeout(() => {
      this.StopAudio();
    }, this.audio.getDuration() * 1000);
    this.audio.play();
    this.playing = true
  };

  // Detiene la reproducción del audio

  StopAudio() {
    this.audio.stop();
    this.playing = false;
  };

}
