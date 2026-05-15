const Project = rqruire("../models/project");

const createProject = async (req, res) => {
	try {
		const { name, description, members = [] } = req.body;
		

		const memberSet = new Set([req.user._id.toString(), ...members]);

		const project = await Project.create({
			name, 
			description,
			owner: req.user._id,
			members: Array.from(memberSet)
		});

		res.status(201).json({
			success: true,
			data: project
		})

	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to create project"
		});
	}
};

const deleteProject = async (req, res) => {
	try {
		const projectId = req.params.id;

		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found"
			});
		};

		if(project.owner.toString() !== req.user._id.toString()){
			return res.status(403).json({
				success: false,
				message: "You are not authorized to delete this project"
			});
		};

		await project.deleteOne();

		res.status(200).json({
			success: true,
			message: "Project deleted successfully"
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to delete project"
		});
	}
}

const getProjects = async (req, res) => {
	try {
		const projects = await Project.find({
			members: req.user._id
		}).select("name description owner");

		res.json({
			success: true,
			data: projects
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Faild to fetch projects"
		});
	}
};

const getProjectById = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id)
		.populate("memebers", "username email")
		.populated("owner", "username email");

		if(!project) {
			return res.status(404).json({
					success: false,
					message: "Project not found"
				});
		}

		if(!project.memebers.some(
			memeber => memeber._id.toString() === req.user._id.toString()
		)) {
			return res.status(403).json({
				success: false,
				message: "not authorized to access this project"
			});
		}

		res.json({
			success: true,
			data: project
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch project"
		});
	}
};


const updateProject = async (req, res) => {
	try {
		const { name, description } = req.body;

		const project = await Project.findById(req.params.id);

		if(!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found"
			});
		}

		if(project.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update this project"
			});
		}

		if (name) project.name = name;
		if (description) project.description = description;

		await project.save();
		
		res.json({
			success: true,
			data: project
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to update project"
		});
		
	}
};

const addMember = async (req, res) => {
  try {
    const { username } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }


    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User already a member"
      });
    }

    project.members.push(user._id);

    await project.save();

    res.json({
      success: true,
      message: "Member added successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add member"
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const requesterId = req.user._id.toString();

    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot be removed from the project"
      });
    }

    if (
      requesterId !== project.owner.toString() &&
      requesterId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this member"
      });
    }

    if (!project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is not a project member"
      });
    }

    project.members.pull(userId);

    await project.save();

    res.json({
      success: true,
      message: "Member removed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove member"
    });
  }
};