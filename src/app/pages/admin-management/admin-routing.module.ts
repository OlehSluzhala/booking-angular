import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminManagementComponent} from './admin-management.component';
import {SettingComponent} from './setting/setting.component';
import {BookingManagingComponent} from './booking-managing/booking-managing.component';


const routes: Routes = [
  {
    path: 'admin', component: AdminManagementComponent, children: [
      {
        path: 'settings', component: SettingComponent
      },
      {
        path: 'bookings', component: BookingManagingComponent
      }
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
