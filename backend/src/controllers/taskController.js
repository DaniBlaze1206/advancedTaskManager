const Project = require("../models/Project");
const List = require("../models/List");
const Task = require("../models/Task");

const {
  validateProjectAndListIdParam,
  validateProjectListAndTaskIdParam,
  validateCreateTask,
  validateUpdateTask,
} = require("../validators/taskValidator");

const getAllTasks = async (req, res) => {
  const paramValidationResult = validateProjectAndListIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const { projectId, listId } = req.params;

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

    const tasks = await Task.find({
      project: projectId,
      list: listId,
    }).sort({ position: 1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  const paramValidationResult = validateProjectAndListIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const bodyValidationResult = validateCreateTask(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId, listId } = req.params;
  const { title, description } = req.body;

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


const updateTask = async (req, res) => {
  const paramValidationResult = validateProjectListAndTaskIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const bodyValidationResult = validateUpdateTask(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId, listId, taskId } = req.params;
  const {
    title,
    description,
    listId: newListId,
    position: newPosition,
  } = req.body;

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

    const routeList = await List.findOne({ _id: listId, project: projectId });
    if (!routeList) {
      return res.status(404).json({ message: "List not found" });
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldListId = task.list.toString();
    const oldPosition = task.position;

   
    if (oldListId !== listId) {
      return res.status(400).json({
        message: "Task does not belong to the list specified in the URL",
      });
    }


    if (newListId !== undefined && newListId.toString() !== oldListId) {
      if (newPosition !== undefined) {
        return res.status(400).json({
          message: "Do not send position when moving task to another list",
        });
      }

      const destinationList = await List.findOne({
        _id: newListId,
        project: projectId,
      });

      if (!destinationList) {
        return res.status(404).json({ message: "Destination list not found" });
      }

  
      await Task.updateMany(
        {
          project: projectId,
          list: oldListId,
          position: { $gt: oldPosition },
        },
        {
          $inc: { position: -1 },
        }
      );

  
      const destinationTasksCount = await Task.countDocuments({
        project: projectId,
        list: newListId,
      });

      task.list = newListId;
      task.position = destinationTasksCount;
    }


    else if (newPosition !== undefined && newPosition !== oldPosition) {
      const tasksCount = await Task.countDocuments({
        project: projectId,
        list: oldListId,
      });

      if (newPosition < 0 || newPosition >= tasksCount) {
        return res.status(400).json({
          message: `Position must be between 0 and ${tasksCount - 1}`,
        });
      }

      if (newPosition > oldPosition) {
        await Task.updateMany(
          {
            project: projectId,
            list: oldListId,
            position: { $gt: oldPosition, $lte: newPosition },
          },
          {
            $inc: { position: -1 },
          }
        );
      } else {
        await Task.updateMany(
          {
            project: projectId,
            list: oldListId,
            position: { $gte: newPosition, $lt: oldPosition },
          },
          {
            $inc: { position: 1 },
          }
        );
      }

      task.position = newPosition;
    }


    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const deleteTask = async (req, res) => {
  const paramValidationResult = validateProjectListAndTaskIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const { projectId, listId, taskId } = req.params;

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

    const routeList = await List.findOne({ _id: listId, project: projectId });
    if (!routeList) {
      return res.status(404).json({ message: "List not found" });
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskListId = task.list.toString();

    if (taskListId !== listId) {
      return res.status(400).json({
        message: "Task does not belong to the list specified in the URL",
      });
    }

    const deletedPosition = task.position;

    await task.deleteOne();

    await Task.updateMany(
      {
        project: projectId,
        list: taskListId,
        position: { $gt: deletedPosition },
      },
      {
        $inc: { position: -1 },
      }
    );

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
