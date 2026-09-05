import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageComponent } from './image.component';
import { MockPicksumPhoto } from '../../testing/testing.mocks';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photoModel', MockPicksumPhoto);
    fixture.componentRef.setInput('priority', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('imageClicked', () => {
    it('should emit the model', () => {
      fixture.componentRef.setInput('model', MockPicksumPhoto);
      const emitSpy = jest.spyOn(component.photoClickedEmitter, 'emit');
      const container = fixture.nativeElement.querySelector('.container');

      expect(container).toBeTruthy();

      container.click();
      expect(emitSpy).toHaveBeenCalledWith(MockPicksumPhoto);
    });
  });
});
