const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields')

const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/events')
const { validateJWT } = require('../middlewares/validate-jwt')
const { isDate } = require('../helpers/isDate')


// para poder hacer cualquiera de esta peticiones hay que validar token
router.use(validateJWT)


router.get('/', getEvents)

router.post(
    '/',
    [
        check('title', ' El titulo es requerido').notEmpty(),
        check('start', ' Fecha inicio es requerido').custom(isDate),
        check('end', ' Fecha final es requerido').custom(isDate),
    ],
    validateFields,
    createEvent
)

router.put('/:id', updateEvent)

router.delete('/:id', deleteEvent)






module.exports = router;