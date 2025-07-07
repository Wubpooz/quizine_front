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
  @Input() style: "primary" | "secondary" | "warn" | "tertiary" | "error" | "text" = "primary";
  @Input() size: "small" | "medium" | "large" | "xxlarge" = "medium";
  @Input() icon: string = "";
  @Input() class: string = "";
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() onClick: () => void = () => { console.log("Button clicked!"); };
}
