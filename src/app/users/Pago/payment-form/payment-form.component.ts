import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/model/payment.interface';
import { ManagerService } from 'src/app/service/manager.service';
import { Manager } from 'src/app/model/manager.interface';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, AfterViewInit {
  newPayment: Payment = {
    id: undefined,
    manager: {
      id: undefined,
      firstName: undefined,
      lastName: undefined
    },
    description: '',
    dueDate: '',
    date: '',
    amount: '',
    status: 'A'
  };

  managers: Manager[] = [];

  constructor(
    private paymentService: PaymentService,
    private managerService: ManagerService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getManagers();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  getManagers(): void {
    this.managerService.getAllManagers().subscribe(
      (managers: Manager[]) => {
        this.managers = managers.filter(manager => manager.status === 'A'); // Solo managers activos
      },
      error => {
        console.error('Error al obtener los managers:', error);
      }
    );
  }

  onSubmit(paymentForm: NgForm) {
    if (paymentForm.valid) {
      Swal.fire({
        title: '¿Estás seguro de agregar este pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.paymentService.createPayment(this.newPayment).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Pago agregado exitosamente'
              });
              this.clearForm();
              this.router.navigate(['/payment']);
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar nuevo pago. Por favor, inténtelo de nuevo.'
              });
              console.error('Error al agregar nuevo Pago:', error);
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
    this.router.navigate(['/payment']);
  }

  clearForm() {
    this.newPayment = {
      id: undefined,
      manager: {
        id: undefined,
        firstName: undefined,
        lastName: undefined
      },
      description: '',
      dueDate: '',
      date: '',
      amount: '',
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
