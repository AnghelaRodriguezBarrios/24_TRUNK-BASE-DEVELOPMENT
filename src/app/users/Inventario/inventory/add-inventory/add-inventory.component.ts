import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventory } from 'src/app/model/inventory';
import { InventoryService } from 'src/app/service/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent {

  inventoryForm: FormGroup;

  constructor(
    private invetoryService: InventoryService,
    private fb: FormBuilder,
    private router : Router
  ) { 
    this.inventoryForm = this.fb.group({
      area: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      modality: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      manager_id: ['', Validators.required]
    })
  }


  addInventory() { 
    if (this.inventoryForm?.valid) {
      const inventory: Inventory = this.inventoryForm.value;
      this.invetoryService.createInventory(inventory).subscribe(
        response => {
          console.log('Producto agregado', response);
          Swal.fire("Exito", "Se agrego correctamente", "success")
          this.router.navigate(['/Inventario']);
        }, error => {
          console.log("Error al agregar", error)
        }
      )
    } else { 
      Swal.fire('Error', 'Por favor verifique los campos', 'error');
    }
    
   
  }

}
