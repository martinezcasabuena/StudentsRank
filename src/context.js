/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */ 

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,loadTemplate} from './utils.js';

class Context {

  constructor() {
    this.students = [
        /*new Person("Paco", "Vañó", 5),
        new Person("Lucia", "Botella", 10),
        new Person("German", "Ojeda", 3),
        new Person("Salva", "Peris", 1),
        new Person("Oscar", "Carrion", 40)*/
    ]; 
    this.gradedTasks = [];
    this.getStudents();
    this.getTasks();
    
  }

  initContext(){
    var addTask = document.getElementById("addGradedTask");
    addTask.addEventListener("click", () => {
          this.addGradedTask();
    });

    var addStudent = document.getElementById("addStudent");
    addStudent.addEventListener("click",() => {
        this.addNewStudent();
    });

  }

  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });

        var studentsEl = document.getElementById("llistat");
   
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        let headerString="<tr><td colspan='3'></td>";
        this.gradedTasks.forEach(function(taskItem){            
            headerString+="<td>"+taskItem.name+"</td>";
        });
        studentsEl.innerHTML= headerString;
        this.students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
    /** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){        
       /* let taskName = prompt("Please enter your task name");
        let gtask = new GradedTask(taskName);
        this.gradedTasks.push(gtask);
        this.students.forEach(function(studentItem) {            
            studentItem.addGradedTask(gtask);
        });
        this.getRanking();*/


        var that=this;
        let callback = function (responeseText){
            let addTask = document.getElementById("saveTask");
            saveTask.addEventListener("click",() => {                                
                let taskName = document.getElementById("taskName").value;   
                console.log("sds");
             
                var newTask= new GradedTask(taskName);
                that.gradedTasks.push(newTask);
                that.students.forEach(function(studentItem) {            
                    studentItem.addGradedTask(newTask);
                });
                that.getRanking();

                localStorage.setItem("tasks", JSON.stringify(that.gradedTasks));
                
            });
        }
        loadTemplate("templates/formTask.html",callback); 
    }

    getStudents(){
        var that=this;
        var savedStudents = JSON.parse( localStorage.getItem('students'));
        console.log(savedStudents);
        
        for (var i in savedStudents) { //for each
            console.log(savedStudents[i])
            var student= new Person(savedStudents[i].name,savedStudents[i].surname,savedStudents[i].points);
            this.students.push(student);
        }
    }

    getTasks(){
        var that=this;
        var savedTasks = JSON.parse( localStorage.getItem('tasks'));
        console.log(savedTasks);
        
    }

    addNewStudent(){
        var that=this;
        let callback = function (responeseText){
            let saveStudent = document.getElementById("saveStudent");
            saveStudent.addEventListener("click",() => {                                
                let studentName = document.getElementById("studentName").value;                            
                let studentLastName = document.getElementById("studentLastName").value;

                var newStudent= new Person(studentName,studentLastName, 0);
                that.students.push(newStudent);
                localStorage.setItem("students", JSON.stringify(that.students));
                
            });
        }
        loadTemplate("templates/formUser.html",callback);        
    }
    
}

export let context = new Context();