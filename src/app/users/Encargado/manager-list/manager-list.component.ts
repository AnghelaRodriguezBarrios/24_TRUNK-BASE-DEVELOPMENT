import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Manager } from 'src/app/model/manager.interface';
import { ManagerService } from 'src/app/service/manager.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.css']
})
export class ManagerListComponent implements OnInit, AfterViewInit {
  activeManagers: Manager[] = [];
  inactiveManagers: Manager[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  showActiveManagers: boolean = true;

  searchFirstName: string = '';
  searchLastName: string = '';
  searchDocumentType: string = '';
  searchEmail: string = '';

  districts = [
    { id: 1, name: 'Cerro Azul' },
    { id: 2, name: 'San Luis' },
    { id: 3, name: 'San Vicente' },
    { id: 4, name: 'Imperial' },
    { id: 5, name: 'Mala' },
    { id: 6, name: 'Lunahuana' },
    { id: 7, name: 'Calango' }
  ];

  constructor(
    private managerService: ManagerService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getAllManagers();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  getAllManagers(): void {
    this.managerService.getAllManagers().subscribe(
      (managers: Manager[]) => {
        // Filtrar y ordenar managers activos por ID
        this.activeManagers = managers.filter(manager => manager.status === 'A' &&
          manager.firstName && manager.firstName.includes(this.searchFirstName) &&
          manager.lastName && manager.lastName.includes(this.searchLastName) &&
          (this.searchDocumentType ? manager.documentType === this.searchDocumentType : true) &&
          manager.email && manager.email.includes(this.searchEmail)
        );
        this.activeManagers.sort((a, b) => {
          if (a.id && b.id) {
            return a.id - b.id;
          }
          return 0;
        });

        // Filtrar y ordenar managers inactivos por ID
        this.inactiveManagers = managers.filter(manager => manager.status === 'I' &&
          manager.firstName && manager.firstName.includes(this.searchFirstName) &&
          manager.lastName && manager.lastName.includes(this.searchLastName) &&
          (this.searchDocumentType ? manager.documentType === this.searchDocumentType : true) &&
          manager.email && manager.email.includes(this.searchEmail)
        );
        this.inactiveManagers.sort((a, b) => {
          if (a.id && b.id) {
            return a.id - b.id;
          }
          return 0;
        });

        console.log("Mostrando a todos los managers: ", managers);
      },
      error => {
        console.error('Error al obtener los managers:', error);
        this.toastr.error('Error al obtener los managers. Por favor, inténtelo de nuevo.');
      }
    );
  }

  deleteManager(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar este manager?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.managerService.deleteManager(id)
          .subscribe(() => {
            Swal.fire('Eliminado!', 'El manager ha sido eliminado.', 'success');
            this.getAllManagers();
          }, (error: any) => { // Aquí puedes especificar el tipo de error si lo conoces
            Swal.fire('Error', 'Error al eliminar el manager. Por favor, inténtelo de nuevo.', 'error');
            console.error('Error:', error);
          });
      }
    });
  }
  
  reactivateManager(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de reactivar este manager?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar'
    }).then(result => {
      if (result.isConfirmed) {
        this.managerService.activateManager(id.toString()) // Llama a activateManager con el ID convertido a string
          .subscribe(() => {
            Swal.fire('Reactivado!', 'El manager ha sido reactivado.', 'success');
            this.getAllManagers();
          }, (error: any) => {
            Swal.fire('Error', 'Error al reactivar el manager. Por favor, inténtelo de nuevo.', 'error');
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
    const maxPageActive = Math.ceil(this.activeManagers.length / this.itemsPerPage);
    const maxPageInactive = Math.ceil(this.inactiveManagers.length / this.itemsPerPage);
    const maxPage = Math.max(maxPageActive, maxPageInactive);
    if (this.currentPage < maxPage) {
      this.currentPage++;
    }
  }

  toggleShowInactive(): void {
    this.showActiveManagers = !this.showActiveManagers;
    this.currentPage = 1; // Reinicia la página a la primera cuando se cambia de lista
    this.getAllManagers(); // Obtén los managers activos o inactivos según el estado actual
  }


  exportToExcelActive(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.activeManagers);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'RegistrosManagers');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  exportToCSV(): void {
    const header = Object.keys(this.activeManagers[0]) as (keyof Manager)[]; // Obtener las claves como tipo keyof Manager
    const csvData = this.activeManagers.map((manager) => {
      return header.map((field) => {
        return manager[field]; // Acceder a las propiedades del objeto utilizando las claves extraídas
      });
    });

    csvData.unshift(header.map(String)); // Convertir las claves a cadena antes de insertarlas en el CSV
    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'RegistrosManagers.csv');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    // Agregar un título al PDF
    doc.text('Lista de Encargados', 10, 10);
    // Define las columnas de la tabla
    const columns = ['Nombre', 'Apellido', 'Tipo de Documento', 'N° de Documento','Dirección', 'Ubigeo', 'Email'];
    // Mapea los datos a un formato que jsPDF pueda usar
    const rows = this.activeManagers.map(manager => [
      manager.firstName,
      manager.lastName,
      manager.documentType,
      manager.documentNumber,
      manager.address,
      manager.ubigeoId,
      manager.email
    ]);
    // Genera la tabla en el PDF
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20
    });
    // Guarda el PDF
    doc.save('RegistrosManagers.pdf');
  }
  
  getDistrictName(ubigeoId: number | undefined): string {
    if (ubigeoId === undefined) {
      return 'Sin Ubigeo';
    } else {
      // Buscar el nombre del distrito en la lista
      const district = this.districts.find(district => district.id === ubigeoId);
      return district ? district.name : 'Desconocido';
    }
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

