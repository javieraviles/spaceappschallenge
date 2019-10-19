import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading: Boolean;
  submitted: Boolean;
  signupEnabled: Boolean;
  submitButtonLabel: string;
  clearButtonLabel: string;
  returnUrl: string;

  constructor(public toastController: ToastController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public menuController: MenuController) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // at first, only login is shown, so name won't be required until signup is enabled
    this.loginForm.controls['name'].disable();

    this.loading = false;
    this.submitted = false;
    this.signupEnabled = false;
    this.submitButtonLabel = 'Log In';
    this.clearButtonLabel = 'Sign Up';

    // reset login status
    this.authService.signOut();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  swapSignup() {
    this.signupEnabled = !this.signupEnabled;
    if (this.signupEnabled) {
      this.submitButtonLabel = 'Sign Up';
      this.clearButtonLabel = 'Cancel';
      this.loginForm.controls['name'].enable();
    } else {
      this.submitButtonLabel = 'Log In';
      this.clearButtonLabel = 'Sign Up';
      this.loginForm.controls['name'].disable();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    if (this.signupEnabled) {

      this.loading = true;
      this.authService.emailSignUp(this.f.username.value, this.f.password.value, this.f.name.value).then(
        data => {
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        error => {
          this.presentToast(`An error happened trying to Sign in: ${error}`);
          this.loading = false;
        });

    } else {
      this.loading = true;
      this.authService.emailSignIn(this.f.username.value, this.f.password.value)
        .then(
          data => {
            this.router.navigate([this.returnUrl]);
            this.loading = false;
          },
          error => {
            this.presentToast(`An error happened trying to Sign in: ${error}`);
            this.loading = false;
          });
    }

  }
}