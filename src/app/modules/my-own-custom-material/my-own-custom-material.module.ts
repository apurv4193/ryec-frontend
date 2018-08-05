import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  imports: [
    CommonModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  declarations: [],
  exports: [
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MyOwnCustomMaterialModule { }
