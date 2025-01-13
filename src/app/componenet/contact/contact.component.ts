import { Component,NgZone, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Contact } from './contact';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { MatSnackBar } from '@angular/material/snack-bar';
/** Error when invalid control is dirty, touched, or submitted. */
export class NgLpErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  responseDialog: boolean;
  iserror: boolean;
  disableSubmit: boolean;
  responseMesssage: any;
  responseStyle:string;
   responseTitle:string;
   submitted:boolean;
  nameFormControl = new FormControl('', [Validators.required]);
  phoneFormControl = new FormControl('', [ Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
newCmmment={
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  operatorId: "ede90f84-3c4b-419a-2d71-08d8a67654fd",
  emailTo: "melkamu372@gmail.com"
}

  matcher = new NgLpErrorStateMatcher();
  contact = new Contact();
  contactForm: FormGroup;
  constructor(private _formBuilder: FormBuilder, private eziService: EziBusService, private _snackBar : MatSnackBar) { }

  ngOnInit() {

    this.contactForm  =this._formBuilder.group({
      name: ["",Validators.required],
      phone: ["",Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      comment: ["",Validators.required],
     });
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return; // Show the error message and stop the submission
    }
    this.newCmmment.name=this.contactForm.controls.name.value;
    this.newCmmment.phone=this.contactForm.controls.phone.value;
    this.newCmmment.email=this.contactForm.controls.email.value;
    this.newCmmment.message=this.contactForm.controls.comment.value; 
    this.eziService.ContactRegistration(this.newCmmment).subscribe(
      (res) => {
        this.iserror = false;
         this.responseDialog = true;
         this.responseMesssage="You Successfully Send Your Comment Thank You";
         this.showMessage(this.responseMesssage);
        this.submitted = false;
        this.contactForm.reset();
        },
      (error) => {
        this.iserror = true;
        this.responseTitle = 'Error!!!';
        this.responseDialog = true;
        this.responseMesssage = '';
        this.responseStyle = 'error';
        this.disableSubmit = false;
        for (const [key, value] of Object.entries(error)) {
          this.responseMesssage = this.responseMesssage + value;
        }
        this.submitted = false;
        this.showMessage(this.responseMesssage);
      }
    );
  }
  showMessage(message){
    this._snackBar.open(message,"OK");
  } 
    

}
