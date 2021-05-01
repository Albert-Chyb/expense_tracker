import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesContainerComponent } from './files-container.component';

describe('FilesContainerComponent', () => {
  let component: FilesContainerComponent;
  let fixture: ComponentFixture<FilesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
