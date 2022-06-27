import {NgModule} from '@angular/core';
import {ToStaticFileContentPipe} from './to-static-file-content.pipe';

@NgModule({
  declarations: [
    ToStaticFileContentPipe
  ],
  exports: [
    ToStaticFileContentPipe
  ]
})
export class ToStaticFileContentPipeModule {

}
