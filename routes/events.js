const {Router} = require('express');
const {check} = require('express-validator');

const {validateJWT} = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');

const {isDate} = require('../helpers/isDate');
const {getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/events');

const router = Router();
// Validate token for any petition
router.use(validateJWT);

// Obtain events
router.get('/', getEvents);
// Create events
router.post('/',
    [
    check('title', 'Title is mandatory').not().isEmpty(),
    check('start', 'Start is mandatory').custom(isDate),
    check('end', 'End is mandatory').custom(isDate),
    validateFields
]
,createEvent);
// update events
router.put('/:id', 
    [
    check('title', 'Title is mandatory').not().isEmpty(),
    check('start', 'Start is mandatory').custom(isDate),
    check('end', 'End is mandatory').custom(isDate),
    check('id', 'Id is mandatory').not().isEmpty(),
    validateFields
    ]
    ,updateEvent);
// delete events
router.delete('/:id',
    [
    check('id', 'Id is mandatory').not().isEmpty(),
    validateFields
    ]
    ,deleteEvent);

module.exports = router;