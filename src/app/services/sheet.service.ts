import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable, switchMap} from "rxjs";
import {Song, SongSheet} from "./data-types/common.types";
import {SongService} from "./song.service";

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient,
              @Inject(API_CONFIG) private uri: string,
              private songService: SongService) {
  }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id);
    return this.http.get<{ playlist: SongSheet }>(this.uri + 'playlist/detail', {params}).pipe(
      map(res => res.playlist)
    )
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
      .pipe(map(songSheet => songSheet.tracks),
        switchMap(tracks => this.songService.getSongList(tracks))
      )
  }
}
