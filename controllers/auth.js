const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generateJWT} = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    const {name, email, password} = req.body;
    
    try {
        let user = await User.findOne({email: email});
        
        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'Email is already registered'
            })
        }
        user = new User(req.body);
        
        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        
        await user.save();
        const token  = generateJWT(user.id, user.name);
        res.status(201).json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact admin'
        })
    }
    
}
const loginUser = async(req, res = response) => {
    const {email, password} = req.body;
    try {
        
        let user = await User.findOne({email: email});
        
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'There is no register with that email'
            })
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Wrong password'
            });
        }

        // Generate JWT
        const token  = await generateJWT(user.id, user.name);
        res.json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact admin'
        })
    }
}
const renewToken = async(req, res = response) => {
    try {
        
        const uid = req.uid;
        const name = req.name;
        const token  = await generateJWT(uid, name);
        res.json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact admin'
        })
    }
}


module.exports  = {
    createUser,
    loginUser,
    renewToken
}