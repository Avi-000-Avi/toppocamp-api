//Methods for each Routes
const ErrorResponse = require('../utils/errorResponse'); 
const Bootcamp  = require('../models/Bootcamps');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//access Public
exports.getBootcamps = asyncHandler(async (req,res,next) => {
        let query;

        //Copy req.query
        const reqQuery = {...req.query}

        //Fields to exclude
        removeFields = ['select','sort'];

        //Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param=>delete reqQuery[param]);

        console.log(reqQuery);


        //Create query String
        let queryStr = JSON.stringify(reqQuery);


        //Create operators ($gt, $gte,etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        //Finding resource 
        query = Bootcamp.find(JSON.parse(queryStr));

        //Select fields
        if(req.query.select){
            const fields = req.query.select.split('.').join(' ');
            const query = query.select(fields);
        }

        //Sort fields
        if(req.query.sort){
            const fields = req.query.sort.split('.').join(' ');
            const query = query.sort(sortBy);
        }else{
            const query = query.sort('-createdAt');
        }

        //Executing Resource
        const bootcamps = await query;
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

//@desc Get Bootcamps within a radius 
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//access Private
exports.getBootcampsInRadius =asyncHandler( async (req,res,next) => {
    //Coming from the url
    const {zipcode,distance} = req.params;
    
    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calc radius using radians
    //Divide dist by radius of Earth
    // Earth Radius 3963 miles/ 6378 KM

    const radius = distance/3963;
    const bootcamps = await Bootcamp.find({
        location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
    });

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    })

});