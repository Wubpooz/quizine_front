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
  @Input() style: "primary" | "secondary" | "warn" | "tertiary" | "border" | "error" | "text" = "primary";
  @Input() size: "small" | "medium" | "large" | "xlarge" | "xxlarge" = "medium";
  @Input() icon: string = ""; //TODO
  @Input() class: string = "";
  @Input() disabled: boolean = false; //TODO
  @Input() loading: boolean = false; //TODO
  @Input() fullWidth: boolean = false;
  @Input() shape: "circle" | "rectangle" = "rectangle";
  @Input() bold: "bold" | "semibold" | "medium" | "normal" | "thin" | "extralight" | "light" = "normal";
  @Input() onClick: () => void = () => { console.log("Button clicked!"); };
}
