import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbookComponent } from './addbook.component';

describe('AddbookComponent', () => {
  let component: AddbookComponent;
  let fixture: ComponentFixture<AddbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
