import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
});

export async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
  const formData = new FormData();
  if (jobDescription) formData.append("jobDescription", jobDescription);
  if (resume) formData.append("resume", resume);
  if (selfDescription) formData.append("selfDescription", selfDescription);

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getInterviewReportById(interviewId) {
  const response = await api.get(`/report/${interviewId}`);
  return response.data;
}

export async function getAllInterviewReports() {
  const response = await api.get("/");
  return response.data;
}

export async function getResumePdf(interviewReportId) {
  const response = await api.get(`/resume/pdf/${interviewReportId}`, {
    responseType: "blob"
  });
  return response.data;
}


