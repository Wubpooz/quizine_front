import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  showPassword = false;
  username = '';   // <-- bound to input
  password = '';   // <-- bound to input

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if(!this.username || !this.password){
      alert('Veuillez remplir tous les champs');
      console.log('Veuillez remplir tous les champs');
      return;
    }
    console.log('Username:', this.username);
    console.log('Password:', this.password);

  }
}
