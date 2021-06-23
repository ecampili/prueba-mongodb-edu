const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../Models/User')
const { generateJWT } = require('../helpers/jwt')

const createUser = async (req, res = response) => {

    const { name, email, password } = req.body

    try {

        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'ese mail ya esta registrado'
            })
        }
        user = new User(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save()
        // generar JWT

        const token = await generateJWT(user.id, user.name)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            ok: false,
            msg: 'hubo un error'
        })

    }
}

const loginUser = async (req, res = response) => {
    const { email, password } = req.body

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'usuario no existe'
            })
        }

        // chequear password

        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecta'
            })
        }

        // generar JWT
        const token = await generateJWT(user.id, user.name)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(e.message)
        res.status(500).json({
            ok: false,
            msg: 'hubo un error'
        })
    }


}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req


    // generar un nuevo JWT y retornarlo
    const token = await generateJWT(uid, name)

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}