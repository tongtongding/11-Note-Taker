const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const { v4: uuidv4 } = require('uuid');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//check with TA
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + "/public/index.html")
    )
});

app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname + "/public/notes.html")
    )
});

app.get("/api/notes",(req,res)=>{
    
    let noteData = fs.readFileSync(path.join(__dirname +"/db/db.json"),"utf-8");
    res.json(JSON.parse(noteData));
});

//check with TA if it needed
app.get("/api/notes/:id",(req,res)=>{
    let noteID = req.params.id;
    let noteData = fs.readFileSync(path.join(__dirname +"/db/db.json"),"utf-8");
    let noteDataJSON = JSON.parse(noteData);

    for(let i = 0; i < noteDataJSON.length; i++){
        if(noteDataJSON[i].id === noteID){
            console.log(noteDataJSON[i]);

            return res.json(noteDataJSON[i]);
        }
    }
});

app.post("/api/notes",(req,res)=>{
    
    // let newID = new Date().getTime();
    let newID = uuidv4();
    let newNote ={
        id:newID,
        title:req.body.title,
        text:req.body.text,
    };
    
    let noteData = fs.readFileSync(path.join(__dirname + "/db/db.json"),"utf-8");
    
    let noteDataJSON = JSON.parse(noteData);
    
    noteDataJSON.push(newNote);

    fs.writeFileSync(path.join(__dirname + "/db/db.json"),JSON.stringify(noteDataJSON, null, 2))

    res.json(noteDataJSON);
});

app.delete("/api/notes/:id",(req,res)=>{
    console.log("delete!");
    let noteID = parseInt(req.params.id);
    let noteData = fs.readFileSync(path.join(__dirname +"/db/db.json"),"utf-8");
    let noteDataJSON = JSON.parse(noteData);

    let newNote = noteDataJSON.filter((note)=>{
        return note.id !== noteID;
    });

    fs.writeFileSync(path.join(__dirname + "/db/db.json"),JSON.stringify(newNote, null,2));

    res.send(newNote);

});


app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname + "/public/index.html")
    )
});

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
});