import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs";
import {HomeDataType} from "./home.resolver";
import {SheetService} from "../../services/sheet.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;
  banners!: Banner[];
  hotTags!: HotTag[];
  songSheetList!: SongSheet[];
  singers!: Singer[];

  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel!: NzCarouselComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private sheetService: SheetService) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      map(({homeData, title}) => homeData)
    ).subscribe((res: HomeDataType) => {
      const [banners, hotTags, songSheetList, singers] = res;
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    })
  }

  onBeforeChange(e: { from: number; to: number }) {
    this.carouselActiveIndex = e.to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    if (type === 'pre')
      this.nzCarousel.pre();
    else
      this.nzCarousel.next();
  }

  onPlaySheet(id: number){
    this.sheetService.playSheet(id).subscribe(res => {
      console.log(res)
    })
  }
}
