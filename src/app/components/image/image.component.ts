import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { PicsumPhoto } from '../../models/picsum-photo.model';
import { IMG_TILE_SIZE } from '../../constants/shared.constants';

@Component({
  imports: [MatIcon, NgOptimizedImage],
  selector: 'app-image',
  styleUrl: './image.component.scss',
  templateUrl: './image.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  readonly photoClickedEmitter = output<PicsumPhoto>();
  readonly photoModel = input.required<PicsumPhoto>();
  readonly priority = input.required<boolean>();

  protected imageClicked() {
    this.photoClickedEmitter.emit(this.photoModel());
  }

  protected readonly IMG_TILE_SIZE = IMG_TILE_SIZE;
}
