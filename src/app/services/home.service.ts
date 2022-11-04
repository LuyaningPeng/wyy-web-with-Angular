import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {map, Observable} from "rxjs";
import {Banner, HotTag, SongSheet} from "./data-types/common.types";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {
  }

  getBanners(): Observable<Banner[]> {
    return this.http.get<{ banners: Banner[] }>(this.uri + 'banner').pipe(
      map(res => res.banners)
    )
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get<{ tags: HotTag[] }>(this.uri + 'playlist/hot').pipe(
      map(res => res.tags
        .sort((x, y) => x.position - y.position)
        .slice(0, 5)
      )
    )
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get<{ result: SongSheet[] }>(this.uri + 'personalized').pipe(
      map(res => res.result.slice(0, 16))
    )
  }
}
