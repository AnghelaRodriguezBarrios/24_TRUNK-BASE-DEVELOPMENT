import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMatrpensComponent } from './login-matrpens.component';

describe('LoginMatrpensComponent', () => {
  let component: LoginMatrpensComponent;
  let fixture: ComponentFixture<LoginMatrpensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginMatrpensComponent]
    });
    fixture = TestBed.createComponent(LoginMatrpensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
