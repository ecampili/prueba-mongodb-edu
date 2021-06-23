const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields } = require('../middlewares/validate-fields')
const { createUser, loginUser, revalidateToken } = require('../controllers/auth')
const router = Router()
const { validateJWT } = require('../middlewares/validate-jwt')


router.post(
    '/new',
    [
        check('name', 'el nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe tener mas de 5 caracteres').isLength({ min: 5 }),
        validateFields
    ],
    createUser)
router.post(
    '/',
    [
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe tener mas de 5 caracteres').isLength({ min: 5 }),
        validateFields
    ],
    loginUser)


router.get('/renew', validateJWT, revalidateToken)





module.exports = router;