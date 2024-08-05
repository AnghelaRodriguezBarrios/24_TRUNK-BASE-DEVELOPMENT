import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApoderadoService } from 'src/app/service/Apoderado.service';
import { IApoderado } from 'src/app/model/IApoderado';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-Apoderados',
  templateUrl: './Apoderados.component.html',
  styleUrls: ['./Apoderados.component.css']
})
export class ApoderadoComponent implements OnInit, AfterViewInit {
validateEmail($event: Event) {
throw new Error('Method not implemented.');
}
  listApoderado: IApoderado[] = [];
  paginatedList: IApoderado[] = [];
  filteredList: IApoderado[] = [];
  formulario: FormGroup;
  formularioFiltrado: FormGroup;
  isUpdate: boolean = false;
  selectedApoderados: IApoderado | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  editForm: any;
apoderado: any;
p: any;

  constructor( private ApoderadoService: ApoderadoService, private toastr: ToastrService, private exportAsService: ExportAsService, private fb: FormBuilder, private renderer: Renderer2
  ) {
    this.buildFormEditar();

    this.formulario = this.fb.group({
      idStudent: [''],
      names: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
      surnames: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
      documentType: ['', [Validators.required,Validators.pattern('^(DNI|CE)$'),]],
      documentNumber: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^[0-9]+$'),]],
      sex: ['', Validators.required],
      birth_date: ['', Validators.required],
      baptism: ['', Validators.required],
      first_Communion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', Validators.required],
      confirmation: ['', Validators.required],
      marriage: ['', Validators.required],
      relationship: ['', Validators.required],
      address: ['', Validators.required],
    });

   

    this.formularioFiltrado = this.fb.group({
      nameFilter: [''],
      surnamesFilter: [''],
      documentTypeFilter: [''],
      documentNumberFilter: ['']
    });
  }

