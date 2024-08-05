import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ManagerService } from 'src/app/service/manager.service';
import { Manager } from 'src/app/model/manager.interface';

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.css']
})
export class ManagerFormComponent implements OnInit, AfterViewInit {
  newManager: Manager = {
    id: undefined,
    firstName: '', 
    lastName: '',   
    documentType: '',
    documentNumber: '',
    address: '',
    ubigeoId: undefined, 
    email: '',
    status: 'A'
  };

  @ViewChild('managerForm') managerForm!: NgForm;

  constructor(
    private managerService: ManagerService,
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  getDocumentNumberPattern(): string {
    const selectedDocumentType = this.newManager.documentType || '';
    const patterns: { [key: string]: string } = {
      'DNI': '[0-9]{8}',       // DNI: 8 dígitos
      'Carné de Extranjería': '[0-9]{12}',      // CNE: 12 dígitos
      'Pasaporte': '[0-9]{12}' // Pasaporte: 12 dígitos
    };
    return patterns[selectedDocumentType] || '';
  }

  getDocumentNumberErrorMessage(): string {
    const selectedDocumentType = this.newManager.documentType || '';
    const errorMessages: { [key: string]: string } = {
      'DNI': 'Ingresa un número de DNI válido (8 dígitos numéricos).',
      'Carné de Extranjería': 'Ingresa un número de CNE válido (12 dígitos numéricos).',
      'Pasaporte': 'Ingresa un número de Pasaporte válido (12 dígitos numéricos).'
    };
    return errorMessages[selectedDocumentType] || 'Por favor, ingresa un número de documento válido.';
  }

  onSubmit() {
    if (this.managerForm.valid) {
      Swal.fire({
        title: '¿Estás seguro de agregar a este manager?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.managerService.createManager(this.newManager).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Manager agregado exitosamente'
              });
              this.clearForm();
              this.router.navigate(['/manager']);
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar nuevo manager. Por favor, inténtelo de nuevo.'
              });
              console.error('Error al agregar nuevo Manager:', error);
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formulario inválido. Verifique los campos.'
      });
      console.error('Formulario inválido. Verifique los campos.');
    }
  }
  
  onCancel() {
    this.router.navigate(['/manager']);
  }

  clearForm() {
    this.newManager = {
      id: undefined,
      firstName: '', 
      lastName: '',  
      documentType: '',
      documentNumber: '',
      address: '',
      ubigeoId: undefined, 
      email: '',
      status: 'A'
    };
  }
  private initializeSidebar(): void {
    const allDropdown = document.querySelectorAll<HTMLElement>('#sidebar .side-dropdown');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.querySelector<HTMLElement>('nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll<HTMLElement>('#sidebar .divider');

    if (!allDropdown || !sidebar || !toggleSidebar || !allSideDivider) {
      console.error('Elementos no encontrados');
      return;
    }

    allDropdown.forEach(item => {
      const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
      if (!a) return;
      this.renderer.listen(a, 'click', (e) => {
        e.preventDefault();

        if (!a.classList.contains('active')) {
          allDropdown.forEach(i => {
            const aLink = i.parentElement?.querySelector<HTMLElement>('a:first-child');
            if (aLink) {
              aLink.classList.remove('active');
              i.classList.remove('show');
            }
          });
        }

        a.classList.toggle('active');
        item.classList.toggle('show');
      });
    });

    if (sidebar.classList.contains('hide')) {
      allSideDivider.forEach(item => {
        item.textContent = '-';
      });
      allDropdown.forEach(item => {
        const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
        if (a) {
          a.classList.remove('active');
          item.classList.remove('show');
        }
      });
    } else {
      allSideDivider.forEach(item => {
        item.textContent = item.getAttribute('data-text');
      });
    }

    this.renderer.listen(toggleSidebar, 'click', () => {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });

        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
      } else {
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseleave', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseenter', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });
  }

  private initializeMenu(): void {
    const allMenu = document.querySelectorAll<HTMLElement>('main .content-data .head .menu');

    allMenu.forEach(item => {
      const icon = item.querySelector<HTMLElement>('.icon');
      const menuLink = item.querySelector<HTMLElement>('.menu-link');
      if (!icon || !menuLink) return;

      this.renderer.listen(icon, 'click', () => {
        menuLink.classList.toggle('show');
      });

      this.renderer.listen(window, 'click', (e: Event) => {
        if (e.target !== icon && e.target !== menuLink && menuLink.classList.contains('show')) {
          menuLink.classList.remove('show');
        }
      });
    });
  }

  private initializeProgressBar(): void {
    const allProgress = document.querySelectorAll<HTMLElement>('main .card .progress');

    allProgress.forEach(item => {
      const value = item.getAttribute('data-value');
      if (value) {
        (item as HTMLElement).style.setProperty('--value', value);
      }
    });
  }
}
