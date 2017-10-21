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
        var that=this;
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });

        /*var studentsEl = document.getElementById("llistat");
   
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
        });*/
        
        let callback = function (responseText){
            let studentsEl = document.getElementById("llistat");
            console.log("dentro");
            while (studentsEl.firstChild) {
                studentsEl.removeChild(studentsEl.firstChild);
            }
            console.log(that.students,"estudiantes");
            console.log(that.gradedTasks,"taskas");
            
            let headerString="<tr><td colspan='3'></td>";
            that.gradedTasks.forEach(function(taskItem){
                //console.log(taskItem);            
                headerString+="<td>"+taskItem.name+"</td>";
            });
            studentsEl.innerHTML= headerString;
            that.students.forEach(function(studentItem) {
                //console.log(studentItem);                            
                var liEl = studentItem.getHTMLView();
                studentsEl.appendChild(liEl);
            });
        }
        loadTemplate("templates/ranking.html",callback);       

    }

    getStudents(){
        var that=this;
        var savedStudents = JSON.parse( localStorage.getItem('students'));
        //console.log(savedStudents);
        
        for (var i in savedStudents) { //for each
            //console.log(savedStudents[i])
            // console.log("name",savedStudents[i].name);
            // console.log("surname",savedStudents[i].surname);
            // console.log("points",savedStudents[i].points);
            // console.log("gradedTasks",savedStudents[i].gradedTasks);

            var student= new Person(savedStudents[i].name,savedStudents[i].surname,savedStudents[i].points,savedStudents[i].gradedTasks);
            this.students.push(student);
        }
    }

    getTasks(){
        var that=this;
        var savedTasks = JSON.parse( localStorage.getItem('tasks'));
        //console.log(savedTasks);

        for (var i in savedTasks) { //for each
            //console.log(savedTasks[i])
            var task= new GradedTask(savedTasks[i].name);
            this.gradedTasks.push(task);
        }
        
    }

    addNewStudent(){
        var that=this;
        let callback = function (responseText){
            let saveStudent = document.getElementById("saveStudent");
            saveStudent.addEventListener("click",() => {                                
                let studentName = document.getElementById("studentName").value;                            
                let studentLastName = document.getElementById("studentLastName").value;
                var newStudent= new Person(studentName,studentLastName, 0, []);
                if(that.gradedTasks.length != 0){
                    that.gradedTasks.forEach(function(taskItem) {        
                        newStudent.addGradedTask(taskItem);
                    });
                }
                that.students.push(newStudent);
                localStorage.setItem("students", JSON.stringify(that.students));
                
            });
        }
        loadTemplate("templates/formUser.html",callback);        
    }
    

/** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){        
    // let taskName = prompt("Please enter your task name");
    // let gtask = new GradedTask(taskName);
    // this.gradedTasks.push(gtask);
    // this.students.forEach(function(studentItem) {            
    //     studentItem.addGradedTask(gtask);
    // });
    // this.getRanking();

    var that=this;
    let callback = function (responseText){
        let addTask = document.getElementById("saveTask");
        addTask.addEventListener("click",() => {                                
            let taskName = document.getElementById("taskName").value;
            //debugger;
            //console.log(taskName);

            //console.log(that.gradedTasks);
            let newTask= new GradedTask(taskName);
            //console.log(newTask);
            that.gradedTasks.push(newTask);
            console.log(that.gradedTasks);          
            //console.log(that.students);
            that.students.forEach(function(studentItem) {        
                studentItem.addGradedTask(newTask);
            });
            localStorage.setItem("students", JSON.stringify(that.students));            
            localStorage.setItem("tasks", JSON.stringify(that.gradedTasks));
            that.getRanking();
        });
    }
    loadTemplate("templates/formTask.html",callback); 

}
    
}

export let context = new Context();