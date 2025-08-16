import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  formSignupId = "form-signup";
  formSigninId = "form-signin"
  signInMode = true;
  showSignInPassword = false;
  showSignUpPassword = false;
  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  toggleSignInVisibility(): void {
    this.showSignInPassword = !this.showSignInPassword
  }

  toggleSignUpVisibility(): void {
    this.showSignUpPassword = !this.showSignUpPassword
  }

  signIn(): void {
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      this.authService.signin(username!, password!).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('Login failed. Please check your credentials.');
          }
        }
      );
    } else {
      alert('Please fill in all required fields for login.');
    }
  }

  signUp(): void {
    if (this.signUpForm.valid) {
      const { username, email, password } = this.signUpForm.value;
      this.authService.signup(username!!, email!!, password!!).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('Signup failed. Please try again.');
          }
        }
      );
    } else {
      alert('Please fill in all required fields for signup.');
    }
  }

  switch(): void {this.signInMode = !this.signInMode}

  handleClick(formId: string): void {
    if (formId == this.formSignupId) {
      this.signUp();
    } else if (formId == this.formSigninId) {
      this.signIn()
    }
  }

}
