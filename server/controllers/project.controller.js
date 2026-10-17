import Project from '../models/project.model.js';

// Create and Save a new Project
export const create = async (req, res) => {
    try {
        const project = new Project(req.body);
        const data = await project.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message || "Some error occurred while creating the Project." });
    }
};

// Retrieve all Projects from the database
export const findAll = async (req, res) => {
    try {
        const data = await Project.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while retrieving projects." });
    }
};

// Find a single Project with an id
export const findOne = async (req, res) => {
    try {
        const data = await Project.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Project not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving Project with id " + req.params.id });
    }
};

// Update a Project identified by the id in the request
export const update = async (req, res) => {
    try {
        const data = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Project not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: "Error updating Project with id " + req.params.id });
    }
};

// Delete a Project with the specified id in the request
export const remove = async (req, res) => {
    try {
        const data = await Project.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Project not found with id " + req.params.id });
        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Could not delete Project with id " + req.params.id });
    }
};

// Delete all Projects from the database
export const removeAll = async (req, res) => {
    try {
        await Project.deleteMany({});
        res.status(200).json({ message: "All Projects were deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while removing all projects." });
    }
};
