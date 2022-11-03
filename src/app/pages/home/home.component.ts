import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Observable} from "rxjs";
import {Banner} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;
  banners!: Banner[];

  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel!: NzCarouselComponent;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    })
  }

  onBeforeChange(e: {from: number; to: number}){
    this.carouselActiveIndex = e.to;
  }

  onChangeSlide(type: 'pre' | 'next'){
    if (type === 'pre')
      this.nzCarousel.pre();
    else
      this.nzCarousel.next();
  }
}
