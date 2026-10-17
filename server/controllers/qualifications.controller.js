import Qualification from '../models/qualification.model.js';

// Create and Save a new Qualification
export const create = async (req, res) => {
    try {
        const qualification = new Qualification(req.body);
        const data = await qualification.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message || "Some error occurred while creating the Qualification." });
    }
};

// Retrieve all Qualifications from the database
export const findAll = async (req, res) => {
    try {
        const data = await Qualification.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while retrieving qualifications." });
    }
};

// Find a single Qualification with an id
export const findOne = async (req, res) => {
    try {
        const data = await Qualification.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Qualification not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving Qualification with id " + req.params.id });
    }
};

// Update a Qualification identified by the id in the request
export const update = async (req, res) => {
    try {
        const data = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Qualification not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: "Error updating Qualification with id " + req.params.id });
    }
};

// Delete a Qualification with the specified id in the request
export const remove = async (req, res) => {
    try {
        const data = await Qualification.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Qualification not found with id " + req.params.id });
        res.status(200).json({ message: "Qualification deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Could not delete Qualification with id " + req.params.id });
    }
};

// Delete all Qualifications from the database
export const removeAll = async (req, res) => {
    try {
        await Qualification.deleteMany({});
        res.status(200).json({ message: "All Qualifications were deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while removing all qualifications." });
    }
};
