import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosEditComponent } from './pos-edit.component';

describe('PosEditComponent', () => {
  let component: PosEditComponent;
  let fixture: ComponentFixture<PosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
