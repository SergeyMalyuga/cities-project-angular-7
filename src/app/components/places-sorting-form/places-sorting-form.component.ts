import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { SortType } from '../../core/constants/const';
import { NgClass } from '@angular/common';
import { ToggleDirective } from '../../shared/directives/toggle.directive';
import { AccessibilityClickDirective } from '../../shared/directives/accessibility-click.directive';

@Component({
  selector: 'app-places-sorting-form',
  imports: [NgClass, ToggleDirective, AccessibilityClickDirective],
  templateUrl: './places-sorting-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacesSortingFormComponent {
  @Input({ required: true }) currentSortType!: SortType;
  @Output() clicked = new EventEmitter<SortType>();

  public sortTypes = Object.values(SortType);
  public isOptionsOpen = signal<boolean>(false);

  public toggleOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  public closeOptions() {
    this.isOptionsOpen.set(false);
  }

  public onClicked(sortType: SortType) {
    this.clicked.emit(sortType);
    this.closeOptions();
  }
}
