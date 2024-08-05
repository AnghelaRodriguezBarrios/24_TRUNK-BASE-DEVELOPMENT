import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaCargaComponent } from './pagina-carga.component';

describe('PaginaCargaComponent', () => {
  let component: PaginaCargaComponent;
  let fixture: ComponentFixture<PaginaCargaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaCargaComponent]
    });
    fixture = TestBed.createComponent(PaginaCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
