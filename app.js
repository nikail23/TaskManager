const express = require('express'); 
const app = express(); 
const ejs = require('ejs'); 
let fs = require('fs'); 
const port = 8000; 
  
app.get('/', function (request, response) { 
    ejs.renderFile('index.ejs', {},  
        {}, function (err, template) { 
        if (err) { 
            throw err; 
        } else { 
            response.end(template); 
        } 
    }); 
}); 
  
app.listen(port, function (error) { 
    if (error) 
        throw error; 
    else
        console.log("Server is running"); 
}); 