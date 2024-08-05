import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNotasComponent } from './login-notas.component';

describe('LoginNotasComponent', () => {
  let component: LoginNotasComponent;
  let fixture: ComponentFixture<LoginNotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginNotasComponent]
    });
    fixture = TestBed.createComponent(LoginNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
