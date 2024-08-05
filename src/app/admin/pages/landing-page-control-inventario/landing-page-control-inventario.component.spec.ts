import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageControlInventarioComponent } from './landing-page-control-inventario.component';

describe('LandingPageControlInventarioComponent', () => {
  let component: LandingPageControlInventarioComponent;
  let fixture: ComponentFixture<LandingPageControlInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageControlInventarioComponent]
    });
    fixture = TestBed.createComponent(LandingPageControlInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
