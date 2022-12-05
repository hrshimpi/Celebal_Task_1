const express = require('express');
const router = express();
const middleware = require("../middleware/TokenValidation");
const adminControllers =  require("../controller/adminController");

router.post('/admin/login', adminControllers.LoginAdmin)
router.post('/admin/addAdmin', adminControllers.createAdmin);

router.put('/admin/update/:id', middleware.canEditAdmin,adminControllers.updateAdmin);

router.post('/admin/addStudent', middleware.canAddStudent, adminControllers.createAdmin);
router.post('/admin/addMarkSheet', adminControllers.createMarkList);
router.put('/admin/students/:id', middleware.canAddStudent, adminControllers.updateStudentRecord);
router.delete('/admin/delete/student/:id',middleware.canAddStudent, adminControllers.deleteStudentMarkSheet);

module.exports = router
