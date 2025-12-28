
import { GoogleGenAI, Type } from "@google/genai";
import { Building, Unit, Tenant, Expense } from '../types';

/**
 * Generates structured portfolio insights using Gemini 3 Flash.
 * Uses responseSchema for consistent JSON output as per SDK best practices.
 */
export const getPropertyInsights = async (data: {
  buildings: Building[],
  units: Unit[],
  tenants: Tenant[],
  expenses: Expense[]
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a professional Property Management AI, analyze this data and provide 3 brief, actionable insights.
    
    Data Summary:
    - Total Buildings: ${data.buildings.length}
    - Total Units: ${data.units.length}
    - Vacant Units: ${data.units.filter(u => u.status === 'Vacant').length}
    - Recent Expenses: $${data.expenses.reduce((sum, e) => sum + e.amount, 0)}
    
    Buildings List: ${data.buildings.map(b => b.name).join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Short headline of the insight.",
              },
              description: {
                type: Type.STRING,
                description: "Detailed actionable advice.",
              },
              type: {
                type: Type.STRING,
                description: "Visual category: warning, info, or success.",
              },
            },
            required: ["title", "description", "type"],
            propertyOrdering: ["title", "description", "type"],
          },
        },
      }
    });

    // Directly access the .text property (not a method)
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [
      { title: "Occupancy Check", description: "Review units in maintenance to minimize downtime.", type: "info" }
    ];
  }
};

/**
 * Concisely answers user questions about the portfolio using Gemini 3 Flash.
 */
export const askAssistant = async (question: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Context: ${context}\n\nUser Question: ${question}`,
    config: {
      systemInstruction: "You are PropTrack AI, a helpful property management assistant. Keep answers concise and professional."
    }
  });
  // Use .text property as per guidelines
  return response.text;
};
