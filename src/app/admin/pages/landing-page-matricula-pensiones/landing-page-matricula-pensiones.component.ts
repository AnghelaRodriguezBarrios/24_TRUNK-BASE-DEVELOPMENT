import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-matricula-pensiones',
  templateUrl: './landing-page-matricula-pensiones.component.html',
  styleUrls: ['./landing-page-matricula-pensiones.component.css']
})
export class LandingPageMatriculaPensionesComponent {
  constructor(private router: Router) {}

  navigateToLoginMatriPens() {
    this.router.navigate(['/login-matricula-pensiones']);
  }
}