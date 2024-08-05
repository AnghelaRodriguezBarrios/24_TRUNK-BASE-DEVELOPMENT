import { Inventory } from 'src/app/model/inventory';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'src/app/service/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {

  inventoryForm: FormGroup;
  inventoryId:  string | null = this.route.snapshot.paramMap.get('id');
  
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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

  ngOnInit(): void {
    // Obtén la ID del inventario de la ruta
    const inventoryId = this.route.snapshot.paramMap.get('id');
    
    
    if (inventoryId) {
      // Obtén los datos del inventario del servicio
      this.inventoryService.getInventoryById(inventoryId).subscribe(inventory => {
        // Actualiza el formulario con los datos del inventario
        this.inventoryForm.patchValue({
          area: inventory.area,
          code: inventory.code,
          description: inventory.description,
          amount: inventory.amount,
          modality: inventory.modality,
          date: inventory.date,
          status: inventory.status,
          manager_id: inventory.manager_id
        });
      });
    }
  }

  updateInventory() { 
    if (this.inventoryForm.valid && this.inventoryId) {
      const updateInventory = this.inventoryForm.value;
      console.log(updateInventory)
      this.inventoryService.updateInventory(this.inventoryId, updateInventory).subscribe(
        response => {
          // Maneja la respuesta exitosa, por ejemplo, redirigir a la lista de inventarios
          this.router.navigate(['/Inventario']);
          Swal.fire(`Exito`, "Actualizado correctamente", "success")
        },
        error => {
          // Maneja el error
          console.error('Error actualizando inventario:', error);
        }
      );
    } else { 
      console.log("errror")
    }
  }



}
