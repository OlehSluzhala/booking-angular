import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserEmail } from '../../shared/models/user-email-model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SignUpValidators } from './sign-up.validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  user: UserEmail;
  errorHandling = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.user = new UserEmail();
  }

  ngOnInit() {
    // @ts-ignore
    this.registerForm = this.formBuilder.group(
      {
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('[A-Za-zА-Яа-яЁёІіЇїЄє]{3,50}')
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('[A-Za-zА-Яа-яЁёІіЇїЄє]{3,50}')
        ]),
        number: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[0]{1}[0-9]{9}'),
          SignUpValidators.validatePhone
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          SignUpValidators.validateEmail
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          SignUpValidators.validatePassword
        ]),
        repeatPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
      },
      {
        validators: [
          SignUpValidators.validateName('firstName', 'lastName'),
          SignUpValidators.validatePasswords('password', 'repeatPassword')
        ]
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (this.errorHandling === true) {
      return;
    }
    console.log('succes');
  }

  checkNumber() {
    if (this.registerForm.get(['number']).value.length === 10) {
      this.userService
        .getUserByNumber(this.registerForm.get(['number']).value)
        .subscribe(
          res => {
              this.toastr.error(
                'A user with this number already exists!',
                'Error!'
              );
              this.errorHandling = true;
            },
      error => {
              this.errorHandling = false;
            }
        );
    }
  }

  checkEmail() {
    if (this.registerForm.controls.email.errors === null) {
      this.userService
        .getUserByEmail(this.registerForm.get(['email']).value)
        .subscribe(res => {
          this.toastr.error(
            'A user with this email already exists!',
            'Error!'
          );
            this.errorHandling = true;
        },
          error => {
            this.errorHandling = false;
          }
        );
    }
  }
}