  ngOnInit(): void {
    this.listActives();
    this.formularioFiltrado.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterApoderado();
      });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
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

  listActives(): void {
    this.ApoderadoService.listar().subscribe(
      (data: any) => {
        this.listApoderado = data;
        this.filterApoderado();
      },
      error => {
        console.error('Error fetching active Apoderado', error);
      }
    );
  }

  listInactives(): void {
    this.ApoderadoService.listarInactivos().subscribe(
      (data: any) => {
        this.listApoderado = data;
        this.filterApoderado();
      },
      error => {
        console.error('Error fetching inactive Apoderado', error);
      }
    );
  }

  filterApoderado(): void {
    const { nameFilter, surnamesFilter, documentTypeFilter, documentNumberFilter } = this.formularioFiltrado.value;
    this.filteredList = this.listApoderado.filter(apoderado =>
      (!nameFilter || apoderado.names.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!surnamesFilter || apoderado.surnames.toLowerCase().includes(surnamesFilter.toLowerCase())) &&
      (!documentTypeFilter || apoderado.documentType === documentTypeFilter) &&
      (!documentNumberFilter || apoderado.documentNumber.includes(documentNumberFilter))
    );
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  buildFormEditar() {
    this.editForm = this.fb.group({
      id: new FormControl('', [Validators.required]),
      names: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      surnames: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      sex: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      baptism: new FormControl('', [Validators.required, Validators.pattern('9[0-9]{8}')]),
      first_Communion: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      confirmation: new FormControl('', [Validators.required]),
      marriage: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellphone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]),
      address: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      documentNumber: new FormControl('', [Validators.required, Validators.maxLength(8)]),
    });
  }

  updatePaginatedList(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredList.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  newApoderados(): void {
    this.isUpdate = false;
    this.selectedApoderados = null;
    this.formulario.reset({ status: 'A' }); // Ensure status is set to 'A' (Active) by default
  }

  selectApoderados(apoderados: IApoderado): void {
    this.isUpdate = true;
    this.selectedApoderados = apoderados;
    this.formulario.patchValue(apoderados);
  }

  insertApoderados(): void {
    if (this.formulario.invalid) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }
    const ApoderadotData: IApoderado = this.formulario.value;
    this.ApoderadoService.save(ApoderadotData).subscribe(
      res => {
        this.listActives();
        this.toastr.success('Apoderado agregado con éxito', 'Éxito');
        this.formulario.reset({ status: 'A' }); // Reset the form after successful insertion
        document.getElementById('ModalApoderados')?.click(); // Close the modal programmatically
      },
      error => {
        console.error('Error adding student', error);
        this.toastr.error('Error al agregar el Apoderado', 'Error');
      }
    );
  }

  updateApoderados(): void {
    if (this.formulario.invalid || !this.selectedApoderados) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const apoderadoData: IApoderado = this.formulario.value;
    apoderadoData.id = this.selectedApoderados.id;

    this.ApoderadoService.editar(this.selectedApoderados.id.toString(), apoderadoData).subscribe(
      res => {
        this.listActives();
        document.getElementById('ModalApoderados')?.click(); // Close the modal programmatically
        this.toastr.success(' actualizado con éxito', 'Éxito');
        this.formulario.reset({ status: 'A' }); // Reset the form after successful update

      },
      error => {
        console.error('Error updating Apoderado', error);
        this.toastr.error('Error al actualizar al Apoderado', 'Error');
      }
    );
  }

  modificar(apoderado: any) {
    console.log('EDITAR .....')
    console.log(apoderado)
    // Asumiendo que apoderado contiene un campo id
    const id = apoderado.id;
    // Pasa el id y el objeto apoderado como argumentos
    this.ApoderadoService.editar(id, apoderado).subscribe(_data => {
      Swal.fire({
        title: 'Modificado',
        text: '¡Se ha modificado!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.listActives();
          this.buildFormEditar();
        }
      });
    },
    _error => {
      Swal.fire({
        title: 'Error',
        text: 'ERROR: No se pudo editar',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
}

  deleteApoderado(id: any): void {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar este Apoderado?',
      text: '¡Una vez eliminado ya no aparecerá en la lista!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar Apoderado',
    }).then(result => {
      if (result.isConfirmed) {
        this.ApoderadoService.eliminar(id).subscribe(
          res => {
            this.listActives();
            this.toastr.success('Apoderado eliminado con éxito', 'Éxito');
          },
          error => {
            console.error('Error deleting Apoderado', error);
            this.toastr.error('Error al eliminar el Apoderado', 'Error');
          }
        );
      } else {
        this.toastr.warning('Apoderado no será eliminado', 'Cancelado');
      }
    });
  }

  reactivateApoderado(id: any): void {
    Swal.fire({
      title: '¿Estás seguro que quieres reactivar este Apoderado?',
      text: '¡Puedes reactivar a este Apoderado!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar Apoderado',
    }).then(result => {
      if (result.isConfirmed) {
        this.ApoderadoService.activar(id).subscribe(
          res => {
            this.listInactives();
            this.toastr.success('Apoderado reactivado con éxito', 'Éxito');
          },
          error => {
            console.error('Error reactivating Apoderado', error);
            this.toastr.error('Error al reactivar el Apoderado', 'Error');
          }
        );
      } else {
        this.toastr.warning('Apoderado no será reactivado', 'Cancelado');
      }
    });
  }

confirmDelete(): void {
    if (this.selectedApoderados) {
        this.deleteApoderado(this.selectedApoderados.id.toString()); // Convert the id to a string
    }
}

confirmReactive(): void {
    if (this.selectedApoderados) {
        this.reactivateApoderado(this.selectedApoderados.id.toString()); // Convert the id to a string
    }
}

  exportToPdf(): void {
    Swal.fire({
      title: 'Exportar informe',
      text: '¿Deseas exportar este informe de Apoderado?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (!this.filteredList || this.filteredList.length === 0) {
          console.error('No hay datos de Apoderado disponibles.');
          return;
        }

        const doc = new jsPDF('landscape');

        doc.setFillColor(255, 165, 0);
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

        const logoLeft = 'assets/logo.png';
        doc.addImage(logoLeft, 'PNG', 20, 10, 40, 40);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        const title = 'Listado de Apoderados';
        const titleWidth = doc.getStringUnitWidth(title) * 20;
        const middleOfPage = doc.internal.pageSize.width / 2;
        const titleX = middleOfPage - titleWidth / 2 + 70;
        const titleY = 30;
        doc.text(title, titleX, titleY);

        const logoRight = 'assets/logo.png';
        const logoRightWidth = 40;
        const logoRightHeight = 40;
        const logoRightX = doc.internal.pageSize.width - logoRightWidth - 20;
        const logoRightY = 10;
        doc.addImage(logoRight, 'PNG', logoRightX, logoRightY, logoRightWidth, logoRightHeight);

        const columns = [
          'NOMBRES',
          'APELLIDOS',
          'TIPO DE DOCUMENTO',
          'N° DE DOCUMENTO',
          'SEXO',
          'FECHA DE NACIMIENTO',
          'BAUTIZO',
          'COMUNIÓN',
          'EMAIL',
          'CONFIRMACIÓN',
          'MATRIMONIO',
          'RELACIÓN',
          'CELULAR',
          'DIRECCIÓN',
        ];

        const separationSpace = 40;
        const startY = titleY + separationSpace;

        autoTable(doc, {
          head: [columns],
          body: this.filteredList.map(item => [
            item.names,
            item.surnames,
            item.documentType,
            item.documentNumber,
            item.sex,
            item.birth_date,
            item.baptism,
            item.first_Communion,
            item.email,
            item.confirmation,
            item.marriage,
            item.relationship,
            item.cellphone,
            item.address
          ]),
          startY: startY,
          tableWidth: 'auto',
          styles: {
            textColor: [0, 0, 0],
            fontSize: 10,
          },
          headStyles: {
            fillColor: [255, 165, 0],
            textColor: [255, 255, 255],
          },
        });

        doc.save('Apoderados.pdf');

        Swal.fire({
          icon: 'success',
          title: '¡Informe exportado!',
          text: 'El informe de Apoderado se ha exportado exitosamente.',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a PDF cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Exportar a Excel',
      text: '¿Deseas exportar la lista de Apoderado a un archivo Excel?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'xlsx',
          elementIdOrContent: 'k', // Cambiado de 'Apoderado' a 'k'
          options: {
            orientation: 'landscape',
          }
        };
  
        const fileName = 'Apoderado';
  
        this.exportAsService.save(exportConfig, fileName).subscribe(response => {
          console.log(response);
          this.toastr.success('Archivo Excel generado exitosamente', 'Éxito', {
            timeOut: 1500,
            positionClass: 'toast-top-right',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a Excel cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  exportToCSV(): void {
    Swal.fire({
      title: 'Exportar a CSV',
      text: '¿Deseas exportar la lista de Apoderado a un archivo CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'csv',
          elementIdOrContent: 'k',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'Apoderado';

        this.exportAsService.save(exportConfig, fileName).subscribe(response => {
          console.log(response);
          this.toastr.success('Archivo CSV generado exitosamente', 'Éxito', {
            timeOut: 1500,
            positionClass: 'toast-top-right',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.info('Exportación a CSV cancelada', 'Cancelado', {
          timeOut: 1500,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  checkFormControlCss(controlName: string): { [key: string]: boolean } {
    const control = this.formulario.get(controlName);
    return {
      'is-invalid': !!control?.invalid && (control?.dirty || control?.touched),
      'is-valid': !!control?.valid
    };
  }

  convertToUpperCase(fieldName: string, event: any): void {
    const inputValue: string = event.target.value;
    this.formulario.get(fieldName)?.setValue(inputValue.toUpperCase(), { emitEvent: false });
  }
  viewStudent(Apoderados: IApoderado): void {
    this.selectedApoderados = Apoderados;
  }

  validateDocumentNumber(): void {
    const documentTypeControl = this.formulario.get('documentType');
    const documentNumberControl = this.formulario.get('documentNumber');

    if (!documentTypeControl || !documentNumberControl) {
      console.error('documentType or documentNumber control not found');
      return;
    }

    if (documentTypeControl.value === 'DNI') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$'),
      ]);
    } else if (documentTypeControl.value === 'CE') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]+$'),
      ]);
    }

    documentNumberControl.updateValueAndValidity();
  }

}