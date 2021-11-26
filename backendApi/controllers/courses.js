//Methods for each Routes
const ErrorResponse = require('../utils/errorResponse'); 
const Course  = require('../models/Course');
const Bootcamp  = require('../models/Bootcamps');

const asyncHandler = require('../middleware/async');

//@desc Get all Courses
//@route Get /api/v1/courses
//@route Get /api/v1/bootcamps/:bootcampId/courses
//access Public
exports.getCourses = asyncHandler(async (req,res,next) => {
        let query;

        if(req.params.bootcampId){
            query = Course.find({bootcamp:req.params.bootcampId});
        }else {
            query = Course.find().populate({
                path:'bootcamp',
                select:'name description'
            })
        }

        const  courses = await query;

        res.status(200).json({
            success:true,count:courses.length,data:courses});
 });


//@desc Get all Courses
//@route Get /api/v1/courses/:id
//access Public
exports.getCourse = asyncHandler(async (req,res,next) => {
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!course){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),404);
    }
    res.status(200).json({
        success:true,data:course});
});

//@desc Add Courses
//@route Get /api/v1/bootcamps/:bootcampId/courses
//access Private
exports.addCourse = asyncHandler(async (req,res,next) => {
    //Save in courses model in bootcamp field
    req.body.bootcamp =  req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),404);
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success:true,data:course});
});

//@desc Update Course
//@route Get /api/v1/courses/:id
//access Private
exports.updateCourse = asyncHandler(async (req,res,next) => {
    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),404);
    }

    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,data:course});
});

//@desc Delete Course
//@route Get /api/v1/courses/:id
//access Private
exports.deleteCourse = asyncHandler(async (req,res,next) => {
    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),404);
    }

    await course.remove();

    res.status(200).json({
        success:true,data:course});
});
