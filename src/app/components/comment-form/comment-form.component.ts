import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommentService} from '../../core/services/comment.service';

@Component({
  selector: 'app-comment-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './comment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormComponent {
  @Input({required: true}) offerId!: string | null;
  @Output() commentAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);

  public commentForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(56), Validators.maxLength(350)]],
    rating: ['', Validators.required],
  });

  public onSubmit() {
    if (this.offerId && this.commentForm.valid) {
      const {comment, rating} = this.commentForm.value;
      const newComment = {comment, rating: Number(rating)};
      this.commentService.postComment(this.offerId, newComment).subscribe(() => this.commentAdded.emit());
    }
  }
}
