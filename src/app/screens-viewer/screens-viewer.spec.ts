import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreensViewer } from './screens-viewer';

describe('ScreensViewer', () => {
  let component: ScreensViewer;
  let fixture: ComponentFixture<ScreensViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreensViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreensViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
