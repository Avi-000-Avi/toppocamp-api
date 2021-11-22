//Methods for each Routes
const ErrorResponse = require('../utils/errorResponse'); 
const Bootcamp  = require('../models/Bootcamps');
const asyncHandler = require('../middleware/async');

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//access Public
exports.getBootcamps = asyncHandler(async (req,res,next) => {

        const bootcamps = await Bootcamp.find();
        res
            .status(200)
            .json({success:true,count:bootcamps.length,data:bootcamps});
 });

//@desc Get a bootcamp
//@route GET /api/v1/bootcamps/:id
//access Public
exports.getBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        //Catch only works if the id is not formatted in the right way or not provided 
        //If the correctly formatted id does'nt exist in the database 
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
                );
        }

        res.status(200).json({success:true,data:bootcamp});
    
});

//@desc Create a new bootcamp
//@route POST /api/v1/bootcamps
//access Private - You have to send a token
exports.createBootcamp = asyncHandler(async (req,res,next) => {
   
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success:'true',
            data:bootcamp
        }); 
});

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//access Private
exports.updateBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        //Catch only works if the id is not formatted in the right way or not provided 
        //If the correctly formatted id does'nt exist in the database 
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
                );
        }

        res.status(201).json({
            success:'true',
            data:bootcamp
        }); 
    
 });

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access Private
exports.deleteBootcamp =asyncHandler( async (req,res,next) => {

        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
                );
        }


        res.status(201).json({
            success:'true',
            data:{}
        }); 
});