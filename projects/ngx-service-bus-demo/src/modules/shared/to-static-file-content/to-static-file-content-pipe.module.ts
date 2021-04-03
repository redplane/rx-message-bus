import {NgModule} from '@angular/core';
import {ToStaticFileContentPipe} from '@demo-app/modules/shared/to-static-file-content/to-static-file-content.pipe';

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
