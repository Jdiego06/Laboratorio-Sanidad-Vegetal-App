// Módulos de angular

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

// Recursos Nativos
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Media } from '@ionic-native/media';
import { IonicStorageModule } from '@ionic/storage';


// Páginas
import { HomePage } from '../pages/home/home';
import { SearchPage } from './../pages/search/search';
import { ConfigPage } from './../pages/config/config';
import { Form1Page } from './../pages/form1/form1';
import { Form3Page } from './../pages/form3/form3';
import { Form2Page } from './../pages/form2/form2';
import { FormResPage } from './../pages/form-res/form-res';
import { RegistroDetallePage } from './../pages/registro-detalle/registro-detalle';


// Providers
import { RegistrosProvider } from '../providers/registros/registros';
import { ArchivosProvider } from '../providers/archivos/archivos';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,
    SearchPage,
    Form1Page,
    Form3Page,
    Form2Page,
    FormResPage,
    RegistroDetallePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfigPage,
    SearchPage,
    Form1Page,
    Form3Page,
    Form2Page,
    FormResPage,
    RegistroDetallePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RegistrosProvider,
    Camera,
    File,
    FileTransfer,
    FileTransferObject,
    ArchivosProvider,
    Media
  ]
})

export class AppModule { }
