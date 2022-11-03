import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {CoreModule} from "./core/core.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [

    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
