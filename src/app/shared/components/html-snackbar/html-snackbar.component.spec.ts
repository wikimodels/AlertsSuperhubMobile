import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlSnackbarComponent } from './html-snackbar.component';

describe('SnackbarComponent', () => {
  let component: HtmlSnackbarComponent;
  let fixture: ComponentFixture<HtmlSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlSnackbarComponent],
    });
    fixture = TestBed.createComponent(HtmlSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
