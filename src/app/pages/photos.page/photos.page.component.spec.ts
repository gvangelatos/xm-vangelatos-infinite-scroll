import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotosPageComponent } from './photos.page.component';
import { InfiniteScrollTriggerDirective } from '../../directives/infinite-scroll-trigger/infinite-scroll-trigger.directive';
import { MockInfiniteScrollTriggerDirective } from '../../testing/testing.mocks';

describe('PhotosPageComponent', () => {
  let component: PhotosPageComponent;
  let fixture: ComponentFixture<PhotosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        {
          provide: InfiniteScrollTriggerDirective,
          useClass: MockInfiniteScrollTriggerDirective,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
