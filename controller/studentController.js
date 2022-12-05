const Student = require("../model/Student")
const MarkSheet = require("../model/MarkSheet")
const JWT = require("jsonwebtoken")

exports.LoginStudent = (req, res)=>{
    let { StudentID }= req.body
    
    Student.findOne({ 
        StudentID:StudentID 
    })
    .then((student)=>{

        const token = getToken(student);

        console.info("login done");
        return res.status(200).send({token});
      
    }).catch(()=>{
        return res.status(404).send(`${StudentID} doesnt exist`);
    })

}

exports.getStudentData = (req, res, next) => {
    
    const decodeToken = JWT.verify(req.headers.token, "HRS_Secret_Key");
    
    Student.findOne({
        StudentID: decodeToken.StudentID
    })
    .then((student)=>{
        res.locals.student = student;
        return next();
    })
    .catch((error)=>{
        return res.status(500).send(error);
    })

}

exports.getStudentMarkList = (req, res)=>{
    
    const decodeToken = JWT.verify(req.headers.token, "HRS_Secret_Key");

    MarkSheet.findOne({
        StudentID: decodeToken.StudentID
    })
    .then((markSheet)=>{
        // {
        student = res.locals.student
        return res.status(200).send({student,markSheet})
        // }
    })
    .catch((error)=>{
      return res.status(500).send(error)
    })

}


exports.updateStudent = (req, res)=>{
    const decodeToken = JWT.verify(req.headers.token, "HRS_Secret_Key");

    let {
        FirstName,
        LastName,
        DOB,
        Gender,
        Year
    } = req.body;

    Student.updateOne({
        StudentID: decodeToken.StudentID
    },
    {
        $set:{
            FirstName, LastName, DOB, Gender, Year
        }
    })
    .then((updateResult)=>{
        console.info("Student information was successfully updated.");
        return res.status(200).send("Student information was successfully updated.");
    })
    .catch((error)=>{
        console.error("There was an error while updating user.", error);
        return res.status(500).send("ERROR");
    })

}

exports.results = (req, res)=>{
    const decodeToken = JWT.verify(req.headers.token,"HRS_Secret_Key");

    let q = (Object.keys(req.key))
    console.log(q)
    q1 = q[0];
    console.log(q1)
    var object = q.reduce(
        (obj, item) => Object.assign(obj, { [item]:1 })
    ,{})

    let newObj = {'_id':0, ...object};
    projection = newObj;
    console.log(projection)

    MarkSheet.findOne({ StudentID: decodeToken.StudentID }, projection)
    .then((student)=>{
        return res.status(200).send(student)
    })
    .catch((error)=>{
        return res.status(500).send(error)
    })
}

const getToken = (student) => {
    return (token = JWT.sign({
            StudentID: student.StudentID,
        },
        "HRS_Secret_Key", {
            expiresIn: "10h",
        }
    ));
};