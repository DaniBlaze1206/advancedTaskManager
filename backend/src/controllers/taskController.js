const Project = require("../models/Project");
const List = require("../models/List");
const Task = require("../models/Task");

const {
  validateProjectIdParam,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} = require("../validators/taskValidator");



const createTask = async (req, res) => {
  const paramValidationResult = validateProjectIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const bodyValidationResult = validateCreateTask(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId } = req.params;
  const { listId, title, description } = req.body;

  try {
    const project = await Project.findById(projectId).select("owner members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterId = req.user._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const hasAccess =
      isOwner || project.members.some((member) => member.toString() === requesterId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const list = await List.findOne({ _id: listId, project: projectId });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const tasksCount = await Task.countDocuments({
      project: projectId,
      list: listId,
    });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      list: listId,
      position: tasksCount,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
