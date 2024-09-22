import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDetailsComponent } from './pos-details.component';

describe('PosDetailsComponent', () => {
  let component: PosDetailsComponent;
  let fixture: ComponentFixture<PosDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
