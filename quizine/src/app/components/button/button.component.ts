import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = "";
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() color: "primary" | "secondary" | "danger" = "primary";
  @Input() size: "small" | "medium" | "large" = "medium";
  @Input() icon: string = "";
  @Input() class: string = "";
}
