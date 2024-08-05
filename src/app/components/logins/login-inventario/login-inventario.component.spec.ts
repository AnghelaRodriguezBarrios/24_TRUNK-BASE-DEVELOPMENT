import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInventarioComponent } from './login-inventario.component';

describe('LoginInventarioComponent', () => {
  let component: LoginInventarioComponent;
  let fixture: ComponentFixture<LoginInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginInventarioComponent]
    });
    fixture = TestBed.createComponent(LoginInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
