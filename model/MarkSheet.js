const mongoose = require('mongoose')

const MarkSheet = mongoose.Schema({
    StudentID:{
        type: String,
        unique: true,
        require: true
    },
    DSA:{
        type: Number,
        default: 0
    },
    OperatingSystems:{
        type: Number,
        default: 0
    },
    CompilerDesign:{
        type: Number,
        default: 0
    },
    DataBaseManagement:{
        type: Number,
        default: 0
    },
    ComputerNetworks:{
        type: Number,
        default: 0
    },
    TotalMarks:{
        type: Number
    },
    Percentage:{
        type: Number
    }
})