import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {CommonModule} from "@angular/common";
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NzIconModule} from "ng-zorro-antd/icon";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzCarouselModule} from "ng-zorro-antd/carousel";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzListModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzCarouselModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzListModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzCarouselModule
  ]
})
export class ShareModule {
}
