import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/app-email.directive';
import { LoaderComponent } from './loader/loader.component';
import { PassMatchValidatorDirective } from './validators/passMatch.validator.directive';
import { AppImageDirective } from './validators/app-imageUrl.directive';



@NgModule({
  declarations: [
    AppEmailDirective,
    LoaderComponent,
    PassMatchValidatorDirective,
    AppImageDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent, AppEmailDirective, PassMatchValidatorDirective, AppImageDirective]
})
export class SharedModule { }
