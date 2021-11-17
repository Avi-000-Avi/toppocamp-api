//Methods for each Routes

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//access Public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success:'true',msg:'Show all bootcamps'});
}

//@desc Get a bootcamp
//@route GET /api/v1/bootcamps/:id
//access Public
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success:'true',msg:`Get Bootcamp ${req.params.id}`})
}

//@desc Create a new bootcamp
//@route POST /api/v1/bootcamps
//access Private - You have to send a token
exports.createBootcamp = (req,res,next) => {
    res.status(200).json({success:'true',msg:'Create new bootcamp'})
}

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//access Private
exports.updateBootcamp = (req,res,next) => {
    res.status(200).json({success:'true',msg:`Update bootcamp ${req.params.id}`})
}

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access Private
exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success:'true',msg:`Delete bootcamp ${req.params.id}`})
}