const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:"Hello Gemini, What is Interview ?"
    });
    console.log(response.text);
}
    
const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score indicating how well the candidate's resume and self-description align with the job description."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question asked during the interview."),
        intention: z.string().describe("The intention behind the technical question."),
        answer: z.string().describe("How to answer this question ,what is point to cover,what is approach")
    })).describe("A list of technical questions asked during the interview, along with their intentions and suggested answers."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question asked during the interview."),
        intention: z.string().describe("The intention behind the behavioral question."),
        answer: z.string().describe("How to answer this question ,what is point to cover,what is approach")
    })).describe("A list of behavioral questions asked during the interview, along with their intentions and suggested answers."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, indicating how critical it is for the candidate to improve in this area.")
    })).describe("A list of skills that the candidate is lacking, along with descriptions of each gap."),
    preparationPlan: z.array(z.object({
       day: z.number().describe("The day number in the preparation plan."),
       focus: z.string().describe("The main focus or topic for that day."),
       tasks: z.array(z.string()).describe("A list of tasks or activities to be completed on that day.")
    })).describe("A list of steps and resources that the candidate can use to prepare for future interviews."),
    title: z.string().describe("The title of the interview report.")
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    // Prompt is defined inside the function so it can access the parameters
    const prompt = `
Generate an interview report based on the following information:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3-flash-preview"];
    let lastError;

    for (const model of candidateModels) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: z.toJSONSchema(interviewReportSchema)
                }
            });

            return JSON.parse(response.text);
        } catch (err) {
            lastError = err;
            console.warn(`[AI Service] Model ${model} failed (${err?.message || err}), trying next candidate...`);
        }
    }

    throw lastError;
}

const puppeteer = require("puppeteer");

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4" });
        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any HTML to PDF converter.")
    });

    const prompt = `Generate resume for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        the response should be a JSON object with a single field "html" which contains the HTML content of the resume.`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3-flash-preview"];
    let lastError;

    for (const model of candidateModels) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumePdfSchema),
                }
            });

            const parsed = JSON.parse(response.text);
            const pdfBuffer = await generatePdfFromHtml(parsed.html);
            return pdfBuffer;
        } catch (err) {
            lastError = err;
            console.warn(`[AI Service] generateResumePdf with model ${model} failed:`, err?.message || err);
        }
    }

    throw lastError;
}

module.exports = {
    invokeGeminiAi,
    generateInterviewReport,
    generateResumePdf,
    generatePdfFromHtml
};