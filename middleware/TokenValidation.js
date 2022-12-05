const JWT = require("jsonwebtoken");
const Admin = require("../model/Admin");
const Student = require("../model/Student");


//any admin can add a student
exports.canAddStudent = (req,res,next)=>{
    try{
        if(!req.headers.token){
            console.error("No token was sent");
            return res.status(403).send("Invalid token");
        }

        const decodeToken = JWT.verify(req.headers.token, "HRS_Secret_Key");
        if( decodeToken.AdminID ){
            return next();
        }

        console.warn("User sent suspicious token!");
        return res.status(417).send("Please send valid token!");

    }catch(error){
        console.error("Token Validation failed.");
        return res.status(401).send("Token invalid.");
    }
};

//a admin can only edit his/her details
exports.canEditAdmin = (req, res, next)=>{
    try {
        console.log("abc abc")
        if(!req.headers.token){
            console.error("No token was sent");
            return res.status(403).send("Invalid token");
        }

        const decodeToken = JWT.verify(req.headers.token,"HRS_Secret_Key");

        Admin.findOne({
            AdminID: decodeToken.AdminID
        })
        .then((admin)=>{
            if(!admin){
                console.warn("User sent suspicious token!");
                return res.status(417).send("Please send valid token!");
            }
            {
                console.log("canEditAdmin")
                return next();
            }
        }).catch((error)=>{
            return res.status(500).send(error)
        })

     } catch (error) {
        console.error("Token Validation failed.");
        return res.status(401).send("Token invalid.");
    }
};

//token verification for student
exports.canViewStudent = (req, res, next)=>{
    try {
        if(!req.headers.token){
            console.error("No token was sent");
            return res.status(403).send("No token was sent!");
        }
        const decodeToken = JWT.verify(req.headers.token,"HRS_Secret_Key");

        Student.findOne({ StudentId: decodeToken.StudentID })
        .then((student)=>{
            if(!student){
                console.warn("User sent suspicious token!");
                return res.status(417).send("Please send valid token!");
            }
            {
                return next();
            }
        })
        .catch((error)=>{
            return res.status(500).send(error);
        })

    } catch (error) {
        console.error("Token Validation failed.");
        return res.status(401).send("Token invalid.");
    }
};