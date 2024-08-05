import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Payment } from 'src/app/model/payment.interface';
import { PaymentService } from 'src/app/service/payment.service';
import { ManagerService } from 'src/app/service/manager.service';
import { Manager } from 'src/app/model/manager.interface';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit, AfterViewInit {

  payment: Payment = {
    id: undefined,
    manager: {
      id: undefined,
      firstName: '',
      lastName: ''
    },
    description: '',
    dueDate: '',
    date: '',
    amount: '',
    status: 'A'
  };

  managers: Manager[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private managerService: ManagerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const paymentId = params['id'];
      this.getPayment(paymentId);
    });
    this.getManagers();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }


  getPayment(id: string): void {
    this.paymentService.getPaymentById(id).subscribe(
      (payment: Payment) => {
        this.payment = payment;
      },
      error => {
        console.error('Error al obtener el pago:', error);
      }
    );
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

  updatePayment(): void {
    this.paymentService.updatePayment(this.payment.id!.toString(), this.payment).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Pago actualizado exitosamente'
        });
        this.router.navigate(['/payment']);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el pago. Por favor, inténtelo de nuevo.'
        });
        console.error('Error al actualizar el pago:', error);
      }
    );
  }  

  onSubmit(paymentForm: NgForm): void {
    if (paymentForm.valid) {
      Swal.fire({
        title: '¿Estás seguro de actualizar este pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updatePayment();
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

  onCancel(): void {
    this.router.navigate(['/payment']);
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
