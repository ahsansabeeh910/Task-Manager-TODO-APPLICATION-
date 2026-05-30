const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();

const PORT = 3000;
const DB = "./tasks.json";

app.use(cors());
app.use(express.json());

async function readTasks() {
    try {
        return await fs.readJson(DB);
    } catch {
        return [];
    }
}

async function saveTasks(tasks) {
    await fs.writeJson(
        DB,
        tasks,
        { spaces: 2 }
    );
}

app.get("/tasks", async (req, res) => {
    const tasks = await readTasks();
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {

    const tasks = await readTasks();

    const task = {
        id: req.body.id,
        title: req.body.title,
        priority: req.body.priority,
        category: req.body.category,
        done: req.body.done,
        createdAt: req.body.createdAt
    };

    tasks.push(task);

    await saveTasks(tasks);

    res.status(201).json(task);
});

app.put("/tasks/:id", async (req, res) => {

    const tasks = await readTasks();

    const index =
        tasks.findIndex(
            t => t.id === req.params.id
        );

    if(index === -1)
        return res.status(404).send();

    tasks[index] = {
        ...tasks[index],
        ...req.body
    };

    await saveTasks(tasks);

    res.json(tasks[index]);
});

app.delete("/tasks/:id", async (req, res) => {

    const tasks = await readTasks();

    const filtered =
        tasks.filter(
            t => t.id !== req.params.id
        );

    await saveTasks(filtered);

    res.json({
        message:"Deleted"
    });
});

app.listen(PORT, () => {

    console.log(
        `Running on http://localhost:${PORT}`
    );

});