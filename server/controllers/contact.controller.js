import Contact from '../models/contact.model.js';

// Create and Save a new Contact
export const create = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const data = await contact.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message || "Some error occurred while creating the Contact." });
    }
};

// Retrieve all Contacts from the database
export const findAll = async (req, res) => {
    try {
        const data = await Contact.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while retrieving contacts." });
    }
};

// Find a single Contact with an id
export const findOne = async (req, res) => {
    try {
        const data = await Contact.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Contact not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving Contact with id " + req.params.id });
    }
};

// Update a Contact identified by the id in the request
export const update = async (req, res) => {
    try {
        const data = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Contact not found with id " + req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: "Error updating Contact with id " + req.params.id });
    }
};

// Delete a Contact with the specified id in the request
export const remove = async (req, res) => {
    try {
        const data = await Contact.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Contact not found with id " + req.params.id });
        res.status(200).json({ message: "Contact deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Could not delete Contact with id " + req.params.id });
    }
};

// Delete all Contacts from the database
export const removeAll = async (req, res) => {
    try {
        await Contact.deleteMany({});
        res.status(200).json({ message: "All Contacts were deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred while removing all contacts." });
    }
};
