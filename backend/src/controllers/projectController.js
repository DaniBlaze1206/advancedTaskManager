const Project = require("../models/Project");
const User = require("../models/User");

const {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember,
  validateRemoveMember,
  validateTransferOwnership,
  validateProjectId,
} = require("../validators/projectValidator");

const createProject = async (req, res) => {
  const validation = validateCreateProject(req.body);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const { name, description, members = [] } = req.body;

    let memberIds = [];

    if (members.length > 0) {
      const foundUsers = await User.find({
        username: { $in: members.map((m) => m.toLowerCase()) },
      }).select("_id username");

      memberIds = foundUsers.map((user) => user._id.toString());
    }

    const memberSet = new Set([req.user._id.toString(), ...memberIds]);

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: Array.from(memberSet),
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  const validation = validateProjectId(req.params);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    }).select("name description owner members");

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

const getProjectById = async (req, res) => {
  const validation = validateProjectId(req.params);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const project = await Project.findById(req.params.projectId)
      .populate("members", "username email")
      .populate("owner", "username email")
      .populate({
        path: "lists",
        options: { sort: { position: 1 } },
        populate: { path: "tasks", options: { sort: { position: 1 } } },
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this project",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

const updateProject = async (req, res) => {
  const validation = validateUpdateProject(req.body);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

const addMember = async (req, res) => {
  const validation = validateAddMember(req.body);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const { username } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMember = project.members.some(
      (member) => member.toString() === user._id.toString(),
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User already a member",
      });
    }

    project.members.push(user._id);

    await project.save();

    res.json({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

const removeMember = async (req, res) => {
  const validation = validateRemoveMember(req.params);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const requesterId = req.user._id.toString();

    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot be removed from the project",
      });
    }

    if (requesterId !== project.owner.toString() && requesterId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this member",
      });
    }

    const isMember = project.members.some(
      (member) => member.toString() === userId,
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a project member",
      });
    }

    project.members.pull(userId);

    await project.save();

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};

const transferOwnership = async (req, res) => {
  const validation = validateTransferOwnership(req.body);

  if (validation !== true) {
    return res.status(400).json({
      success: false,
      errors: validation,
    });
  }

  try {
    const { projectId } = req.params;
    const { newOwnerId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can transfer ownership",
      });
    }

    const isMember = project.members.some(
      (member) => member.toString() === newOwnerId,
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "New owner must be a project member",
      });
    }

    if (project.owner.toString() === newOwnerId) {
      return res.status(400).json({
        success: false,
        message: "User is already the owner",
      });
    }

    project.owner = newOwnerId;

    await project.save();

    res.json({
      success: true,
      message: "Ownership transferred successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to transfer ownership",
    });
  }
};

module.exports = {
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember,
  removeMember,
  transferOwnership,
};
