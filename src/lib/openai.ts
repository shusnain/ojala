import OpenAI from "openai";

export const openai = new OpenAI();

// gpt-4o-mini supports both text and vision (multimodal)
export const DEFAULT_MODEL = "gpt-4o-mini";
export const DEFAULT_TEMPERATURE = 0.7;
