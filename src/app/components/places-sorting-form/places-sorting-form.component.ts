import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {SortType} from '../../core/constants/const';
import {NgClass} from '@angular/common';
import {ToggleDirective} from '../../shared/directives/toggle.directive';

@Component({
  selector: 'app-places-sorting-form',
  imports: [
    NgClass,
    ToggleDirective
  ],
  templateUrl: './places-sorting-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacesSortingFormComponent {
  @Input({required: true}) currentSortType!: SortType;

  public sortTypes = Object.values(SortType);
  public isOptionsOpen = signal<boolean>(false);

  public toggleOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  public closeOptions() {
      this.isOptionsOpen.set(false);
  }
}
