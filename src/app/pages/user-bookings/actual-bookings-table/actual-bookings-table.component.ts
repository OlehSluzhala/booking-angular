import { Component, OnInit, ViewChild, Input} from '@angular/core';
import {Booking} from '../../../shared/models/booking.model';
import {BookingService} from '../../../core/services/booking.service';
import {Subject, from} from 'rxjs';
import {filter} from 'rxjs/operators';
import { MatDialog, MatDialogRef, MatTable, MatTableDataSource,  MatPaginator, MatSort} from '@angular/material';
import {sleep} from 'sleep-ts';


declare  var  require: any;
@Component({
  selector: 'app-actual-bookings-table',
  templateUrl: './actual-bookings-table.component.html',
  styleUrls: ['./actual-bookings-table.component.sass']
})
export class ActualBookingsTableComponent implements OnInit {
  imgCancel = require('../../../shared/images/cancel.png');
  imgApproved = require('../../../shared/images/approved.png');
  imgDeclined = require('../../../shared/images/declined.png');
  imgTrash = require('../../../shared/images/trash.png');
  dataSource = new MatTableDataSource<Booking>([]);
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator,  {static: false}) set matPaginator(paginator: MatPaginator) {
  this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort, {static: false}) set MatSort(sort: MatSort){
    this.dataSource.sort = sort;
  }
  booking: Booking;
  userId:number = 1;
  @Input() isActual:boolean = false;
  hasBookings: boolean = false;
  bookingHeaders: string[];
  dtOptions: any = {};
  idToDelete: number;
  
  bookings: Booking[];
  filteredBookings: Booking[];
  constructor(private bookingService: BookingService,) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      retrieve: true,
      select: true,
    };
    this.getBookings();
  }

  getBookings()
  {
    this.bookingService.getUserBookings(this.userId, this.isActual).subscribe(res => {
      this.bookings = res;
      this.bookingHeaders = ['delete', 'id', 'bookingStart', 'bookingEnd', 'sectorId', 'isApproved'];
      this.updateDataSource();
      if(this.bookings.length ==0){this.hasBookings = false;}
     else{this.hasBookings = true;}
    console.log(this.hasBookings);
    });
  }
  updateDataSource() {  
    this.dataSource.data = this.bookings.reverse();
}
  saveIdToDelete(id: number){
    this.idToDelete = id;
    console.log(this.idToDelete);
  }
    async delete(){
    console.log(this.idToDelete);
    this.bookingService.deleteBooking(this.idToDelete).subscribe();
    await sleep(5000);
    this.getBookings();
  }
}