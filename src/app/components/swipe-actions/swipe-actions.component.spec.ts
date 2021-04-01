import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeActionsComponent } from './swipe-actions.component';

describe('SwipeActionsComponent', () => {
  let component: SwipeActionsComponent;
  let fixture: ComponentFixture<SwipeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwipeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
