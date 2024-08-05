import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard-matrpens',
  templateUrl: './dashboard-matrpens.component.html',
  styleUrls: ['./dashboard-matrpens.component.css']
})
export class DashboardMatrpensComponent{

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

