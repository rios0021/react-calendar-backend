const { response } = require("express")
const Event = require('../models/Event');

const getEvents = async(req, res = response) => {

    const events = await Event.find().populate('user','name');
    res.status(200).json({
        ok:true,
        events
    })
};

const createEvent = async (req, res = response) => {
    
    const event  = new Event(req.body);
    try {
        event.user= req.uid;
        const savedEvent = await event.save()
        res.status(200).json({
            ok:true,
            event: savedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Contact the admin'
        });
    }
    
    res.status(200).json({
        ok:true,
        msg: "createEvents"
    })
}

const updateEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event = await Event.findById(eventId);
        
        if(!event){
            res.status(400).jsont({
                ok: false,
                msg: 'No event with that id'
            })
        }
        
        if(event.user.toString() !== uid){
            res.status(401).jsont({
                ok: false,
                msg: 'No privileges to edit this event'
            });
        }
        
        const newEvent = {
            ...req.body,
            user: uid
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new:true});

        res.status(200).json({
            ok:true,
            event: updatedEvent
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Contact the admin'
        });
    }
    
}
const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        
        const event = await Event.findById(eventId);
        
        if(!event){
            res.status(400).jsont({
                ok: false,
                msg: 'No event with that id'
            })
        }
        
        if(event.user.toString() !== uid){
            res.status(401).jsont({
                ok: false,
                msg: 'No privileges to edit this event'
            });
        }
        
        await Event.findByIdAndDelete(eventId, {new:true})
        res.status(200).json({
            ok:true,
        });
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Contact the admin'
        });
    }
}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}