import { Component, OnInit , AfterViewInit, Renderer2} from '@angular/core';
import { Payment } from 'src/app/model/payment.interface';
import { PaymentService } from 'src/app/service/payment.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Manager } from 'src/app/model/manager.interface';
import { ManagerService } from 'src/app/service/manager.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit, AfterViewInit {
  activePayments: Payment[] = [];
  inactivePayments: Payment[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  showActivePayments: boolean = true;

  searchManager: string = '';
  searchDescription: string = '';
  searchPaymentDate: string = ''; 
  searchDueDate: string = '';

  managers: Manager[] = [];

  constructor(
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private managerService: ManagerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getAllPayments();
    this.getManagers();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  private getManagers(): void {
    this.managerService.getAllManagers().subscribe(
      (managers: Manager[]) => {
        this.managers = managers.filter(manager => manager.status === 'A');
      },
      error => {
        console.error('Error al obtener los managers:', error);
        this.toastr.error('Error al obtener los managers. Por favor, inténtelo de nuevo.');
      }
    );
  }

  getAllPayments(): void {
    this.paymentService.getAllPayments().subscribe(
      (payments: Payment[]) => {
        // Filtrar y ordenar payments activos por ID
        this.activePayments = payments.filter(payment => payment.status === 'A' &&
            payment.manager && payment.manager.id && payment.manager.id.includes(this.searchManager) &&
            payment.description && payment.description.includes(this.searchDescription) &&
            payment.date && payment.date.includes(this.searchPaymentDate) &&
            payment.dueDate && payment.dueDate.includes(this.searchDueDate)
        );
        this.activePayments.sort((a, b) => {
          if (a.id && b.id) {
            return Number(a.id) - Number(b.id);
          }
          return 0;
        });

        // Filtrar y ordenar managers inactivos por ID
        this.inactivePayments = payments.filter(payment => payment.status === 'I' &&
            payment.manager && payment.manager.id && payment.manager.id.includes(this.searchManager) &&
            payment.description && payment.description.includes(this.searchDescription) &&
            payment.date && payment.date.includes(this.searchPaymentDate) &&
            payment.dueDate && payment.dueDate.includes(this.searchDueDate)
        );
        this.inactivePayments.sort((a, b) => {
          if (a.id && b.id) {
            return Number(a.id) - Number(b.id);
          }
          return 0;
        });

        console.log("Mostrando a todos los payments: ", payments);
      },
      error => {
        console.error('Error al obtener los payments:', error);
        this.toastr.error('Error al obtener los payments. Por favor, inténtelo de nuevo.');
      }
    );
  }

  deletePayment(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar este pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentService.deletePayment(id)
          .subscribe(() => {
            Swal.fire('Eliminado!', 'El pago ha sido eliminado.', 'success');
            this.getAllPayments();
          }, (error: any) => { // Aquí puedes especificar el tipo de error si lo conoces
            Swal.fire('Error', 'Error al eliminar el pago. Por favor, inténtelo de nuevo.', 'error');
            console.error('Error:', error);
          });
      }
    });
  }
  
  reactivatePayment(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de reactivar este pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentService.activatePayment(id.toString())
          .subscribe(() => {
            Swal.fire('Reactivado!', 'El pago ha sido reactivado.', 'success');
            this.getAllPayments();
          }, (error: any) => {
            Swal.fire('Error', 'Error al reactivar el pago. Por favor, inténtelo de nuevo.', 'error');
            console.error('Error:', error);
          });
      }
    });
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const maxPageActive = Math.ceil(this.activePayments.length / this.itemsPerPage);
    const maxPageInactive = Math.ceil(this.inactivePayments.length / this.itemsPerPage);
    const maxPage = Math.max(maxPageActive, maxPageInactive);
    if (this.currentPage < maxPage) {
      this.currentPage++;
    }
  }

  toggleShowInactive(): void {
    this.showActivePayments = !this.showActivePayments;
    this.currentPage = 1; // Reinicia la página a la primera cuando se cambia de lista
    this.getAllPayments(); // Obtén los pagos activos o inactivos según el estado actual
  }


  exportToExcelActive(): void {
    const paymentsWithManagerNames = this.activePayments.map(payment => ({
      ...payment,
      manager: `${payment.manager.firstName} ${payment.manager.lastName}`
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.activePayments);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'RegistrosPagos');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  exportToCSV(): void {
    const paymentsWithManagerNames = this.activePayments.map(payment => ({
      ...payment,
      manager: `${payment.manager.firstName} ${payment.manager.lastName}`
    }));
    const header = Object.keys(this.activePayments[0]) as (keyof Payment)[]; // Obtener las claves como tipo keyof Payment
    const csvData = this.activePayments.map((payment) => {
      return header.map((field) => {
        return payment[field]; // Acceder a las propiedades del objeto utilizando las claves extraídas
      });
    });

    csvData.unshift(header.map(String)); // Convertir las claves a cadena antes de insertarlas en el CSV
    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'RegistrosPagos.csv');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    // Agregar un título al PDF
    doc.text('Lista de Pagos', 10, 10);
    // Define las columnas de la tabla
    const columns = ['Manager', 'Descripción', 'Fecha de Vencimiento', 'Fecha','Monto'];
    // Mapea los datos a un formato que jsPDF pueda usar
    const rows = this.activePayments.map(payment => [
      `${payment.manager.firstName} ${payment.manager.lastName}`,
      payment.description,
      payment.dueDate,
      payment.date,
      payment.amount
    ]);
    // Genera la tabla en el PDF
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20
    });
    // Guarda el PDF
    doc.save('RegistrosPagos.pdf');
  }

  formatDateOfBirth(date: Date | string | null | undefined): string {
    if (!date) {
      return ''; // o cualquier valor predeterminado que desees
    }
  
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    
    // Definir los nombres de los meses en español abreviados
    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
  
    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = monthNames[dateObject.getUTCMonth()];
    const year = dateObject.getUTCFullYear();
  
    // Construir la fecha en el formato deseado (dd-Mmm-yyyy)
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  }  

  formatAmount(amount: string | undefined): string {
    if (amount === undefined) {
      return ''; // Maneja el caso de 'undefined'
    }
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return ''; // Maneja el caso de que amount no sea un número válido
    }
    
    return numericAmount.toFixed(2); // Formatea el número con dos decimales
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
