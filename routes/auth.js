const router = require("express").Router();
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const Vehicle = require('../models/vehicle');
const JWT = require("jsonwebtoken")


router.post("/signup", [
    check("email", "Please enter a valid email!")
        .isEmail(),
    check("password", "Please provide a password that is greater than 5 characters!")
        .isLength(
            {
                min: 6
            }
        )
], async (req, res) => {
    const { password, email, firstName, lastName } = req.body;
    const errors = validationResult(req);
    let proceed = true;

    if (!errors.isEmpty()) {
        let errMsg = [];

        errors.array().forEach(d => {
            errMsg.push(d.msg);
        })
        return res.status(400).json(
            {
                msg: errMsg
            }
        )
    }

    await Vehicle.find({}).then(data => {
        data.forEach(d => {
            //console.log(d.userInfo[0].email);
            if (d.userInfo[0].email === email) {
                proceed = false;
                return res.status(400).json(
                    {
                        msg: "User has already been entered!"
                    }
                );
            }
        })
    })

    if (proceed) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Vehicle({
            userInfo:
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
            },
            vehicleInfo: []
        })

        user.save().then(savedUser => {
            return res.status(200).json(
                {
                    msg: "Successfully registered!"
                }
            )
        })
    }

})

router.post('/login', async (req, res) => {
    const { password, email } = req.body;
    let pw = ""
    let id = ""
    //let correctUser = true;

    await Vehicle.find({}).then(vehicle => {
        vehicle.forEach(d => {

            if (d.userInfo[0].email === email) {
                pw = d.userInfo[0].password;
                id = d.id
            }
        })
    })

    let isMatch = await bcrypt.compare(password, pw);

    const token = await JWT.sign({
        email
    }, process.env.KEY, {
        expiresIn: 360000
    })

    //console.log(isMatch, correctUser)

    if (!isMatch) {
        return res.status(400).json(
            {
                msg: "Invalid credentials!"
            }
        );
    } else {
        res.json({token, id});
    }

})

module.exports = router