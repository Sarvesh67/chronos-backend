var express = require('express');
var router = express.Router();

var verify = require('../functions/verifyFunc');
var validate = require('../functions/validationFunc');

// var themes = require("../controllers/themeCtrl");
// var atcStrip = require("../controllers/atcStripCtrl");
var login = require("../controllers/loginCtrl");
var crud = require("../controllers/crud");

// Login and onboarding
router.post("/signup", validate.signupvalidation, login.signup);
router.post("/login", validate.loginvalidation, login.login);
router.post("/emailver/:token", login.confirmEmail);
router.post("/updatePass", login.updatePass);
router.post("/completeProfile", verify.authenticate, validate.profilevalidation, login.profile);
router.get("/dashboard", verify.authenticate, login.dashboard);


// // ATC and the ATC Strips
// router.get('/atc/strips', atc.getAll);
// router.get('/atc/progress/strip', atc.get);
// router.post('/atc/strip/create', atc.create);
// router.delete('/atc/strip/delete', atc.delete);

// router.post("/request/permission", login.requestPermission);
// router.post("/grant/permission", login.allotPermission);
// router.get("/get/user/team", login.getUserTeams);
// router.get('/search/user', login.userFullTs);



module.exports = router;
