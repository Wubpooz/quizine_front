import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryQuizCardComponent } from './library-quiz-card.component';

describe('LibraryQuizCardComponent', () => {
  let component: LibraryQuizCardComponent;
  let fixture: ComponentFixture<LibraryQuizCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryQuizCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibraryQuizCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
