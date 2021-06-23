const { response } = require('express')
const Event = require('../Models/Event')


const getEvents = async (req, res = response) => {

    const events = await Event.find()
        .populate('user', 'name email')
    res.json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) => {

    const event = new Event(req.body)

    try {
        event.user = req.uid

        const eventSaved = await event.save();
        res.status(201).json({
            ok: true,
            event: eventSaved
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'No tiene asignado un user'
        })
    }
}

const updateEvent = async (req, res = response) => {
    const { id } = req.params
    const { title, start, end, notes } = req.body
    const { uid } = req

    try {
        const event = await Event.findById(id)

        if (!event) {
            res.status(404).json({
                ok: false,
                msg: 'no existe evento con ese id'
            })
        }

        // verificar si el usuario es el mismo
        if (event.user.toString() !== uid) {
            res.status(401).json({
                ok: false,
                msg: 'no estas autorizado para cambiar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        // para que devuela los datos actuailzados agregar como 3 parametro { new: true }
        const updatedEvent = await Event.findByIdAndUpdate(id, newEvent, { new: true });

        res.json({
            ok: true,
            event: updatedEvent
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            ok: false,
            msg: 'algo no esta bien'
        })
    }
}

const deleteEvent = async (req, res = response) => {

    const { id } = req.params
    const { uid } = req

    try {
        const event = await Event.findById(id)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe evento con ese id'
            })
        }

        // verificar si el usuario es el mismo
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no estas autorizado para eliminar este evento'
            })
        }

        await Event.findByIdAndDelete(id)

        res.status(200).json({
            ok: true,
            event
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            ok: false,
            msg: 'algo no esta bien'
        })
    }
    res.json({
        ok: true,
        msg: 'deleteEvent'
    })
}



module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}