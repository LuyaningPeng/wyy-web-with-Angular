import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {map, Observable} from "rxjs";
import {Singer} from "./data-types/common.types";
import {HttpClient, HttpParams} from "@angular/common/http";
import * as queryString from "querystring";

type SingerParams = {
  limit?: number;
  offset?: number;
  type?: number;
  area?: number;
}

const defaultParams: SingerParams = {
  limit: 9,
  offset: 0,
  area: 7
}

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {
  }

  getEnterSingers(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({fromObject: args})
    return this.http.get<{ artists: Singer[] }>(this.uri + 'artist/list', {params}).pipe(
      map(res => res.artists)
    )
  }
}
