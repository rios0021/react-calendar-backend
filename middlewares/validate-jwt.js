const {response} = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    const token =  req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No token in the petition'
        })
    }
    try {
        
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        )
        req.uid = payload.uid;
        req.name = payload.name;

        
        

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Invalid token'
        })
    }

    next();
}


module.exports = {
    validateJWT
}