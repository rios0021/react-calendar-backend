// Auth routes
// host + /api/auth

const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();

const { validateFields } = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/validate-jwt');
const {createUser, loginUser, renewToken} = require('../controllers/auth');


router.post(
    '/',
    [
        check('password', 'Password is mandatory').not().isEmpty(),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        validateFields
    ],
    loginUser);
router.post(
    '/new', 
    [
        check('name', 'Name is mandatory').not().isEmpty(),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('password', 'Password needs to be at least 6 characters').isLength({min:6}),
        validateFields
    ], 
    createUser);
router.get('/renew', validateJWT, renewToken);


module.exports = router;