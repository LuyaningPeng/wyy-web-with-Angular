import {NgModule} from '@angular/core';
import {SingleSheetComponent} from './single-sheet/single-sheet.component';
import {PlayCountPipe} from "../play-count.pipe";
import {WyPlayerModule} from "./wy-player/wy-player.module";
import {WySliderModule} from "./wy-slider/wy-slider.module";


@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe
  ],
  imports: [
    WyPlayerModule,
    WySliderModule,
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
    WySliderModule
  ]
})
export class WyUiModule {
}
