import { Component, OnInit } from '@angular/core';
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

export class StudentComponent implements OnInit {
  studentList: StudentModel[] = [];
  paginatedList: StudentModel[] = [];
  filteredList: StudentModel[] = [];
  formulario: FormGroup;
  selectedStudent: StudentModel | null = null;
  modalAdd: boolean = false;
  modalUpdate: boolean = false;
  searchTerm: string = '';
  modalViewStudent: boolean = false;
  filterDocument: boolean = false;
  isUpdate = false;
  documentFilter: string = '';
  levelFilter: string = '';
  filterlevel: boolean = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;
  
  currentStep: number = 1;

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder
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
      documentType: ['', Validators.required],
      documentNumber: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]+$')
      ]],
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
      birthPlace: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      level: ['', Validators.required],
      grade: ['', Validators.required],
      section: ['', Validators.required],
      status: ['A', Validators.required] // Default status to 'A' (Active)
    });
  }
  
  ngOnInit(): void {
    this.listActives();
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
    this.currentStep = 1; // Start at the first step
    this.modalAdd = true;
  }
  

  selectStudent(student: StudentModel): void {
    this.isUpdate = true;
    this.selectedStudent = student;
    this.formulario.patchValue(student);
    this.modalUpdate = true;
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
        this.currentStep = 1; // Reset to the first step
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
        this.currentStep = 1; // Reset to the first step
        this.closeModal(); // Close the modal programmatically
      },
      error => {
        console.error('Error updating student', error);
        this.toastr.error('Error al actualizar el estudiante', 'Error');
      }
    );
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

  closeModal(): void {
    this.modalAdd = false;
    this.modalUpdate = false;
    this.currentStep = 1; // Reset to the first step when closing
  }
  

  viewStudent(student: StudentModel): void {
    this.selectedStudent = student;
    this.modalViewStudent = true;
  }

  closeModalView(): void {
    this.modalViewStudent = false;
  }

  openFilter(): void {
    this.filterDocument = !this.filterDocument;
  }
  
  openFilterlevel(): void {
    this.filterlevel = !this.filterlevel;
  }  

  filterByDocumentType(type: string): void {
    this.documentFilter = type;
    this.filterStudents();
    this.filterDocument = false; // Cierra el dropdown después de seleccionar
  }
  
  filterByLevel(level: string): void {
    this.levelFilter = level;
    this.filterStudents();
    this.filterlevel = false; // Cierra el dropdown después de seleccionar
  }
  
  filterStudents(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
  
    this.filteredList = this.studentList.filter(student => {
      const studentName = student.name ? student.name.toLowerCase() : '';
      const studentLastName = student.lastName ? student.lastName.toLowerCase() : '';
      const studentFullName = `${studentName} ${studentLastName}`;
      const studentDocumentNumber = student.documentNumber ? student.documentNumber.toLowerCase() : '';
      const studentGender = student.gender ? student.gender.toLowerCase() : '';
      const studentSection = student.section ? student.section.toLowerCase() : '';
      const studentBaptism = student.baptism ? student.baptism.toLowerCase() : '';
      const studentCommunion = student.communion ? student.communion.toLowerCase() : '';
      const studentLevel = student.level ? student.level.toLowerCase() : '';
      const studentDocumentType = student.documentType ? student.documentType.toLowerCase() : '';
  
      const matchesSearchTerm = (
        studentName.includes(searchTermLower) ||
        studentLastName.includes(searchTermLower) ||
        studentFullName.includes(searchTermLower) ||
        studentDocumentNumber.includes(searchTermLower) ||
        studentGender.includes(searchTermLower) ||
        studentSection.includes(searchTermLower) ||
        studentBaptism.includes(searchTermLower) ||
        studentCommunion.includes(searchTermLower)
      );
  
      const matchesDocumentFilter = this.documentFilter === 'DNI-CE' 
        ? ['dni', 'ce'].includes(studentDocumentType)
        : studentDocumentType.includes(this.documentFilter.toLowerCase());
  
      const matchesLevelFilter = this.levelFilter === 'Inicial-Primaria'
        ? ['inicial', 'primaria'].includes(studentLevel)
        : studentLevel.includes(this.levelFilter.toLowerCase());
  
      return matchesSearchTerm && matchesDocumentFilter && matchesLevelFilter;
    });
  
    this.currentPage = 1;
    this.updatePaginatedList();
  }
  
  nextStep() {
    // Comprueba la validez de los campos en el paso actual
    const stepValid = this.isStepValid(this.currentStep);
    if (stepValid) {
      this.currentStep++;
    } else {
      this.toastr.error('Por favor, complete todos los campos requeridos correctamente antes de continuar.', 'Error');
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        // Verifica si todos los campos del paso 1 son válidos
        return (
          this.formulario.get('name')?.valid &&
          this.formulario.get('lastName')?.valid &&
          this.formulario.get('documentType')?.valid &&
          this.formulario.get('documentNumber')?.valid
        ) ?? false;
        
      case 2:
        // Verifica si todos los campos del paso 2 son válidos
        return (
          this.formulario.get('gender')?.valid &&
          this.formulario.get('birthDate')?.valid &&
          this.formulario.get('email')?.valid &&
          this.formulario.get('baptism')?.valid 
        ) ?? false;
        
      case 3:
        // Verifica si todos los campos del paso 3 son válidos
        return (
          this.formulario.get('communion')?.valid &&
          this.formulario.get('birthPlace')?.valid &&
          this.formulario.get('level')?.valid &&
          this.formulario.get('grade')?.valid &&
          this.formulario.get('section')?.valid
        ) ?? false;
  
      default:
        return false;
    }
  }
}
