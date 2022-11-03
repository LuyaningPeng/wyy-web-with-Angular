import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {map, Observable} from "rxjs";
import {Banner, BannerList} from "./data-types/common.types";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getBanners(): Observable<Banner[]>{
    return this.http.get<BannerList>(this.uri + 'banner').pipe(
      map((res: BannerList) => res.banners)
    )
  }
}
