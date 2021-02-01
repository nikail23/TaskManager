class Task {
    constructor(name, type, description, date) {
        this.name = name;
        this.type = type;
        /**
         *  0 - notStarted
         *  1 - inProgress
         *  2 - finished
         */
        this.description = description;
        this.date = date;
    }
}

class TasksModel {
    _tasks = [
        new Task(
            "Сделать первую лабу по СПП.",
            1,
            "Необходимо успеть к среде!",
            new Date(2021, 1, 3, 19, 0, 0)
        ),
        new Task(
            "Сделать первый блок по ТВОП.",
            0,
            "Еще целых 3 недели, чтобы это сделать!)",
            new Date(2021, 1, 20, 19, 0, 0)
        )
    ];
    
    _selectedTask = this._tasks[0];

    selectTask(index) {
        if (this._tasks[index]) {
            this._selectedTask = this._tasks[index];
        }
    }

    getSelectedTask() {
        return this._selectedTask;
    }

    addTask(task) {
        if (task instanceof Task) {
            this._tasks.push(task);
        }
    }

    deleteTask(index) {
        if (typeof(index) === "number") {
            this._tasks = this._tasks.splice(index, 1);
        }
    }

    getTasks() {
        return this._tasks;
    }
}

let tasksModel = new TasksModel();

const express = require('express'); 
const app = express(); 
const ejs = require('ejs'); 
const port = 8000; 

app.use(express.static('./styles'));
  
app.get('/tasks', function (request, response) {
    let id = Number(request.query.id);
    if (typeof(id) === "number") {
        tasksModel.selectTask(id);
    }
    ejs.renderFile('./templates/index.ejs', 
        {
            tasks: tasksModel.getTasks(),
            selectedTask: tasksModel.getSelectedTask()
        },  
        {},
        function (error, template) { 
            if (error) { 
                throw error; 
            } else { 
                response.send(template); 
            } 
        }); 
}); 

app.use("/",function (request, response) {
    response.redirect("/tasks")
  });
  
app.listen(port, function (error) { 
    if (error) 
        throw error; 
    else
        console.log("Server is running"); 
}); 