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
    const { password, email } = req.body;

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
                        msg: "user has already been entered"
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
                email: email,
                password: hashedPassword,
            },
            vehicleInfo: [
                // {
                //     make: "",
                //     model: "",
                //     modelYear: "",
                //     vehicleType: "",
                //     vin: "",
                //     plateNumber: "",
                //     insuranceExpiryDate: "",
                //     color: "",
                //     mileageInformation: [
                //         {
                //             lastUpdated: "",
                //             lastMileage: "",
                //             oilChangeStartInterval: false,
                //             oilChangeInterval: "",
                //             _id: false
                //         }
                //     ],
                //     warrantyInfo: [
                //         {
                //             warrantyTitle: "",
                //             warrantyProvider: "",
                //             warrantyDetail: "",
                //             warrantyDate: "",
                //             _id: false
                //         }
                //     ]
                // }
            ]
        })

        user.save().then(savedUser => {
            return res.status(200).json(
                {
                    msg: "successfully registered"
                }
            )
        })
    }

    // check if user doesn't already exist
    // if user already exists, throw error
    // res.status 400 

    // const token = await JWT.sign({
    //     email
    // }, "fFAFASF@%@#$fsdaf2", {
    //     expiresIn: 360000
    // })

    //res.json(token);



})

router.post('/login', async (req, res) => {
    const { password, email } = req.body;
    let pw = ""

    let correctUser = true;

    await Vehicle.find({}).then(vehicle => {
        vehicle.forEach(d => {
            //console.log(d.userInfo[0].email);
            if (d.userInfo[0].email !== email) {
                correctUser = false;
            }

            if (d.userInfo[0].email === email) {
                pw = d.userInfo[0].password;
            }
        })
    })

    let isMatch = await bcrypt.compare(password, pw);

    const token = await JWT.sign({
        email
    }, "fFAFASF@%@#$fsdaf2", {
        expiresIn: 360000
    })

    if (!isMatch || !correctUser) {
        return res.status(400).json(
            {
                msg: "invalid credentials"
            }
        );
    } else {
        res.json(token);
    }

})

module.exports = router