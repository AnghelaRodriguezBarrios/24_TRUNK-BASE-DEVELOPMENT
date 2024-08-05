import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-matricula-pensiones',
  templateUrl: './landing-page-matricula-pensiones.component.html',
  styleUrls: ['./landing-page-matricula-pensiones.component.css']
})
export class LandingPageMatriculaPensionesComponent {

  username: string = ''
  password: string = ''
  message: string = ''

  constructor(private router: Router) {}

  checkLogin() { 
     if (this.username === 'Admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard-matricula']);
    } else {
      this.message = 'Invalid username or password';
    }
  }
}