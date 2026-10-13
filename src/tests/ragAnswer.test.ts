import { describe, it, expect, vi, beforeEach } from "vitest";
import { ragAnswer } from "../utils/ragAnswer";

// Mock external dependencies
vi.mock("../client/openia.ts", () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock("../utils/embed", () => ({
  embed: vi.fn(),
}));

vi.mock("../utils/buildRagPrompt", () => ({
  buildRagPrompt: vi.fn(),
}));

import { openai } from "../client/openia.ts";
import { embed } from "../utils/embed";
import { buildRagPrompt } from "../utils/buildRagPrompt";
import type { VectorRepository } from "../vectorRepository";

const mockEmbed = vi.mocked(embed);
const mockBuildRagPrompt = vi.mocked(buildRagPrompt);
const mockCreate = vi.mocked(openai.chat.completions.create);

function makeRepo(chunks: string[] = ["chunk 1", "chunk 2"]): VectorRepository {
  return {
    load: vi.fn().mockResolvedValue(chunks.map((chunk) => ({ chunk, score: 0.9 }))),
  } as unknown as VectorRepository;
}

describe("ragAnswer", () => {
  const QUESTION = "What is RAG?";
  const EMBEDDING = [0.1, 0.2, 0.3];
  const PROMPT = "built prompt";
  const ANSWER = "RAG is Retrieval-Augmented Generation.";

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmbed.mockResolvedValue(EMBEDDING);
    mockBuildRagPrompt.mockReturnValue(PROMPT);
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: ANSWER } }],
    } as any);
  });

  it("embeds the question", async () => {
    await ragAnswer(QUESTION, makeRepo());
    expect(mockEmbed).toHaveBeenCalledWith(QUESTION);
  });

  it("loads chunks from the repo using the question embedding", async () => {
    const repo = makeRepo();
    await ragAnswer(QUESTION, repo);
    expect(repo.load).toHaveBeenCalledWith(EMBEDDING);
  });

  it("builds the prompt with the question and retrieved chunks", async () => {
    await ragAnswer(QUESTION, makeRepo(["chunk 1", "chunk 2"]));
    expect(mockBuildRagPrompt).toHaveBeenCalledWith(QUESTION, ["chunk 1", "chunk 2"]);
  });

  it("calls OpenAI with the built prompt as system message", async () => {
    await ragAnswer(QUESTION, makeRepo());
    expect(mockCreate).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: PROMPT }],
    });
  });

  it("returns the model response content", async () => {
    const result = await ragAnswer(QUESTION, makeRepo());
    expect(result).toBe(ANSWER);
  });

  it("returns fallback when model content is null", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    } as any);
    const result = await ragAnswer(QUESTION, makeRepo());
    expect(result).toBe("I don't know.");
  });

  it("returns fallback when choices array is empty", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: {} }],
    } as any);
    const result = await ragAnswer(QUESTION, makeRepo());
    expect(result).toBe("I don't know.");
  });
});
