import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminManagementComponent} from './admin-management.component';
import {SettingComponent} from './setting/setting.component';


const routes: Routes = [
  {
    path: 'admin', component: AdminManagementComponent, children: [
      {
        path: 'settings', component: SettingComponent
      },


    ]
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
  CommonModule
  ],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule { }