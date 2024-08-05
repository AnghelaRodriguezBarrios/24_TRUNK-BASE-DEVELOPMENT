import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/models/clases/teacher';
import { TeacherService } from 'src/app/service/teacher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-form-update',
  templateUrl: './modal-form-update.component.html',
  styleUrls: ['./modal-form-update.component.css']
})
export class ModalFormUpdateComponent implements OnInit {
  @Input() teacher: Teacher | null = null;
  updateForm: FormGroup;
  @Output() teacherUpdated = new EventEmitter<Teacher>();
  teachers: Teacher[] = [];

  constructor(private modalSS: TeacherService, private fb: FormBuilder) { 
     this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
       lastName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      dateBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
       cellPhone: ['', Validators.required],
      gender: ['', Validators.required],
      dateHire: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.populateForm();
     this.loadTeachers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teacher'] && this.teacher) {
      this.populateForm();
    }
  }

  populateForm() {
    if (this.teacher) {
      this.updateForm.patchValue({
        firstName: this.teacher.firstName,
        lastName: this.teacher.lastName,
        documentType: this.teacher.documentType,
        documentNumber: this.teacher.documentNumber,
        dateBirth: this.teacher.dateBirth,
        email: this.teacher.email,
        cellPhone: this.teacher.cellPhone,
        gender: this.teacher.gender,
        dateHire: this.teacher.dateHire
      });
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

  updateTeacher() { 
    if (this.updateForm.valid && this.teacher) {
      const updatedTeacher = { ...this.teacher, ...this.updateForm.value };
      this.modalSS.updateTeacher(this.teacher.id!, updatedTeacher).subscribe(
        response => {
          console.log('Teacher updated successfully:', response);
          this.teacherUpdated.emit(response); 
          Swal.fire('Éxito', 'Actualizado correctamente', 'success');
          this.closeModal();
        },
        error => {
          console.error('Error updating teacher:', error);
        }
      );
    }
  }

  closeModal() { 
    this.modalSS.$modal2.emit(false)
  }
}
