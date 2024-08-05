import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-escuela-padres',
  templateUrl: './landing-page-escuela-padres.component.html',
  styleUrls: ['./landing-page-escuela-padres.component.css']
})
export class LandingPageEscuelaPadresComponent {
  constructor(private router: Router) {}

  navigateToLoginPadres() {
    this.router.navigate(['/login-padres']);
  }

}

