import {NgModule} from "@angular/core";
import {ModuleLevelDemoModule} from "./module-level-demo/module-level-demo.module";

@NgModule({
  imports: [
    ModuleLevelDemoModule
  ],
  exports: [
    ModuleLevelDemoModule
  ]
})
export class DemoModule {

}
