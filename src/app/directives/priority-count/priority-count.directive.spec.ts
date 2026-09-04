import { PriorityCountDirective } from './priority-count.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPriorityCountDirectiveComponent } from '../../testing/testing.mocks';
import { PLATFORM_ID } from '@angular/core';
import { ITEMS_PER_PAGE } from '../../constants/shared.constants';

describe('PriorityCountDirective', () => {
  let fixture: ComponentFixture<MockPriorityCountDirectiveComponent>;
  let directive: PriorityCountDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockPriorityCountDirectiveComponent],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MockPriorityCountDirectiveComponent);
    fixture.detectChanges();

    await fixture.whenStable();
    directive = fixture.componentInstance.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return the correct priority count', () => {
    fixture.componentInstance.colCount.set(4);
    fixture.componentInstance.tileSize.set(100);

    fixture.detectChanges();
    expect(directive.priorityCount()).toBe(
      Math.min(4 * Math.ceil(window.innerHeight / 100), ITEMS_PER_PAGE),
    );
  });

  it('should always return at least one row', () => {
    fixture.componentInstance.colCount.set(4);
    fixture.componentInstance.tileSize.set(window.innerHeight + 1);

    fixture.detectChanges();
    expect(directive.priorityCount()).toBe(4);
  });

  it('should cap priority count at ITEMS_PER_PAGE', () => {
    fixture.componentInstance.colCount.set(100);
    fixture.componentInstance.tileSize.set(1);

    fixture.detectChanges();
    expect(directive.priorityCount()).toBe(ITEMS_PER_PAGE);
  });

  it('should set the --col-count CSS variable', () => {
    fixture.componentInstance.colCount.set(5);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.getPropertyValue('--col-count')).toBe('5');
  });

  it('should set the --tile-size CSS variable', () => {
    fixture.componentInstance.tileSize.set(200);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.getPropertyValue('--tile-size')).toBe('200px');
  });
});
