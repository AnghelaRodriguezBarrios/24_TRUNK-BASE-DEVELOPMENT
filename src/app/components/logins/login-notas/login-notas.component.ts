import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-notas',
  templateUrl: './login-notas.component.html',
  styleUrls: ['./login-notas.component.css']
})
export class LoginNotasComponent {
  username: string = '';
  password: string = '';
  recoveryEmail: string = '';
  message: string = '';
  recoveryMessage: string = '';
  showRecoveryForm: boolean = false;

  constructor(private router: Router) {}

  checkLogin() {
    if (this.username === 'AdminNotas' && this.password === '12345') {
      this.router.navigate(['/dashboard-notas'], { queryParams: { username: this.username } });
    } else {
      this.message = 'Invalid username or password';
    }
  }

  showRecoveryNotasForm() {
    this.showRecoveryForm = true;
  }

  showNotasForm() {
    this.showRecoveryForm = false;
  }

  requestPasswordRecovery() {
    // Simula el proceso de recuperación de contraseña
    this.recoveryMessage = 'Recovery email has been sent';
  }
}
