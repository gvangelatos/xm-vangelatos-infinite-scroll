import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoDetailsPageComponent } from './photo-details.page.component';

describe('PhotoDetailsPageComponent', () => {
  let component: PhotoDetailsPageComponent;
  let fixture: ComponentFixture<PhotoDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
