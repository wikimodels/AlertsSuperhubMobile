import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMenuComponent } from './alert-menu.component';

describe('AlertMenuComponent', () => {
  let component: AlertMenuComponent;
  let fixture: ComponentFixture<AlertMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
