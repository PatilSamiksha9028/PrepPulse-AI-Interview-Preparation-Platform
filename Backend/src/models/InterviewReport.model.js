const mongoose = require("mongoose");

const TechnicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, { _id: false });

const BehavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, { _id: false });

const SkillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    }
}, { _id: false });

const PreparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [
        {
            type: String,
            required: [true, "Task is required"]
        }
    ]
}, { _id: false });

const InterviewReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        jobDescription: {
            type: String,
            required: [true, "Job description is required"]
        },
        resume: {
            type: String
        },
        selfDescription: {
            type: String
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100
        },
        technicalQuestions: [TechnicalQuestionSchema],
        behavioralQuestions: [BehavioralQuestionSchema],
        skillGaps: [SkillGapSchema],
        preparationPlan: [PreparationPlanSchema],
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        title: {
            type: String,
            required: [true, "Title is required"]
        }
    },
    {
        timestamps: true
    }
);

const InterviewReport = mongoose.model("InterviewReport", InterviewReportSchema);
module.exports = InterviewReport;

