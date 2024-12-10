import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { HomeComponent } from '../home/home.component';
import { CurrPerfumeComponent } from './curr-perfume/curr-perfume.component';
import { AuthActivate } from '../core/guards/auth.guard';
import { EditComponent } from './edit/edit.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'perfume/create',
    component: CreateComponent,
    canActivate: [AuthActivate]
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: ':perfumeId/edit',
        component: EditComponent,
        canActivate: [AuthActivate]
      },
      {
        path: ':perfumeId',
        component: CurrPerfumeComponent
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfumesRoutingModule { }
