import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPadresComponent } from './login-padres.component';

describe('LoginPadresComponent', () => {
  let component: LoginPadresComponent;
  let fixture: ComponentFixture<LoginPadresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPadresComponent]
    });
    fixture = TestBed.createComponent(LoginPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
