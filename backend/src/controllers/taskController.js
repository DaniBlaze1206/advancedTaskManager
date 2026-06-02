const mongoose = require("mongoose");

const Project = require("../models/Project");
const List = require("../models/List");
const Task = require("../models/Task");

const {
  validateCreateTaskBody,
  validateUpdateTaskBody,
  validateDeleteTaskBody, 
} = require("../validators/taskValidator");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const ensureValidParamIds = (req, res) => {
  const { projectId, listId, taskId } = req.params;

  if (projectId && !isValidObjectId(projectId)) {
    res.status(400).json({ message: "Invalid projectId" });
    return false;
  }

  if (listId && !isValidObjectId(listId)) {
    res.status(400).json({ message: "Invalid listId" });
    return false;
  }

  if (taskId && !isValidObjectId(taskId)) {
    res.status(400).json({ message: "Invalid taskId" });
    return false;
  }

  return true;
};

const ensureProjectAccessAndListScope = async ({ projectId, listId, userId }) => {
  const project = await Project.findById(projectId).select("owner members");
  if (!project) return { status: 404, message: "Project not found" };

  const requesterId = userId.toString();
  const isOwner = project.owner.toString() === requesterId;
  const hasAccess =
    isOwner || project.members.some((m) => m.toString() === requesterId);

  if (!hasAccess) return { status: 403, message: "Access denied" };

  const list = await List.findOne({ _id: listId, project: projectId });
  if (!list) return { status: 404, message: "List not found" };

  return { ok: true, project, list };
};

const createTask = async (req, res) => {
  if (!ensureValidParamIds(req, res)) return;

  const bodyValidationResult = validateCreateTaskBody(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId, listId } = req.params;
  const { title, description } = req.body;

  try {
    const access = await ensureProjectAccessAndListScope({
      projectId,
      listId,
      userId: req.user._id,
    });
    if (!access.ok) {
      return res.status(access.status).json({ message: access.message });
    }

    const tasksCount = await Task.countDocuments({ project: projectId, list: listId });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      list: listId,
      position: tasksCount, 
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  if (!ensureValidParamIds(req, res)) return;

  const bodyValidationResult = validateUpdateTaskBody(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId, listId, taskId } = req.params;
  const { title, description, listId: destinationListId, position: newPosition } =
    req.body;

  if (destinationListId !== undefined && !isValidObjectId(destinationListId)) {
    return res.status(400).json({ message: "Invalid destination listId" });
  }

  try {
    const access = await ensureProjectAccessAndListScope({
      projectId,
      listId,
      userId: req.user._id,
    });
    if (!access.ok) {
      return res.status(access.status).json({ message: access.message });
    }

    const task = await Task.findOne({
      _id: taskId,
      project: projectId,
      list: listId, 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldListId = task.list.toString();
    const oldPosition = task.position;

    if (
      destinationListId !== undefined &&
      destinationListId.toString() !== oldListId
    ) {
      if (newPosition !== undefined) {
        return res.status(400).json({
          message: "Do not send position when moving task to another list",
        });
      }

      const destinationList = await List.findOne({
        _id: destinationListId,
        project: projectId,
      });
      if (!destinationList) {
        return res.status(404).json({ message: "Destination list not found" });
      }

      await Task.updateMany(
        { project: projectId, list: oldListId, position: { $gt: oldPosition } },
        { $inc: { position: -1 } }
      );

      const destCount = await Task.countDocuments({
        project: projectId,
        list: destinationListId,
      });

      task.list = destinationListId;
      task.position = destCount;
    }

    else if (newPosition !== undefined && newPosition !== oldPosition) {
      const count = await Task.countDocuments({ project: projectId, list: oldListId });

      if (newPosition < 0 || newPosition >= count) {
        return res
          .status(400)
          .json({ message: `Position must be between 0 and ${count - 1}` });
      }

      if (newPosition > oldPosition) {
        await Task.updateMany(
          {
            project: projectId,
            list: oldListId,
            position: { $gt: oldPosition, $lte: newPosition },
          },
          { $inc: { position: -1 } }
        );
      } else {
        await Task.updateMany(
          {
            project: projectId,
            list: oldListId,
            position: { $gte: newPosition, $lt: oldPosition },
          },
          { $inc: { position: 1 } }
        );
      }

      task.position = newPosition;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  if (!ensureValidParamIds(req, res)) return;

  if (typeof validateDeleteTaskBody === "function") {
    const validationResult = validateDeleteTaskBody({ taskId: req.params.taskId });
    if (validationResult !== true) {
      return res.status(400).json({ errors: validationResult });
    }
  }

  const { projectId, listId, taskId } = req.params;

  try {
    const access = await ensureProjectAccessAndListScope({
      projectId,
      listId,
      userId: req.user._id,
    });
    if (!access.ok) {
      return res.status(access.status).json({ message: access.message });
    }

    const task = await Task.findOne({
      _id: taskId,
      project: projectId,
      list: listId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deletedPosition = task.position;

    await task.deleteOne();


    await Task.updateMany(
      { project: projectId, list: listId, position: { $gt: deletedPosition } },
      { $inc: { position: -1 } }
    );

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
