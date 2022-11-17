import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SongSheet} from "../../../services/data-types/common.types";
import {SheetService} from "../../../services/sheet.service";

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {

  @Input()
  songSheet!: SongSheet;

  @Output()
  onPlay = new EventEmitter<number>();

  constructor(private sheetService: SheetService) {
  }

  ngOnInit(): void {
  }

  playSheet(id: number) {
    this.onPlay.emit(id)
  }

}
