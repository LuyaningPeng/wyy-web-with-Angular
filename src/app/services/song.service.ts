import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Song, SongSheet, SongUrl} from "./data-types/common.types";
import * as url from "url";

@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {
  }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get<{ data: SongUrl[] }>(this.uri + 'song/url/v1', {params}).pipe(
      map(res => res.data)
    )
  }

  // getSongList(songs: Song | Song[]): Observable<Song[]> {
  //   const songArr = Array.isArray(songs) ? songs.slice() : [songs];
  //   const ids = songArr.map(items => items.id).join(',');
  //   return new Observable<Song[]>((subscriber) => {
  //     this.getSongUrl(ids).subscribe(urls => {
  //       subscriber.next(this.generateSongList(songArr, urls));
  //     })
  //   })
  // }
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(items => items.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr, urls)));
  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result:Song[] = [];
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id);
      if (typeof url !== 'undefined'){
        song.url = url.url;
        result.push(song);
      }
    })

    return result;
  }
}
