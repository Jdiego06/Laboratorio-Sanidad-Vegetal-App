import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroDetallePage } from './registro-detalle';

@NgModule({
  declarations: [
    RegistroDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroDetallePage),
  ],
})
export class RegistroDetallePageModule {}
