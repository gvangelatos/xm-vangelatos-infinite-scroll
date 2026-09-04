import { Component, input } from '@angular/core';
import { PicsumPhoto } from '../models/picsum-photo.model';

@Component({
  selector: 'app-image',
  standalone: true,
  template: '',
})
export class MockImageComponent {
  photoModel = input<PicsumPhoto>();
  priority = input<boolean>();
}

export const MockPicksumPhoto: PicsumPhoto = {
  id: '12',
  author: 'Paul Jarvis',
  width: 2500,
  height: 1667,
  url: 'https://unsplash.com/photos/I_9ILwtsl_k',
  download_url: 'https://picsum.photos/id/12/2500/1667',
  constructed_url: 'https://picsum.photos/id/12/300',
};
