const jwt = require('jsonwebtoken');
const Subscribe = require('../models/subscribes');
module.exports = {
    subscribe: async (req, res) => {
        try {
            const { email, name } = req.body;
            const subscribe = new Subscribe({ email, name });
            const result = await subscribe.save();
            res.status(201).send(result);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
        
    },
};