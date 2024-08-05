import { Component, OnInit, ViewChild, Renderer2,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Manager } from 'src/app/model/manager.interface';  
import { ManagerService } from 'src/app/service/manager.service';  

@Component({
  selector: 'app-manager-edit',
  templateUrl: './manager-edit.component.html',
  styleUrls: ['./manager-edit.component.css']
})
export class ManagerEditComponent implements OnInit, AfterViewInit {
  managerId: string = '';
  manager: Manager = {
    id: 0,
    firstName: '', 
    lastName: '', 
    documentType: '',  
    documentNumber: '', 
    address: '',
    ubigeoId: 0,
    email: '',
    status: ''
  };

  ubigeoId: string = '';

  @ViewChild('managerForm') managerForm!: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('id') ?? '';
      this.loadManager();
    });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  loadManager(): void {
    this.managerService.getManagerById(this.managerId).subscribe(
      (manager: Manager) => {
        this.manager = manager;
      },
      error => {
        console.error('Error al cargar el manager:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.managerForm.valid) {
      Swal.fire({
        title: '¿Estás seguro de actualizar este manager?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Asignamos el valor de ubigeoId al manager antes de enviar la actualización
          // Aquí es donde debes asignar el valor directamente desde this.manager.ubigeoId
          this.managerService.updateManager(this.managerId, this.manager).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Manager actualizado exitosamente'
              });
              this.router.navigate(['/manager']);
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el manager. Por favor, inténtelo de nuevo.'
              });
              console.error('Error al actualizar el Manager:', error);
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formulario inválido. Verifique los campos obligatorios.'
      });
      console.error('Formulario inválido. Verifique los campos obligatorios.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/manager']);
  }

  getDocumentNumberPattern(): string {
    const selectedDocumentType = this.manager.documentType || '';  // Asegúrate de usar documentType en lugar de documenttype
    const patterns: { [key: string]: string } = {
      'DNI': '[0-9]{8}',       // DNI: 8 dígitos
      'Carné de Extranjería': '[0-9]{12}',      // CNE: 12 dígitos
      'Pasaporte': '[0-9]{12}' // Pasaporte: 12 dígitos
    };
    return patterns[selectedDocumentType] || '';
  }

  getDocumentNumberErrorMessage(): string {
    const selectedDocumentType = this.manager.documentType || '';  // Asegúrate de usar documentType en lugar de documenttype
    const errorMessages: { [key: string]: string } = {
      'DNI': 'Ingresa un número de DNI válido (8 dígitos numéricos).',
      'Carné de Extranjería': 'Ingresa un número de CNE válido (12 dígitos numéricos).',
      'Pasaporte': 'Ingresa un número de Pasaporte válido (12 dígitos numéricos).'
    };
    return errorMessages[selectedDocumentType] || 'Por favor, ingresa un número de documento válido.';
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
