import express from 'express';
import * as contactCtrl from '../controllers/contact.controller.js';
import * as projectCtrl from '../controllers/project.controller.js';
import * as qualCtrl from '../controllers/qualifications.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

// ==========================================
// 📞 CONTACTS ENDPOINTS
// ==========================================
router.route('/api/contacts')
    .post(contactCtrl.create) // Anyone/Users can submit a contact message
    .get(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.findAll) // Admin only
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.removeAll); // Admin only

router.route('/api/contacts/:id')
    .get(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.findOne) // Admin only
    .put(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.update) // Admin only
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.remove); // Admin only

// ==========================================
// 📂 PROJECTS ENDPOINTS
// ==========================================
router.route('/api/projects')
    .post(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.create) // Admin only
    .get(projectCtrl.findAll) // Public/Users can view projects
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.removeAll); // Admin only

router.route('/api/projects/:id')
    .get(projectCtrl.findOne) // Public/Users can view a project
    .put(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.update) // Admin only
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.remove); // Admin only

// ==========================================
// 🎓 QUALIFICATIONS ENDPOINTS
// ==========================================
router.route('/api/qualifications')
    .post(authCtrl.requireSignin, authCtrl.isAdmin, qualCtrl.create) // Admin only
    .get(qualCtrl.findAll) // Public/Users can view qualifications
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, qualCtrl.removeAll); // Admin only

router.route('/api/qualifications/:id')
    .get(qualCtrl.findOne) // Public/Users can view a qualification
    .put(authCtrl.requireSignin, authCtrl.isAdmin, qualCtrl.update) // Admin only
    .delete(authCtrl.requireSignin, authCtrl.isAdmin, qualCtrl.remove); // Admin only

export default router;
