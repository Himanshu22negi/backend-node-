const Project = require('../models/project.model');

// @desc    Get all projects (User sees assigned, Admin sees all)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query = { assignedUsers: req.user.id };
        }
        const projects = await Project.find(query).populate('assignedUsers', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('assignedUsers', 'name email');
        if (project) {
            // Check access if not admin
            if (req.user.role !== 'Admin' && !project.assignedUsers.some(u => u._id.toString() === req.user.id)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create project (Admin only)
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
    try {
        const { title, description, startDate, endDate, assignedUsers } = req.body;
        let attachments = [];
        if (req.files) {
            attachments = req.files.map(file => file.path);
        }

        const project = await Project.create({
            title,
            description,
            startDate,
            endDate,
            assignedUsers: assignedUsers ? assignedUsers.split(',') : [], // simplified parsing if sent as comma-separated string from form-data, or handle json
            attachments
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project (Admin: all, User: status only)
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role === 'Admin') {
            project.title = req.body.title || project.title;
            project.description = req.body.description || project.description;
            project.startDate = req.body.startDate || project.startDate;
            project.endDate = req.body.endDate || project.endDate;
            project.status = req.body.status || project.status;
            if (req.body.assignedUsers) {
                project.assignedUsers = req.body.assignedUsers.split(',');
            }
            if (req.files && req.files.length > 0) {
                const newAttachments = req.files.map(file => file.path);
                // Requirement: "Max 3". Add checks if needed.
                if (project.attachments.length + newAttachments.length > 3) {
                    return res.status(400).json({ message: 'Max 3 attachments allowed' });
                }
                project.attachments = [...project.attachments, ...newAttachments];
            }
        } else {
            // User can only update status
            if (!project.assignedUsers.includes(req.user.id)) {
                return res.status(403).json({ message: 'Not authorized to update this project' });
            }
            if (req.body.status) {
                project.status = req.body.status;
            }
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project (Admin only)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
