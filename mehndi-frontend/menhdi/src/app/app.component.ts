import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
declare var AOS: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  messages: { type: 'user' | 'bot', text: string }[] = [];
  inputMessage = '';
  showChat = false;
  loading = false;
  popup = { show: false, type: '', message: '' };
  form: any = { name: '', email: '', phone: '', service: '', date: '', message: '' };

  constructor(private http: HttpClient) {
    setTimeout(() => this.showChat = true, 500);
  }

  submitForm(event: Event, f: HTMLFormElement) {
    event.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    this.loading = true;
    const payload = { ...this.form, date: this.form.date ? this.formatDate(this.form.date) : '' };
    this.http.post('http://localhost:3000/send-booking', payload).subscribe({
      next: () => {
        f.reset();
        this.form.date = '';
        this.loading = false;
        this.popup = {
          show: true,
          type: 'success',
          message: '🎉 Booking Sent Successfully! Our team will review your request and get in touch with you shortly to confirm all the details and ensure you have a perfect mehdi experience for your special day. Thank you for choosing us! 🙌'
        };
      },
      error: () => {
        this.loading = false;
        this.popup = { show: true, type: 'error', message: 'Oops! Something went wrong 😢' };
      }
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;
    this.messages.push({ type: 'user', text: this.inputMessage });
    const prompt = `You are a virtual assistant for a Mehndi booking service. User message: "${this.inputMessage}"`;
    this.inputMessage = '';
    this.http.post<any>('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
      }
    }).subscribe(res => {
      const botReply = res.choices?.[0]?.message?.content || 'Sorry, I could not process that.';
      this.messages.push({ type: 'bot', text: botReply });
    });
  }

  closePopup() { this.popup.show = false; }

  ngOnInit() { AOS.init(); }
}