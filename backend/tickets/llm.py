import os
import json
import re
import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)


def fallback_classification(description):

    description = description.lower()

    if "payment" in description or "charged" in description:
        return {
            "suggested_category": "billing",
            "suggested_priority": "high"
        }

    elif "error" in description or "bug" in description:
        return {
            "suggested_category": "technical",
            "suggested_priority": "medium"
        }

    elif "account" in description or "login" in description:
        return {
            "suggested_category": "account",
            "suggested_priority": "high"
        }

    else:
        return {
            "suggested_category": "general",
            "suggested_priority": "low"
        }


def classify_ticket(description: str):

    try:

        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        Classify this support ticket.

        Categories: billing, technical, account, general
        Priorities: low, medium, high, critical

        Description:
        {description}

        Return ONLY valid JSON:
        {{
            "suggested_category": "",
            "suggested_priority": ""
        }}
        """

        response = model.generate_content(prompt)

        return json.loads(response.text)

    except Exception as e:

        print("Gemini error:", e)

        return fallback_classification(description)
