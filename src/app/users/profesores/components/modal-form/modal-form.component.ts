import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { TeacherService } from 'src/app/service/teacher.service';
import { Teacher } from 'src/app/models/clases/teacher';

// Función de validación personalizada para la fecha de nacimiento
function minimumAgeValidator(minAge: number) {
  return (control: AbstractControl) => {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { minimumAge: true };
  };
}

// Función de validación personalizada para la fecha de contratación
function maxDateValidator(maxDate: Date) {
  return (control: AbstractControl) => {
    const inputDate = new Date(control.value);
    return inputDate <= maxDate ? null : { maxDate: true };
  };
}

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit {
  teachers: Teacher[] = [];
  teacherForm: FormGroup;

  constructor(
    private modalSS: TeacherService,
    private fb: FormBuilder
  ) {
    const today = new Date(); 

    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      dateBirth: ['', [Validators.required, minimumAgeValidator(3)]],
      email: ['', [Validators.email]],
      cellPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      gender: ['', Validators.required],
      dateHire: ['', [Validators.required, maxDateValidator(today)]]
    });

    // Validación dinámica del número de documento basada en el tipo de documento
    this.teacherForm.get('documentType')?.valueChanges.subscribe(value => {
      const documentNumberControl = this.teacherForm.get('documentNumber');
      if (value === 'DNI') {
        documentNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
      } else if (value === 'CNE') {
        documentNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
      }
      documentNumberControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  addTeacher() {
    if (this.teacherForm?.valid) {
      const teacher: Teacher = this.teacherForm.value;
      this.modalSS.addTeacher(teacher).subscribe(
        response => {
          console.log('Profesor agregado', response);
          this.closeModal();
          console.log(teacher);
          Swal.fire('Éxito', 'Todo salio correctamente', 'success');
        },
        error => {
          console.error('Error al agregar profesor', error);
        }
      );
    }
  }

  loadTeachers() {
    this.modalSS.getTeachers().subscribe(
      teachers => {
        this.teachers = teachers;
      },
      error => {
        console.error('Error fetching teachers:', error);
      }
    );
  }

  closeModal() {
    this.modalSS.$modal.emit(false);
  }
}
