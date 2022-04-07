import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employees: Employee[] = [];
  editEmployee: Employee | undefined;
  deleteEmployee: Employee | undefined;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];

    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {

        results.push(employee);
      }
    }

    this.employees = results;

    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById("addEmployeeFormClose")!.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  public onEditEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onOpenModal(mode: string, employee?: Employee): void {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === "add") {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    else if (mode === "edit") {
      button.setAttribute('data-target', '#editEmployeeModal');
      this.editEmployee = employee;
    }
    else if (mode === "delete") {
      button.setAttribute('data-target', '#deleteEmployeeModal');
      this.deleteEmployee = employee;
    }

    const container = document.getElementById('main-container');
    container!.appendChild(button);
    button.click();
  }

}
