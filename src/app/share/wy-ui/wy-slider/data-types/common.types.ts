import {Observable} from "rxjs";

export type WySliderStyle = {
  height?: string | null;
  width?: string | null;
  left?: string | null;
  bottom?: string | null;
}

export type SliderEventObserverConfig = {
  start: string;
  move: string;
  end: string;
  filter?(e: Event): boolean;
  pluckKey?: string;

  end$?: Observable<Event>;
  moveResolved$?: Observable<number>;
  startPlucked$?: Observable<number>;
}


