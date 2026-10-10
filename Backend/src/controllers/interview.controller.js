const InterviewReport = require("../models/InterviewReport.model");
const pdfParse = require("../utils/pdfParser");
const { generateInterviewReport, generateResumePdf } = require("../../services/ai.service");

async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;

    const resumeContent = resumeFile ? await pdfParse(resumeFile.buffer) : "";
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription
    });

    const interviewReport = await InterviewReport.create({
      user: req.user._id || req.user.id,
      jobDescription,
      resume: resumeContent,
      selfDescription,
      ...interviewReportByAi
    });

    return res.status(201).json({
        message: "Interview report generated successfully",
      success: true,
      data: interviewReport
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate interview report"
    });
  }
}


/**
 * 
 * 
 * @description fetch details of a specific interview report by its ID. The report is fetched only if it belongs to the currently authenticated user.
 * @route GET /api/interview/:interviewId
 * @access private
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const interviewId = req.params.interviewId ? req.params.interviewId.trim() : null;
    const userId = req.user._id || req.user.id;

    const interviewReport = await InterviewReport.findOne({ _id: interviewId, user: userId });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully.",
      interviewReport
    });
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interview report"
    });
  }
}


/**
 * 
 * @description fetch all interview reports of the currently authenticated user.
 * @route GET /api/interview/
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const interviewReports = await InterviewReport.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -updatedAt -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
      success: true,
      message: "All interview reports fetched successfully.",
      interviewReports
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interview reports"
    });
  }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @access private
 */
async function generateResumePdfController(req, res) {
  try {
    const interviewReportId = req.params.interviewReportId ? req.params.interviewReportId.trim() : null;
    const userId = req.user._id || req.user.id;

    const interviewReport = await InterviewReport.findOne({ _id: interviewReportId, user: userId });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found."
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const resumePdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription
    });

    res.set("Content-Type", "application/pdf");
    res.send(resumePdfBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate resume PDF"
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};

