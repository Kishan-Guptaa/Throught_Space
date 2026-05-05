import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeBlog = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes blog posts concisely.",
        },
        {
          role: "user",
          content: `Summarize this blog content: ${content}`,
        },
      ],
      max_tokens: 200,
    });

    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI summarization failed" });
  }
};

export const explainText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that explains complex concepts simply.",
        },
        {
          role: "user",
          content: `Explain this text simply: ${text}`,
        },
      ],
      max_tokens: 200,
    });

    res.json({ explanation: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI explanation failed" });
  }
};
