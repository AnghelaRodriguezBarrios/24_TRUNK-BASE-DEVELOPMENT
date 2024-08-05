import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-control-inventario',
  templateUrl: './landing-page-control-inventario.component.html',
  styleUrls: ['./landing-page-control-inventario.component.css']
})
export class LandingPageControlInventarioComponent {
  constructor(private router: Router) { }

  navigateToLoginInventario() {
    this.router.navigate(['/login-inventario']);
  }
}