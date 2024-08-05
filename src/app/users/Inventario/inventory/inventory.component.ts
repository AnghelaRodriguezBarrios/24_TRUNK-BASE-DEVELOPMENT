import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Inventory } from 'src/app/model/inventory';
import { InventoryService } from 'src/app/service/inventory.service';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit{
  
  activeInventory: Inventory[] = [];
  inactiveInventory: Inventory[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  showActiveInventory: boolean = true;

  searchFirstName: string = '';
  searchLastName: string = '';
  searchDocumentType: string = '';
  searchRol: string = '';

  constructor(
    private inventoryService:InventoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.listAll();
  }

  deleteProduct(id: string) {
    this.inventoryService.deleteInventory(id).subscribe(data => { 
      console.log(data)
      Swal.fire("Exito", "Se eliminó correctamente", "success")
      this.listAll();
    })
   }


   

  listAll(): void {

    this.inventoryService.getAllInventories().subscribe(data => { 
      this.activeInventory = data;
      console.log(data)
    })
    // this.inventoryService.getAllInventories().subscribe(
    //   (inventorys: Inventory[]) => {
    //     // Filtrar y ordenar inventorys activos por ID
    //     this.activeInventory = inventorys.filter(inventory => inventory.status === 'A' &&
    //       inventory. && manager.firstname.includes(this.searchFirstName) &&
    //       manager.lastname && manager.lastname.includes(this.searchLastName) &&
    //       (this.searchDocumentType ? manager.documenttype === this.searchDocumentType : true) &&
    //       (this.searchRol ? manager.rol && manager.rol.toLowerCase().includes(this.searchRol.toLowerCase()) : true)
    //     );
    //     this.activeManagers.sort((a, b) => {
    //       if (a.id && b.id) {
    //         return a.id - b.id;
    //       }
    //       return 0;
    //     });

    //     // Filtrar y ordenar managers inactivos por ID
    //     this.inactiveManagers = managers.filter(manager => manager.status === 'I' &&
    //       manager.firstname && manager.firstname.includes(this.searchFirstName) &&
    //       manager.lastname && manager.lastname.includes(this.searchLastName) &&
    //       (this.searchDocumentType ? manager.documenttype === this.searchDocumentType : true) &&
    //       (this.searchRol ? manager.rol && manager.rol.toLowerCase().includes(this.searchRol.toLowerCase()) : true)
    //     );
    //     this.inactiveManagers.sort((a, b) => {
    //       if (a.id && b.id) {
    //         return a.id - b.id;
    //       }
    //       return 0;
    //     });

    //     console.log("Mostrando a todos los managers: ", managers);
    //   },
    //   error => {
    //     console.error('Error al obtener los managers:', error);
    //     this.toastr.error('Error al obtener los managers. Por favor, inténtelo de nuevo.');
    //   }
    // );
  }

  // deleteManager(id: number): void {
  //   Swal.fire({
  //     title: '¿Estás seguro de eliminar este manager?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Sí, eliminar'
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       this.managerService.delete(id)
  //         .subscribe(() => {
  //           Swal.fire('Eliminado!', 'El manager ha sido eliminado.', 'success');
  //           this.listAll();
  //         }, error => {
  //           Swal.fire('Error', 'Error al eliminar el manager. Por favor, inténtelo de nuevo.', 'error');
  //           console.error('Error:', error);
  //         });
  //     }
  //   });
  // }

  // reactivateManager(id: number): void {
  //   Swal.fire({
  //     title: '¿Estás seguro de reactivar este manager?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, reactivar'
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       this.managerService.reactivate(id)
  //         .subscribe(() => {
  //           Swal.fire('Reactivado!', 'El manager ha sido reactivado.', 'success');
  //           this.listAll();
  //         }, error => {
  //           Swal.fire('Error', 'Error al reactivar el manager. Por favor, inténtelo de nuevo.', 'error');
  //           console.error('Error:', error);
  //         });
  //     }
  //   });
  // }

  // previousPage(): void {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //   }
  // }

  // nextPage(): void {
  //   const maxPageActive = Math.ceil(this.activeManagers.length / this.itemsPerPage);
  //   const maxPageInactive = Math.ceil(this.inactiveManagers.length / this.itemsPerPage);
  //   const maxPage = Math.max(maxPageActive, maxPageInactive);
  //   if (this.currentPage < maxPage) {
  //     this.currentPage++;
  //   }
  // }

  // toggleShowInactive(): void {
  //   this.showActiveManagers = !this.showActiveManagers;
  //   this.currentPage = 1; // Reinicia la página a la primera cuando se cambia de lista
  //   this.listAll(); // Obtén los managers activos o inactivos según el estado actual
  // }


  // formatDateOfBirth(date: Date | string | null | undefined): string {
  //   if (!date) {
  //     return ''; // o cualquier valor predeterminado que desees
  //   }
  
  //   const dateObject = typeof date === 'string' ? new Date(date) : date;
    
  //   // Definir los nombres de los meses en español abreviados
  //   const monthNames = [
  //     "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  //     "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  //   ];
  
  //   const day = dateObject.getUTCDate().toString().padStart(2, '0');
  //   const month = monthNames[dateObject.getUTCMonth()];
  //   const year = dateObject.getUTCFullYear();
  
  //   // Construir la fecha en el formato deseado (dd-Mmm-yyyy)
  //   const formattedDate = `${day}-${month}-${year}`;
  
  //   return formattedDate;
  // }  

  // exportToExcelActive(): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.activeManagers);
  //   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, 'RegistrosManagers');
  // }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  // }

  // exportToCSV(): void {
  //   const header = Object.keys(this.activeManagers[0]) as (keyof Manager)[]; // Obtener las claves como tipo keyof Manager
  //   const csvData = this.activeManagers.map((manager) => {
  //     return header.map((field) => {
  //       return manager[field]; // Acceder a las propiedades del objeto utilizando las claves extraídas
  //     });
  //   });

  //   csvData.unshift(header.map(String)); // Convertir las claves a cadena antes de insertarlas en el CSV
  //   const csv = csvData.map((row) => row.join(',')).join('\n');
  //   const blob = new Blob([csv], { type: 'text/csv' });
  //   saveAs(blob, 'RegistrosManagers.csv');
  // }

  // exportToPDF(): void {
  //   const doc = new jsPDF();
  //   // Agregar un título al PDF
  //   doc.text('Lista de Encargados', 10, 10);
  //   // Define las columnas de la tabla
  //   const columns = ['ID', 'Nombre', 'Apellido', 'Rol', 'Tipo de Documento', 'N° de Documento','N° de Celular' , 'Estado'];
  //   // Mapea los datos a un formato que jsPDF pueda usar
  //   const rows = this.activeManagers.map(manager => [
  //     manager.id,
  //     manager.firstname,
  //     manager.lastname,
  //     manager.rol,
  //     manager.documenttype,
  //     manager.documentnumber,
  //     manager.cellphone,
  //     manager.status
  //   ]);
  //   // Genera la tabla en el PDF
  //   (doc as any).autoTable({
  //     head: [columns],
  //     body: rows,
  //     startY: 20
  //   });
  //   // Guarda el PDF
  //   doc.save('RegistrosManagers.pdf');
  // }
  
}