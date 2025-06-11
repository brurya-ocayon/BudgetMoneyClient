
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // הופך את השירות לגלובלי
})
export class UserService {
  private userId = new BehaviorSubject<number | null>(null); // משתנה לאחסון ה-ID
  currentUserId = this.userId.asObservable(); // משתנה שניתן להירשם אליו כדי לצפות בשינויים

  
  constructor() {
    const storedUserId = localStorage.getItem('selectedUserId');
    if (storedUserId) {
      this.userId.next(+storedUserId);
    }
  }

  // פונקציה להגדרת ה-ID
  setUserId(id: number): void {
    console.log(id);
    this.userId.next(id);
   localStorage.setItem('selectedUserId', id.toString()); // שמירה ב-localStorage
  }

  // פונקציה לאיפוס ה-ID (למשל ביציאה מהמערכת)
  clearUserId(): void {
    this.userId.next(null);

  }
}
