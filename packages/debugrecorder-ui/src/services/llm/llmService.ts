import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export type LLMProvider = "gpt-3.5-turbo" | "gemini-2.0-flash" | "gemma-7b-it";

interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
}

export class LLMService {
  private model: ChatOpenAI | ChatGoogleGenerativeAI;

  constructor(config: LLMConfig) {
    if (config.provider === "gpt-3.5-turbo") {
      this.model = new ChatOpenAI({
        openAIApiKey: config.apiKey,
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
      });
    } else if (config.provider === "gemma-7b-it") {
      this.model = new ChatGoogleGenerativeAI({
        apiKey: config.apiKey,
        model: "gemma-7b-it",
        maxOutputTokens: 2048,
        temperature: 0.7,
      });
    } else {
      this.model = new ChatGoogleGenerativeAI({
        apiKey: config.apiKey,
        model: "gemini-2.0-flash",
        maxOutputTokens: 2048,
        temperature: 0.7,
      });
    }
  }

  async getResponse(userMessage: string, debugContext: { 
    currentFile: string;
    currentLine: number;
    variables: Record<string, string>;
  }) {
    const systemPrompt = `You are an AI debugging assistant analyzing Python code.
Current file: ${debugContext.currentFile}
Current line: ${debugContext.currentLine}
Current variable values: ${JSON.stringify(debugContext.variables, null, 2)}

Provide concise and helpful debugging insights based on the current execution state.`;

    const response = await this.model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userMessage)
    ]);

    return response.content;
  }
}