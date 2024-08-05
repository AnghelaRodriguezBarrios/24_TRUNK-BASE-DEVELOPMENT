import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { StudentService } from 'src/app/service/student.service';
import { StudentModel } from 'src/app/model/student-model';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var bootstrap: any;

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})

export class StudentComponent implements OnInit, AfterViewInit {
  studentList: StudentModel[] = [];
  paginatedList: StudentModel[] = [];
  filteredList: StudentModel[] = [];
  formulario: FormGroup;
  formularioFiltrado: FormGroup;
  isUpdate: boolean = false;
  selectedStudent: StudentModel | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.formulario = this.fb.group({
      idStudent: [''],
      name: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        (control: AbstractControl) => {
          return /\d/.test(control.value) ? { 'noNumbers': true } : null;
        }
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        (control: AbstractControl) => {
          return /\d/.test(control.value) ? { 'noNumbers': true } : null;
        }
      ]],
      documentType: ['', [
        Validators.required,
        Validators.pattern('^(DNI|CE)$'),
      ]],
      documentNumber: ['', [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern('^[0-9]+$'),]],
      gender: ['', Validators.required],
      birthDate: ['', [
        Validators.required,
        (control: AbstractControl) => {
          if (control.value) {
            const birthDate = new Date(control.value);
            const birthYear = birthDate.getFullYear();
            if (birthYear < 2010 || birthYear > 2030) {
              return { 'invalidYear': true };
            }
          }
          return null;
        }
      ]],
      baptism: ['', Validators.required],
      communion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthPlace: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      level: ['', Validators.required],
      grade: ['', Validators.required],
      section: ['', Validators.required],
      status: ['A', Validators.required] // Default status to 'A' (Active)
    });

    this.formularioFiltrado = this.fb.group({
      nameOrLastNameFilter: [''],
      levelFilter: [''],
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
        this.filterStudents();
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
    this.studentService.fetchActiveStudents().subscribe(
      (data: StudentModel[]) => {
        this.studentList = data;
        this.filterStudents();
      },
      error => {
        console.error('Error fetching active students', error);
      }
    );
  }

  listInactives(): void {
    this.studentService.fetchInactiveStudents().subscribe(
      (data: StudentModel[]) => {
        this.studentList = data;
        this.filterStudents();
      },
      error => {
        console.error('Error fetching inactive students', error);
      }
    );
  }

  filterStudents(): void {
    const { nameOrLastNameFilter, documentTypeFilter, documentNumberFilter, levelUniversalFilter } = this.formularioFiltrado.value;

    const nameKeywords: string[] = nameOrLastNameFilter ? nameOrLastNameFilter.toLowerCase().split(' ') : [];
    const levelKeywords: string[] = levelUniversalFilter ? levelUniversalFilter.toLowerCase().split(' ') : [];

    console.log('nameKeywords:', nameKeywords);
    console.log('levelKeywords:', levelKeywords);

    this.filteredList = this.studentList.filter(student => {
        const studentName = student.name ? student.name.toLowerCase() : '';
        const studentLastName = student.lastName ? student.lastName.toLowerCase() : '';
        const fullName = `${studentName} ${studentLastName}`;
        const studentLevel = student.level ? student.level.toLowerCase() : '';
        const studentGrade = student.grade ? student.grade.toLowerCase() : '';
        const studentSection = student.section ? student.section.toLowerCase() : '';

        console.log('studentLevel:', studentLevel);
        console.log('studentGrade:', studentGrade);
        console.log('studentSection:', studentSection);

        const nameMatches = nameKeywords.every((keyword: string) =>
            studentName.includes(keyword) ||
            studentLastName.includes(keyword) ||
            fullName.includes(keyword)
        );

        const levelMatches = levelKeywords.every((keyword: string) =>
            studentLevel.includes(keyword) ||
            studentGrade.includes(keyword) ||
            studentSection.includes(keyword)
        );

        console.log('Checking student:', student);
        console.log('nameMatches:', nameMatches);
        console.log('levelMatches:', levelMatches);

        return (
            (!nameOrLastNameFilter || nameMatches) &&
            (!documentTypeFilter || student.documentType === documentTypeFilter) &&
            (!documentNumberFilter || student.documentNumber.includes(documentNumberFilter)) &&
            (!levelUniversalFilter || levelMatches)
        );
    });

    this.currentPage = 1;
    this.updatePaginatedList();
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

  newStudent(): void {
    this.isUpdate = false;
    this.selectedStudent = null;
    this.formulario.reset({ status: 'A' }); // Ensure status is set to 'A' (Active) by default
  }

  selectStudent(student: StudentModel): void {
    this.isUpdate = true;
    this.selectedStudent = student;
    this.formulario.patchValue(student);
  }

  insertStudent(): void {
    if (this.formulario.invalid) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const studentData: StudentModel = this.formulario.value;
    this.studentService.createStudent(studentData).subscribe(
      res => {
        this.listActives();
        this.toastr.success('Estudiante agregado con éxito', 'Éxito');
        this.formulario.reset({ status: 'A' }); // Reset the form after successful insertion
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error adding student', error);
        this.toastr.error('Error al agregar el estudiante', 'Error');
      }
    );
  }

  updateStudent(): void {
    if (this.formulario.invalid || !this.selectedStudent) {
      this.toastr.error('Por favor, rellene todos los campos requeridos correctamente.', 'Error');
      return;
    }

    const studentData: StudentModel = this.formulario.value;
    this.studentService.updateStudent(this.selectedStudent.idStudent, studentData).subscribe(
      res => {
        this.listActives();
        this.toastr.success('Estudiante actualizado con éxito', 'Éxito');
        this.formulario.reset({ status: 'A' }); // Reset the form after successful update
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error updating student', error);
        this.toastr.error('Error al actualizar el estudiante', 'Error');
      }
    );
  }

  closeModal(): void {
    const modalElement = document.getElementById('ModalStudent');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  deleteStudent(id: string): void {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar este estudiante?',
      text: '¡Una vez eliminado ya no aparecerá en la lista!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar estudiante',
    }).then(result => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(id).subscribe(
          res => {
            this.listActives();
            this.toastr.success('Estudiante eliminado con éxito', 'Éxito');
          },
          error => {
            console.error('Error deleting student', error);
            this.toastr.error('Error al eliminar el estudiante', 'Error');
          }
        );
      } else {
        this.toastr.warning('Estudiante no será eliminado', 'Cancelado');
      }
    });
  }

  reactivateStudent(id: string): void {
    Swal.fire({
      title: '¿Estás seguro que quieres reactivar este estudiante?',
      text: '¡Puedes reactivar a este estudiante!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar estudiante',
    }).then(result => {
      if (result.isConfirmed) {
        this.studentService.reactivateStudent(id).subscribe(
          res => {
            this.listInactives();
            this.toastr.success('Estudiante reactivado con éxito', 'Éxito');
          },
          error => {
            console.error('Error reactivating student', error);
            this.toastr.error('Error al reactivar el estudiante', 'Error');
          }
        );
      } else {
        this.toastr.warning('Estudiante no será reactivado', 'Cancelado');
      }
    });
  }

  confirmDelete(): void {
    if (this.selectedStudent) {
      this.deleteStudent(this.selectedStudent.idStudent);
    }
  }

  confirmReactive(): void {
    if (this.selectedStudent) {
      this.reactivateStudent(this.selectedStudent.idStudent);
    }
  }

  exportToPdf(): void {
    Swal.fire({
      title: 'Exportar informe',
      text: '¿Deseas exportar este informe de Estudiantes?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (!this.filteredList || this.filteredList.length === 0) {
          console.error('No hay datos de estudiantes disponibles.');
          return;
        }

        const doc = new jsPDF('landscape');

        doc.setFillColor(255, 165, 0);
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

        const logoLeft = 'assets/logo.png';
        doc.addImage(logoLeft, 'PNG', 20, 10, 40, 40);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        const title = 'Listado de Estudiantes';
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
          'NOMBRE',
          'APELLIDO',
          'TIPO DE DOCUMENTO',
          'N° DE DOCUMENTO',
          'GÉNERO',
          'FECHA DE NACIMIENTO',
          'BAUTIZO',
          'COMUNIÓN',
          'EMAIL',
          'LUGAR DE NACIMIENTO',
          'NIVEL',
          'GRADO',
          'SECCIÓN'
        ];

        const separationSpace = 40;
        const startY = titleY + separationSpace;

        autoTable(doc, {
          head: [columns],
          body: this.filteredList.map(item => [
            item.name,
            item.lastName,
            item.documentType,
            item.documentNumber,
            item.gender,
            item.birthDate,
            item.baptism,
            item.communion,
            item.email,
            item.birthPlace,
            item.level,
            item.grade,
            item.section
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

        doc.save('Estudiantes.pdf');

        Swal.fire({
          icon: 'success',
          title: '¡Informe exportado!',
          text: 'El informe de Estudiantes se ha exportado exitosamente.',
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
      text: '¿Deseas exportar la lista de estudiantes a un archivo Excel?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar'
    }).then(result => {
      if (result.isConfirmed) {
        const exportConfig: ExportAsConfig = {
          type: 'xlsx',
          elementIdOrContent: 'student',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'student';

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
      text: '¿Deseas exportar la lista de estudiantes a un archivo CSV?',
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
          elementIdOrContent: 'student',
          options: {
            orientation: 'landscape',
          }
        };

        const fileName = 'student';

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
  viewStudent(student: StudentModel): void {
    this.selectedStudent = student;
  }

  validateDocumentNumber(): void {
    const documentTypeControl = this.formulario.get('documentType');
    const documentNumberControl = this.formulario.get('documentNumber');

    if (!documentTypeControl || !documentNumberControl) {
      console.error('documentType or documentNumber control not found');
      return;
    }

    documentNumberControl.clearValidators();

    if (documentTypeControl.value === 'DNI') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$'), // Asegura que solo números son permitidos
      ]);
    } else if (documentTypeControl.value === 'CE') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]+$'), // Asegura que solo números son permitidos
      ]);
    }

    documentNumberControl.updateValueAndValidity();
  }

  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode !== 8 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

}
