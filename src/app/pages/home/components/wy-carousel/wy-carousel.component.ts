import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {

  @ViewChild('dot', {static: true}) dotRef!: TemplateRef<any>;
  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type)
  }

}
