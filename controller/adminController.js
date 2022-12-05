const Student= require("../model/Student")
const MarkSheet = require("../model/MarkSheet")
const Admin = require("../model/Admin")

const JWT = require('jsonwebtoken')


exports.createStudent = (req, res) => {
    let {
        StudentID, 
        FirstName,
        LastName,
        DOB,
        Gender,
        Year
    } = req.body

    let student = new Student({
        StudentID, 
        FirstName,
        LastName,
        DOB,
        Gender,
        Year
    })

    student.save().then(()=>{
        return res.status(200).send("Student is successfully created registered!");
    }).catch((error)=>{
        console.log(error);
        return res.status(403).send("error occured*");
    })

    // try {
    //     let student = new Student({
    //         StudentID, 
    //         FirstName,
    //         LastName,
    //         DOB,
    //         Gender,
    //         Year
    //     });

    //     student.save();
    //     return res.status(200).send("Student is successfully created registered!");

    // } catch (error) {
    //     console.log(error);
    //     return res.status(403).send("error occured*");
    // }
}

exports.createAdmin = (req, res) => {
    let {
        AdminID,
        FirstName,
        LastName,
        DOB,
        Gender
    } = req.body;

    let admin = new Admin({
        AdminID,
        FirstName,
        LastName,
        DOB,
        Gender
    })
    console.log("till 2");
    admin.save().then(()=>{
        return res.status(200).send("Admin successfully Registered!");
    })
    .catch((error)=>{
        console.log(error);
        return res.status(403).send("Error!!!");
    })
}

exports.LoginAdmin = (req, res) => {
    let {
        AdminID
    } = req.body
    
    Admin.findOne({
        AdminID:AdminID
    }).then((user) => {

        const token = getToken(user);
        console.info("Login done");

        return res.status(200).send( token );
    }).catch((error)=>{
        return res.status(404).send(`$(AdminID) doesnt exist`);
    })
}

exports.createMarkList = (req, res)=>{
    let {
        StudentID,
        DSA,
        OperatingSystems,
        CompilerDesign,
        DatabaseManagement,
        ComputerNetworks,
    } = req.body

    let TotalMarks = (parseInt(DSA) + parseInt(OperatingSystems) + parseInt(CompilerDesign) + parseInt(DatabaseManagement) + parseInt(ComputerNetworks));
    let Percentage =  ( TotalMarks / 500 ) * 100

    Student.findOne({
        StudentID:StudentID
    }).then((student)=>{
        if(!student){
            return res.status(500).send(`Student with ID $(StudentID) does not exist in system!`)
        }

        let markSheet =  new MarkSheet({
            StudentID,
            DSA,
            OperatingSystems,
            CompilerDesign,
            DatabaseManagement,
            ComputerNetworks,
            TotalMarks,
            Percentage
        })

        markSheet.save().then(()=>{
            console.log("save")
            return res.status(200).send("MarkSheet created")
        }).catch((error)=>{
            console.log(error)
            return res.status(500).send("Cannot Insert Records")
        })
        
    }).catch((error)=>{
        return res.status(500).send(error)
    })

}

exports.updateAdmin = (req, res) => {
    let adminId = req.params.id
    let {
        FirstName,
        LastName
    } = req.body;
    Admin.updateOne({
            AdminID: adminId
        }, {
            $set: {
                FirstName,
                LastName
            }
        })
        .then((updateResult) => {

            console.info("Admin was successfully updated.");
            return res.status(200).send("Admin was successfully updated.");
        })
        .catch((error) => {
            console.error("There was an error while updating user.", error);
            return res.status(500).send("ERROR");
        });
};

exports.updateStudentRecord = (req, res) => {
    let studentId = req.params.id
    let {
        DSA,
        OperatingSystems,
        CompilerDesign,
        DatabaseManagement,
        ComputerNetworks,
        TotalMarks,
        Percentage
    } = req.body

    MarkSheet.updateOne({
        StudentID: studentId
    }, {
        $set:{
            DSA,
            OperatingSystems,
            CompilerDesign,
            DatabaseManagement,
            ComputerNetworks,
            TotalMarks,
            Percentage
        }
    }).then((updateResult)=>{
        console.info("Student information was successfully updated.");
        return res.status(200).send("Student information was successfully updated.");
    })
    .catch((error) => {
        console.error("There was an error while updating user.", error);
        return res.status(404).send("ERROR");
    });
}

exports.deleteStudentMarkSheet = (req, res, next) => {
    let studentId = req.params.id
    
    MarkSheet.deleteOne({ 
        studentID: studentId 
    })
    .then((student)=>{
        
        console.info("Student marksheet was successfully deleted.");
        return next();

    })
    .catch((error) => {
        console.error("There was an error while deleting marksheet.", error);
        return res.status(500).send("There was an error while deleting marksheet.");
    });
}

exports.deleteStudentRecord = (req, res) => {
    
    let studentId = req.params.id

    Student.deleteOne({ 
        StudentID: studentId 
    }).then(() => {

        console.info("Student record was successfully deleted.");
        return res.status(200).send("Record Deleted Successfully!!")

    })
    .catch((error) => {
        console.error("There was an error while deleting user.", error);
        return res.status(500).send("There was an error in deleting user.");
    });
}

const getToken = (admin)=>{
    return (token = JWT.sign({
        AdminID: admin.AdminID,
    },
    "HRS_Secret_Key", { expressIn:"10h"}));
}