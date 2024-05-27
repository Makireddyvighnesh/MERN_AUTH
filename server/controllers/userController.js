import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import generateToken from '../utils/generateTokens.js';

// login user
const authUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    console.log(req.body);
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    } else{
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
    // res.status(200).json({message:"Auth user"});
});

const registerUser = asyncHandler(async(req, res) => {
    console.log(req.body);
    const {name, email,password} = req.body;
    const userEsists = await User.findOne({email:email});

    if(userEsists){
        res.status(400); // client side error
        throw new Error('User already exists');
    }

    const user = await User.create({
        name, email,password
    });

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    } else{
        res.status(400);
        throw new Error('Invalid User data');
    }

});

const logoutUser = asyncHandler(async(req, res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0),
    })
    res.status(200).json({message:"User Logged out"});
});

const getUserProfile = asyncHandler(async(req, res) => {
    console.log(req.user);
    const user = {
        id:req.user._id,
        name:req.user.name,
        email:req.user.email,
    };
    res.status(200).json(user);
})

const updateUserProfile = asyncHandler(async(req, res) => {
    console.log("Called");
    const user = await User.findById({_id:req.user._id});
    console.log(user);
    console.log(req.body);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password ;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
        })
    } else{
        res.status(404);
        throw new Error('User not found');
    }
})
export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};