import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export type LLMProvider = "gpt-3.5-turbo" | "gemini-2.0-flash" | "gemma-7b-it";

interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
}

interface DebugContext {
  currentFile: string;
  currentLine: number;
  variables: Record<string, string>;
  executionHistory: Array<{
    ts: number;
    filename: string;
    line_no: number;
    locals: Record<string, string>;
  }>;
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

  async getResponse(userMessage: string, debugContext: DebugContext) {
    const executionSummary = debugContext.executionHistory.map((event, idx) => 
      `Step ${idx + 1}: Line ${event.line_no} - Variables: ${JSON.stringify(event.locals)}`
    ).join('\n');

    const systemPrompt = `You are an AI debugging assistant analyzing Python code.

    Each step in the Execution/Events history is an object with these fields:
    - "ts": a UNIX timestamp with fractional seconds (e.g., 1745761854.2129276). You can compute time differences between steps by subtracting their 'ts' values.
    - "filename": the full file path of the executed code.
    - "line_no": the line number being executed at this step.
    - "locals": a dictionary of local variable names and their values at that step.
    
    Current file: ${debugContext.currentFile}
    Current line: ${debugContext.currentLine}
    Current variable values: ${JSON.stringify(debugContext.variables, null, 2)}
    
    Execution/Events history: 
    ${executionSummary}
    
    Use the timestamps to calculate time taken between steps if relevant. 
    Track how variables changed over time to understand the flow and identify bugs or issues.

    Using this execution history, you can see how variables changed over time and track the program's flow.    
    Provide concise and helpful debugging insights based on the current execution state and history.`;
    

    const response = await this.model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userMessage)
    ]);

    return response.content;
  }
}