import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-inventario',
  templateUrl: './login-inventario.component.html',
  styleUrls: ['./login-inventario.component.css']
})
export class LoginInventarioComponent {
  username: string = '';
  password: string = '';
  recoveryEmail: string = '';
  message: string = '';
  recoveryMessage: string = '';
  showRecoveryForm: boolean = false;

  constructor(private router: Router) {}

  login() {
    if (this.username === 'AdminInventario' && this.password === '12345') {
      this.router.navigate(['/dashboard-inventario']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

  showRecoveryInventarioForm() {
    this.showRecoveryForm = true;
  }

  showInventarioForm() {
    this.showRecoveryForm = false;
  }

  requestPasswordRecovery() {
    // Simulate password recovery process
    this.recoveryMessage = 'Recovery email has been sent';
  }
}