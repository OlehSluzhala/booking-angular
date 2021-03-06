import { Component, OnInit, OnChanges} from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Role } from '../models/role';
import { UserService } from 'src/app/core/services/user.service';
import { User } from '../models/user-model';
import { DomSanitizer, SafeUrl  } from '@angular/platform-browser';
import { UserDataService } from 'src/app/core/services/user-data.service';
declare  var  require: any;
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})

export class NavigationBarComponent implements OnInit, OnChanges{
  defaultPhoto = require('../images/defaultPhoto.png');
  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private sanitizer: DomSanitizer,
              public dataService: UserDataService,
              ) {}
  user: User;
 ngOnChanges(){
  if(this.isLoggedIn)
  {
  this.userService.getUser(this.authService.getId()).subscribe(data => {this.dataService.user = data;
   });
  
  }
 }
  ngOnInit(){
    if(this.isLoggedIn)
    {
    this.userService.getUser(this.authService.getId()).subscribe(data => {this.dataService.user = data;
     });
    
    }
  }
   
  transform(): SafeUrl {
    if(this.dataService.user.photo) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,` + this.dataService.user.photo);
    }
    return this.defaultPhoto;
  }
  logout() {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  get userLogin(): string {
    return this.authService.getLogin();
  }

  get isAdmin(): boolean {
    return (this.authService.getRole() === 'Admin');
  }

  get isUser(): boolean {
    return (this.authService.getRole() === 'User');
  }
}