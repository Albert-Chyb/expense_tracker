import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZippyStaticComponent } from './zippy-static.component';

describe('ZippyStaticComponent', () => {
  let component: ZippyStaticComponent;
  let fixture: ComponentFixture<ZippyStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZippyStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZippyStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
