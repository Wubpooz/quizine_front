import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() label: string = "";
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() style: "primary" | "secondary" | "warn" | "tertiary" = "primary";
  @Input() size: "small" | "medium" | "large" | "xxlarge" = "medium";
  @Input() icon: string = "";
  @Input() class: string = "";
}
