import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || (import.meta.env.DEV ? "http://localhost:3000" : ""),
  withCredentials: true,
});

/**
 * @description generate new interview report on the basis of user self description, resume, and job description.
 * @route POST /api/interview/
 * @access private
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData()
  formData.append("jobDescription", jobDescription)
  formData.append("selfDescription", selfDescription)
  formData.append("resume", resumeFile)

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

/**
 * @description fetch details of a specific interview report by its ID. The report is fetched only if it belongs to the currently authenticated user.
 * @route GET /api/interview/:interviewId
 * @access private
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`)

  return response.data
}

/**
 * @description fetch all interview reports of the logged in user.
 * @route GET /api/interview/
 * @access private
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/")

  return response.data
}