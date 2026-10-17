import express from 'express';
import * as contactCtrl from '../controllers/contact.controller.js';
import * as projectCtrl from '../controllers/project.controller.js';
import * as qualCtrl from '../controllers/qualifications.controller.js';

const router = express.Router();

// ==========================================
// 📞 CONTACTS ENDPOINTS
// ==========================================
router.route('/api/contacts')
    .post(contactCtrl.create)
    .get(contactCtrl.findAll)
    .delete(contactCtrl.removeAll);

router.route('/api/contacts/:id')
    .get(contactCtrl.findOne)
    .put(contactCtrl.update)
    .delete(contactCtrl.remove);

// ==========================================
// 📂 PROJECTS ENDPOINTS
// ==========================================
router.route('/api/projects')
    .post(projectCtrl.create)
    .get(projectCtrl.findAll)
    .delete(projectCtrl.removeAll);

router.route('/api/projects/:id')
    .get(projectCtrl.findOne)
    .put(projectCtrl.update)
    .delete(projectCtrl.remove);

// ==========================================
// 🎓 QUALIFICATIONS ENDPOINTS
// ==========================================
router.route('/api/qualifications')
    .post(qualCtrl.create)
    .get(qualCtrl.findAll)
    .delete(qualCtrl.removeAll);

router.route('/api/qualifications/:id')
    .get(qualCtrl.findOne)
    .put(qualCtrl.update)
    .delete(qualCtrl.remove);

export default router;
