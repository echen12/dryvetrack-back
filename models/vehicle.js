const mongoose = require('mongoose');

const url = "mongodb+srv://fleetcare-user:Edmo1508@cluster0.ltn6m.mongodb.net/userVehicles?retryWrites=true&w=majority"

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const vehicleSchema = new mongoose.Schema({
    userInfo: [
        {
            email: String,
            password: String,
        }
    ],
    vehicleInfo: []
})

vehicleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Vehicle', vehicleSchema)