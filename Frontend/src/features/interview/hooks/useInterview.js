import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {

  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resume: resumeFile });
      const createdReport = response.data || response.interviewReport;
      setReport(createdReport);
      return createdReport;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

    const getReportById = async (interviewId) => {
    setLoading(true)
    try {
      const response = await getInterviewReportById(interviewId)
      setReport(response.interviewReport)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
}

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      const list = response.interviewReports || response.data || [];
      setReports(list);
      return list;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports
  }

}