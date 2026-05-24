"""Shared model configuration for every agent.

Why a separate module: llama-3.3-70b on Groq malforms tool calls (emits
`<function=name{args}</function>` text instead of structured JSON). gpt-oss-120b
on Groq is far more reliable for multi-tool agent flows. Centralizing here
means we can swap the whole stack with one edit if Groq adds a better model.
"""
from google.adk.models.lite_llm import LiteLlm


def make_model() -> LiteLlm:
    return LiteLlm(model="groq/openai/gpt-oss-120b")
