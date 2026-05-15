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