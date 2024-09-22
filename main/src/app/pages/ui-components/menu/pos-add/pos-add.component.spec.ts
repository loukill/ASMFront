import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosAddComponent } from './pos-add.component';

describe('PosAddComponent', () => {
  let component: PosAddComponent;
  let fixture: ComponentFixture<PosAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
