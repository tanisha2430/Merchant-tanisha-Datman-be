const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  const { merchantId, interactionId, businessType, title, description, assignedTo, followUpDate, status, reminderTime, reminderDate } = req.body;
  try {
    const newTask = new Task({
      merchantId,
      interactionId,
      businessType,
      title,
      description,
      assignedTo,
      createdBy: req.agent._id,
      followUpDate,
      status,
      reminderTime,
      reminderDate
    });

    await newTask.save();
    console.log(newTask)
    res.json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to create task" });
  }
});

//  Get Task by ID 
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .populate("merchantId", "name description")
      .populate("interactionId", "title description");

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy._id.toString() !== req.agent._id.toString() &&
        task.assignedTo._id.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

//  Get All Tasks by Interaction ID 
router.get("/interaction/:interactionId", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ interactionId: req.params.interactionId })
      .populate("assignedTo", "username")
      .populate("createdBy", "username")
      .populate("merchantId", "name description")
      .populate("interactionId", "title description");
      
      
    console.log("req.agent calling",req.agent)
    console.log("consoloihtasks",tasks)

    const filteredTasks = tasks.filter(task =>task.createdBy._id.toString() == req.agent._id.toString() || task.assignedTo._id.toString() == req.agent._id.toString());

    res.json(filteredTasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});




router.get("/merchantId/:merchantId", authMiddleware, async (req, res) => {
    try {
      const tasks = await Task.find({ merchantId: req.params.merchantId })
        .populate("assignedTo", "username")
        .populate("createdBy", "username")
        .populate("merchantId", "name description")
        .populate("interactionId", "title description");
        
        
      console.log("req.agent calling",req.agent)
      console.log("consoloihtasks",tasks)
  
      const filteredTasks = tasks.filter(task =>task.createdBy._id.toString() == req.agent._id.toString() || task.assignedTo._id.toString() == req.agent._id.toString());
  
      res.json(filteredTasks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });




//  Update Task by ID 
router.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo, followUpDate, status, businessType, reminderTime, reminderDate } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy.toString() !== req.agent._id.toString() &&
        task.assignedTo.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    task.title = title;
    task.description = description;
    task.assignedTo = assignedTo;
    task.followUpDate = followUpDate;
    task.status = status;
    task.businessType = businessType;
    task.reminderTime = reminderTime;
    task.reminderDate = reminderDate;

    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

//  Delete Task by ID 
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy.toString() !== req.agent._id.toString() &&
        task.assignedTo.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
