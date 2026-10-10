const { PDFParse } = require("pdf-parse");

/**
 * Extracts text from a PDF buffer using pdf-parse
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} extracted text
 */
async function extractTextFromPDF(buffer) {
    try {
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        await parser.destroy();
        return textResult.text || "";
    } catch (error) {
        console.error("PDF Parsing error:", error);
        throw new Error("Failed to parse PDF file: " + error.message);
    }
}

module.exports = extractTextFromPDF;
