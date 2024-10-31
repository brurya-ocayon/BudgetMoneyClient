import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/types/task';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IdName, IdNameDB } from 'src/app/types/id-name';
import { GResult, Result } from 'src/app/types/result';
import { AlertService } from 'src/app/modules/infra/services/alert.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  root: string = environment.rootUrl;
  newTask: Task = new Task();
  addMode: boolean = false;
  typeDB: IdNameDB = new IdNameDB();
  status: IdName[] = new Array<IdName>();
  urgency: IdName[] = new Array<IdName>();
  tasks: Task[] = new Array<Task>();
  inEdit:boolean=false;
  constructor(private http: HttpClient, private alert: AlertService) { }

  ngOnInit(): void {
    this.getTasks();
    this.getStatus();
    this.getUrgency();
  }
  addTask() {
    this.http.post(this.root + 'Task/AddTask', this.newTask).subscribe((res: Result) => {
      this.alert.success("החוב נוסף בהצלחה!")
      this.newTask = new Task();
      this.addMode = false;
      this.getTasks();
    });
  }
  getTasks() {
    this.http.get(this.root + 'Task/GetTasks').subscribe((res: GResult<Task[]>) => {
      this.tasks = res.value;
    });
  }
  changeMode() {
    this.addMode = !this.addMode
    this.newTask=new Task();
  }
  getStatus() {
    this.typeDB.tableCode = 5;
    this.typeDB.type = 5;
    this.http.post(this.root + "List/GetList", this.typeDB).subscribe((res: GResult<IdName[]>) => {
      this.status = res.value;
    })
  }
  getUrgency() {
    this.typeDB.tableCode = 4;
    this.typeDB.type = 4;
    this.http.post(this.root + "List/GetList", this.typeDB).subscribe((res: GResult<IdName[]>) => {
      this.urgency = res.value;
    })
  }
editTask(task:Task)
{ 
   this.inEdit=!this.inEdit;
  task.inEdit=!task.inEdit;
}
  save(task:Task)
  {
    task.inEdit=false;
    this.http.put(this.root + 'Task/UpdateTask', task).subscribe((res:Result)=>{
      if(res.success)
      {
        this.alert.success("המשימה עודכנה בהצלחה!")
      }
      else
      {
        this.alert.error("העדכון נכשל!")
      }
      this.getTasks();
    });
   }
   cancel(task:Task)
   {
     task.inEdit=false;
     this.getTasks();
   }

}
