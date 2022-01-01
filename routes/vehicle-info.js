const router = require("express").Router();
const Vehicle = require("../models/vehicle");
const checkAuth = require("../middleware/checkAuth")

router.get("/vehicle-info", checkAuth, async (req, res) => {
    await Vehicle.findById(req.query.key).then(data => {
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
    const vehData = req.body.obj
    //console.log(id)
    //console.log("ID " + req.body.id)
    //console.log(req.body)
    // await Vehicle.findOneAndUpdate(id,{test: "tet"}).then(res => {
    //     //console.log(res)
    //     //res.json(req.body)
    // })

    const veh = await Vehicle.findById(id);

    veh.vehicleInfo = vehData

    await veh.save();
    res.json(veh)

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