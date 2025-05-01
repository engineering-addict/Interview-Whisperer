import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import interviewPrompt from "../../../../prompt.txt?raw";
class AiService {
  private _interviewPrompt: string | null = null;

  private async getInterviewPrompt() {
    if (this._interviewPrompt) {
      return this._interviewPrompt;
    }

    const prompt = interviewPrompt;

    this._interviewPrompt = prompt;

    return prompt;
  }

  async getSolutionFromScreenshot(
    screenshot: Buffer,
    language: string,
    apiKey: string
  ) {
    const imageBase64 = screenshot.toString("base64");

    const prompt = await this.getInterviewPrompt();

    const openai = createOpenAI({
      apiKey,
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        thoughts: z.array(z.string()),
        code: z.string(),
        complexity: z.object({
          time: z.string(),
          space: z.string(),
        }),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "text",
              text: `Language: ${language}`,
            },
            {
              type: "image",
              image: `data:image/png;base64,${imageBase64}`,
            },
          ],
        },
      ],
    });

    return object;
  }
}

const aiService = new AiService();

export { aiService };
