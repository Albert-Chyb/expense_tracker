import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZippyListComponent } from './zippy-list.component';

describe('ZippyListComponent', () => {
  let component: ZippyListComponent;
  let fixture: ComponentFixture<ZippyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZippyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZippyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
