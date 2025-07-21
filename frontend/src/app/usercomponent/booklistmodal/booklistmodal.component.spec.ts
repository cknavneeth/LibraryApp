import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooklistmodalComponent } from './booklistmodal.component';

describe('BooklistmodalComponent', () => {
  let component: BooklistmodalComponent;
  let fixture: ComponentFixture<BooklistmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooklistmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooklistmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
