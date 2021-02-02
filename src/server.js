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
    
    _selectedTaskIndex = 0;

    _editedIndex = -1;

    selectTask(index) {
        if (this._tasks[index]) {
            this._selectedTaskIndex = index;
        }
    }

    getSelectedTask() {
        return this._tasks[this._selectedTaskIndex];
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

    markCurrentTaskAsEdit() {
        this._editedIndex = this._selectedTaskIndex;
    }

    getEditTaskIndex() {
        return this._editedIndex;
    }

    editTask(editedTask) {
        if (this._editedIndex !== -1) {
            this._tasks[this._editedIndex] = editedTask;
            this._editedIndex = -1
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
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

app.use(express.static('./styles'));
  
app.get('/tasks', function (request, response) {
    let id = Number(request.query.id);
    if (typeof(id) === "number") {
        tasksModel.selectTask(id);
    }
    ejs.renderFile('./templates/main.ejs', 
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

app.get('/add', function (request, response) {
    ejs.renderFile('./templates/add.ejs', 
        {},  
        {},
        function (error, template) { 
            if (error) { 
                throw error; 
            } else { 
                response.send(template); 
            } 
        }); 
}); 

app.get('/delete', function (request, response) {
    ejs.renderFile('./templates/delete.ejs', 
    {
        tasks: tasksModel.getTasks(),
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

app.get('/edit', function (request, response) {
    tasksModel.markCurrentTaskAsEdit();
    ejs.renderFile('./templates/edit.ejs', 
        {
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

app.post('/add', urlencodedParser, function (request, response) {
    if (!request.body) {
        console.log("bad request");
        return response.sendStatus(400);
    }

    let type;
    if (request.body.status === "notStarted") {
        type = 0;
    }  
    if (request.body.status === "inProgress") {
        type = 1;
    }  
    if (request.body.status === "finished") {
        type = 2;
    }

    tasksModel.addTask(
        new Task(
            request.body.name, 
            type, 
            request.body.description, 
            new Date(request.body.datetime)
        )
    );

    response.redirect(303, "/tasks");
});

app.post('/edit', urlencodedParser, function (request, response) {
    if (!request.body) {
        console.log("bad request");
        return response.sendStatus(400);
    }

    let type;
    if (request.body.status === "notStarted") {
        type = 0;
    }  
    if (request.body.status === "inProgress") {
        type = 1;
    }  
    if (request.body.status === "finished") {
        type = 2;
    }

    const editedTaskIndex = tasksModel.getEditTaskIndex();
    console.log(editedTaskIndex);
    console.log(tasksModel.getTasks());

    tasksModel.editTask(
        new Task(
            request.body.name, 
            type, 
            request.body.description, 
            new Date(request.body.datetime)
        )
    );

    console.log(tasksModel.getTasks());

    response.redirect(303, "/tasks");
})

app.use("/",function (request, response) {
    response.redirect("/tasks")
});
  
app.listen(port, function (error) { 
    if (error) 
        throw error; 
    else
        console.log("Server is running"); 
}); 