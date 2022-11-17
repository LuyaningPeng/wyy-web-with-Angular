import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {SliderEventObserverConfig} from "./data-types/common.types";
import {distinctUntilChanged, filter, fromEvent, map, mergeWith, Observable, Subscription, takeUntil, tap} from "rxjs";
import {getElementOffset, silentEvent} from "../../../util/dom";
import {ensureNumberInRange, getPercent} from "../../../util/number";
import {DOCUMENT} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {


  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferOffset: number = 0;

  @ViewChild('wySlider', {static: true}) private mySlider!: ElementRef;
  private sliderDom!: HTMLDivElement;

  private dragStart$?: Observable<number>;
  private dragMove$?: Observable<number>;
  private dragEnd$?: Observable<Event>;
  private dragStart_?: Subscription | null;
  private dragMove_?: Subscription | null;
  private dragEnd_?: Subscription | null;

  private isDragging = false;
  private value!: number;
  offset!: number;


  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.sliderDom = this.mySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start'])
  }

  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }

  // 模仿ng-zorro制作滑块监控
  private createDraggingObservables() {
    // const orientField = this.wyVertical ? 'pageX' : 'pageY';

    // MouseEvent获取位置：e.pageX和e.pageY
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    };

    // TouchEvnet获取位置：e.touched[0].pageX和e.touched[0].pageY
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent | MouseEvent) => e instanceof TouchEvent,
    };

    [mouse, touch].forEach(source => {
      const {start, move, end, filter: filterFunc = () => true, pluckKey} = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFunc),
        tap(silentEvent),
        map(this.getPosition.bind(this)),
        map((position: number) => this.findClosestValue(position)),
      );
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFunc),
        tap(silentEvent),
        map(this.getPosition.bind(this)),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        distinctUntilChanged(),
        takeUntil(source.end$)
      );
    })

    this.dragStart$ = mouse.startPlucked$!.pipe(mergeWith(touch.startPlucked$!));
    this.dragMove$ = mouse.moveResolved$!.pipe(mergeWith(touch.moveResolved$!));
    this.dragEnd$ = mouse.end$!.pipe(mergeWith(touch.end$!));


  }

  findClosestValue(position: number): number {
    const sliderStart = this.getSliderStartPosition();
    const sliderLength = this.getSliderLength();
    const ratio = ensureNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    return (this.wyMax - this.wyMin) * (this.wyVertical ? 1 - ratio : ratio) + this.wyMin;
  }

  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getPosition(e: Event): number {
    if (e instanceof TouchEvent)
      return this.wyVertical ? (e as TouchEvent).touches[0].pageY : (e as TouchEvent).touches[0].pageX;
    else
      return this.wyVertical ? (e as MouseEvent).pageY : (e as MouseEvent).pageX;
  }

  private subscribeDrag(periods: string[] = ['start', 'move', 'end']) {
    if (periods.indexOf('start') !== -1 && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (periods.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (periods.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(periods: string[] = ['start', 'move', 'end']) {
    if (periods.indexOf('start') !== -1 && this.dragStart$ && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (periods.indexOf('move') !== -1 && this.dragMove$ && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (periods.indexOf('end') !== -1 && this.dragEnd$ && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(value: number): void {
    this.toggleDragMoving(true);
    this.setValue(value);
    this.cdr.markForCheck();
  }

  private onDragMove(value: number): void {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }

  private onDragEnd(): void {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private toggleDragMoving(movable: boolean): void {
    const periods = ['move', 'end'];
    if (movable) {
      this.isDragging = true;
      this.subscribeDrag(periods)
    } else {
      this.isDragging = false;
      this.unsubscribeDrag(periods);
    }
  }

  private setValue(value: number, needCheck = false) {
    if (needCheck){
      if (this.isDragging) return;
      this.value = this.formattedValue(value);
      this.updateTrackAndHandle();
    }else if (this.value !== value) {
      this.value = value;
      this.updateTrackAndHandle()
      this.onValueChange(this.value);
    }

  }

  private formattedValue(value: number): number{
    if (this.assertValueValid(value)) {
      return this.wyMin;
    }else {
      return ensureNumberInRange(value, this.wyMin, this.wyMax);
    }
  }

  private assertValueValid(value: number): boolean{
    return isNaN(value);
  }

  private updateTrackAndHandle() {
    this.offset = this.getValueToOffset(this.value);
  }

  private getValueToOffset(value: number): number {
    return getPercent(value, this.wyMin, this.wyMax)
  }

  private onValueChange(value: number): void{}
  private onTouched(): void{}

  registerOnChange(fn: (value: number) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: number): void {
    this.setValue(value, true);
  }

}
