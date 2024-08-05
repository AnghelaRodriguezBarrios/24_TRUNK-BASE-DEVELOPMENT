import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-notas',
  templateUrl: './dashboard-notas.component.html',
  styleUrls: ['./dashboard-notas.component.css']
})
export class DashboardNotasComponent {
  isDropdownOpen = false;
  isCursosOpen = false;
  isNotasOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleCursos() {
    this.isCursosOpen = !this.isCursosOpen;
  }

  toggleNotas() {
    this.isNotasOpen = !this.isNotasOpen;
  }
}
