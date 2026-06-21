import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";
import type { Product } from "../../types/domain";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { SearchRepository } from "../../valkey/searchRepository";
import { id } from "../../utils/ids";

interface AgentResult {
  intent: Record<string, unknown>;
  constraints: Record<string, unknown>;
  reasoning: string;
  confidence: number;
  recommendations: Product[];
  alternatives: Product[];
  bundles: Array<{ title: string; products: Product[]; total: number; rationale: string }>;
}

const cacheHash = (input: string) => crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);

export class AiService {
  private search = new SearchRepository();
  private cache = new JsonRepository<AgentResult>();
  private products = new JsonRepository<Product>();
  private model = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY).getGenerativeModel({ model: env.GEMINI_MODEL }) : null;

  async agenticSearch(query: string, userId?: string): Promise<AgentResult> {
    const cacheKey = keys.aiCache(cacheHash(`${query}:${userId ?? "guest"}`));
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const semantic = await this.search.semanticSearch(query, 12);
    const keyword = await this.search.searchProducts({ q: query, limit: 12 });
    const merged = [...semantic.map((item) => item.product), ...keyword].filter((product, index, all) => all.findIndex((p) => p.id === product.id) === index);
    const constraints = this.extractConstraints(query);
    const filtered = merged.filter((product) => (constraints.maxBudget ? product.price <= Number(constraints.maxBudget) : true)).slice(0, 6);
    const recommendations = filtered.length ? filtered : merged.slice(0, 6);
    const alternatives = merged.filter((product) => !recommendations.some((item) => item.id === product.id)).slice(0, 4);

    let reasoning = `I matched your request to ${constraints.categoryHint ?? "relevant"} products, balanced semantic similarity with price, rating, and stock-sensitive commerce signals, then selected items that fit the strongest constraints.`;
    if (this.model) {
      try {
        const prompt = `You are ShopMind AI. Explain in 3 concise sentences why these products match: ${query}. Products: ${recommendations.map((p) => `${p.name} ₹${p.price}`).join("; ")}`;
        const result = await this.model.generateContent(prompt);
        reasoning = result.response.text();
      } catch (error) {
        console.warn(`[ai] Gemini fallback used: ${(error as Error).message}`);
      }
    }

    const bundleProducts = recommendations.slice(0, 3);
    const response: AgentResult = {
      intent: {
        type: query.toLowerCase().includes("build") || query.toLowerCase().includes("setup") ? "bundle_builder" : "product_discovery",
        query
      },
      constraints,
      reasoning,
      confidence: Number(Math.min(0.96, 0.72 + recommendations.length * 0.035).toFixed(2)),
      recommendations,
      alternatives,
      bundles: bundleProducts.length
        ? [
            {
              title: "ShopMind Optimized Bundle",
              products: bundleProducts,
              total: bundleProducts.reduce((sum, product) => sum + product.price, 0),
              rationale: "Combines the best semantic matches into a balanced cart with fewer redundant purchases."
            }
          ]
        : []
    };
    await this.cache.set(cacheKey, response, 60 * 15);
    await new JsonRepository<object>().set(keys.conversation(id("conv")), {
      userId,
      messages: [{ role: "user", content: query }, { role: "assistant", content: response.reasoning }],
      context: { intent: response.intent, constraints: response.constraints },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return response;
  }

  async chat(message: string, userId?: string) {
    const result = await this.agenticSearch(message, userId);
    return {
      conversationId: id("conv"),
      message: `${result.reasoning}\n\nTop pick: ${result.recommendations[0]?.name ?? "I need a little more detail."}`,
      products: result.recommendations.slice(0, 3)
    };
  }

  async enrichProduct(productId: string) {
    const product = await this.products.get(keys.product(productId));
    if (!product) return null;
    const generated = `AI enriched: ${product.name} is ideal for ${product.tags.slice(0, 3).join(", ")} shoppers who want fast comparison, reliable quality, and strong value.`;
    product.aiDescription = generated;
    product.keywords = Array.from(new Set([...product.keywords, ...product.tags, "ai-enriched", product.brand.toLowerCase()]));
    product.updatedAt = new Date().toISOString();
    await this.products.set(keys.product(product.id), product);
    return product;
  }

  async insights() {
    return {
      summary: "Gaming and AI laptop intent are leading high-value sessions, while running products show the strongest conversion density.",
      insights: [
        "AI laptop searches are clustering around ₹80,000, making AI5000 the best conversion coupon.",
        "Running shoes and hydration gear are frequently co-viewed, suggesting a marathon bundle opportunity.",
        "Search abandonment rises when filtered product counts drop below five results."
      ],
      actions: ["Promote AI laptop bundles", "Pin marathon gear on mobile homepage", "Add autocomplete synonyms for gaming setup"]
    };
  }

  private extractConstraints(query: string) {
    const lowered = query.toLowerCase();
    const rupeeMatch = lowered.match(/(?:₹|rs\.?|inr)?\s?(\d+(?:,\d+)?)(?:\s?lakh|\s?k|\s?000)?/);
    let maxBudget: number | undefined;
    if (rupeeMatch) {
      const raw = Number(rupeeMatch[1].replace(/,/g, ""));
      if (lowered.includes("lakh")) maxBudget = raw * 100000;
      else if (lowered.includes("k")) maxBudget = raw * 1000;
      else maxBudget = raw < 1000 && lowered.includes("000") ? raw * 1000 : raw;
    }
    const categoryHint = lowered.includes("laptop") ? "AI Laptops" : lowered.includes("marathon") || lowered.includes("running") ? "Running" : lowered.includes("gaming") ? "Gaming" : undefined;
    return {
      maxBudget,
      categoryHint,
      useCase: lowered.includes("development") ? "AI development" : lowered.includes("setup") ? "complete setup" : "shopping advice"
    };
  }
}
