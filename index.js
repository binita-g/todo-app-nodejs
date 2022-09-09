const express = require("express"); 
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

// Configure .env to store DB_CONNECT string, which is used to create a secure username/password connection with Mongo.
dotenv.config();

// Access styling from the "public" folder as middleware.
app.use("/static", express.static("public"));

// Parse incoming requests.
app.use(express.urlencoded({ extended: true }));

// Set up connection to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

// Use "ejs" files for views.
app.set("view engine", "ejs");

// Pass in tasks to todo.ejs
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST METHOD: Save tasks to database
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// UPDATE: Update or change existing task
app.route("/edit/:id")
    .get((req, res) => {
        // Find existing task that is being changed.
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        // Render the tasks list with the "todoEdits" view.
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// DELETE: Delete an existing task
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});