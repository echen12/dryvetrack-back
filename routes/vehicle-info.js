const router = require("express").Router();
const Vehicle = require("../models/vehicle");
const checkAuth = require("../middleware/checkAuth")

router.get("/vehicle-info", checkAuth, async (req, res) => {
    //console.log(req.email);
    await Vehicle.find({}).then(data => {
        res.json({ data: data, user: req.email });
    })
})

// // get individual vehicle details
// router.get("/vehicle-info/:id", checkAuth, async (req, res) => {
//     const veh = await Vehicle.findById(req.params.id);
//     console.log(veh)
// })

router.post("/add-vehicle", checkAuth, async (req, res) => {
    const id = req.body.id
    //console.log("ID " + req.body.id)
    //console.log(req.body)
    // await Vehicle.findOneAndUpdate(id,{test: "tet"}).then(res => {
    //     //console.log(res)
    //     //res.json(req.body)
    // })

    const veh = await Vehicle.findById(id);

    veh.vehicleInfo = req.body.allVehicles

    await veh.save();
    res.json(veh)

    console.log("vehicle successfully saved")

})

router.put("/update-vehicle/:id", checkAuth, async (req, res) => {
    const veh = await Vehicle.findById(req.body.userId);
    veh.vehicleInfo = req.body.obj
    await veh.save();
    res.json(veh)
})

router.put("/delete-vehicle", checkAuth, async (req, res) => {
    const veh = await Vehicle.findById(req.body.userId);
    veh.vehicleInfo = req.body.obj
    await veh.save();
    res.json(veh)
})

module.exports = router;     