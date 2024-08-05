import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-gestion-notas',
  templateUrl: './landing-page-gestion-notas.component.html',
  styleUrls: ['./landing-page-gestion-notas.component.css']
})
export class LandingPageGestionNotasComponent {
  username: string = ''
  password: string = ''
  message: string = ''

  constructor(private router: Router) {}

  checkLogin() { 
     if (this.username === 'Admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard-notas/Panel']);
    } else {
      this.message = 'Invalid username or password';
    }
  }
}
