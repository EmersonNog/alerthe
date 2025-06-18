// geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Substitua pela sua chave da API Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function generateTechnicalAnalysisAI(
  ocorrenciasResumo: string
): Promise<string> {
  const prompt = `
Você é um engenheiro técnico da prefeitura. Com base nos dados a seguir, redija apenas dois parágrafo claro e objetivo (sem título), com até 10 linhas. O texto será usado diretamente sob a label "Análise Técnica" em um relatório oficial.

Dados por categoria:
${ocorrenciasResumo}

Descreva quais categorias foram mais críticas, se houve baixa demanda, ou ausência de dados. Finalize com uma recomendação técnica para a prefeitura.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
