import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {first, forkJoin, Observable} from 'rxjs';
import {HomeService} from "../../services/home.service";
import {SingerService} from "../../services/singer.service";
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";

export type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]]

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<any> {
  constructor(private homeService: HomeService,
              private singerService: SingerService) {
  }

  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSingers()]
    ).pipe(first())
  }
}
