import json
import os

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


@login_required(login_url="accounts/login/")
def home_view(request):
    return render(request, "api/home.html", {"user": request.user})


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint to verify backend is running and accessible."""
    # #region agent log
    import json as json_module
    try:
        with open('/Users/uakks/Documents/KBTU/5th sem/BIS/BookingAI/.cursor/debug.log', 'a') as f:
            f.write(json_module.dumps({"location":"views.py:25","message":"Health check request received","data":{"method":request.method,"path":request.path,"remoteAddr":request.META.get("REMOTE_ADDR","")},"timestamp":int(__import__("time").time()*1000),"sessionId":"debug-session","runId":"connection-test","hypothesisId":"A"})+"\n")
    except: pass
    # #endregion
    return JsonResponse({
        "status": "ok",
        "message": "Backend is running",
        "service": "BookingAI API"
    })

@csrf_exempt  
def call_gemini(prompt: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_API_URL}?key={api_key}",
        json=payload,
        timeout=30
    )
    if response.status_code == 429:
        return JsonResponse(
            {
                "error": "AI rate limit exceeded. Please wait a moment and try again."
            },
            status=429
        )
    if response.status_code != 200:
        return JsonResponse(
            {"error": "Gemini API error", "details": response.text},
            status=response.status_code
        )

    response.raise_for_status()  # raises if 4xx / 5xx

    return response.json()


@csrf_exempt  
@require_POST
def ai_chat(request):
    """
    Conversational AI:
    - Recommends hotels
    - Explains reasoning
    - Uses preferences + user message
    """

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    message = body.get("message", "").strip()
    preferences = body.get("preferences", {})
    hotels = body.get("hotels", [])

    if not message:
        return JsonResponse({"error": "message is required"}, status=400)

    if not hotels:
        return JsonResponse({"error": "hotels list is required"}, status=400)

    try:
        prompt = f"""
            You are a hotel booking assistant.

            User preferences:
            {json.dumps(preferences, indent=2)}

            Available hotels:
            {json.dumps(hotels, indent=2)}

            User message:
            "{message}"

            Rules:
            - Recommend the most suitable hotels
            - Use ONLY the hotels provided
            - Respect user preferences and travel reason
            - Explain your reasoning clearly
            - Do NOT invent hotels or data

            Give your response in a understandable and friendly manner.
            Give ONLY top 3 hotel recommendations with explanations, unless the user asks for more.
            No asterisks * or other unknown symbols. 
            """
        try:
            gemini_data = call_gemini(prompt)

            text = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
            print("AI RAW TEXT:", text)

            return JsonResponse({
                "response": text
            })
        except Exception as e:
            return JsonResponse(
                {"error": str(e)},
                status=500
            )
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def ai_sort_rooms(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    preferences = body.get("preferences")
    rooms = body.get("rooms")

    if not preferences:
        return JsonResponse({"error": "preferences are required"}, status=400)

    if not rooms or not isinstance(rooms, list):
        return JsonResponse({"error": "rooms list is required"}, status=400)

    room_ids = [room.get("id") for room in rooms]
    if any(rid is None for rid in room_ids):
        return JsonResponse({"error": "Each room must have an id"}, status=400)

    PROMPT_TEMPLATE = """
You are a JSON-only ranking engine.

You must follow ALL rules below without exception.

========================
OUTPUT RULES (CRITICAL)
========================
- Output MUST be VALID JSON
- Output MUST start with `{` and end with `}`
- Output MUST be parseable by `JSON.parse()`
- Output MUST NOT include:
  - explanations
  - comments
  - markdown
  - code blocks
  - backticks
  - natural language
  - extra keys
  - trailing commas
- Output MUST match the schema EXACTLY

If you violate ANY rule, the output is INVALID.

========================
REQUIRED OUTPUT SCHEMA
========================
{
  "sorted_room_ids": ["room_id_1", "room_id_2"]
}

========================
RANKING INSTRUCTIONS
========================
Sort the rooms from BEST to WORST match using these priorities (in order):

1. Matches preferred room type
2. Matches preferred amenities
3. Fits travel reason
4. Best value for price

========================
CONSTRAINTS
========================
- Use ONLY the room IDs provided
- Do NOT invent room IDs
- Do NOT omit any room ID
- The output array length MUST equal the input room count
- Each room ID MUST appear EXACTLY ONCE

========================
FAILURE CONDITION
========================
If you cannot follow these rules, return:
{
  "sorted_room_ids": []
}

REMINDER: ANY output that is not valid JSON causes a SYSTEM FAILURE.

========================
INPUT DATA
========================

User preferences:
{{PREFERENCES_JSON}}

Rooms:
{{ROOMS_JSON}}

"""
    prompt = PROMPT_TEMPLATE.replace(
    "{{PREFERENCES_JSON}}", json.dumps(preferences)
).replace(
    "{{ROOMS_JSON}}", json.dumps(rooms)
)

    try:
        # 1️⃣ Call Gemini
        gemini_response = call_gemini(prompt)

        # 2️⃣ Convert JsonResponse → dict
        data = json.loads(gemini_response.content)

        # 3️⃣ Extract text
        text = data["candidates"][0]["content"]["parts"][0]["text"]

        # 4️⃣ Strip markdown if Gemini adds it
        text = text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]

        # 5️⃣ Parse JSON safely
        result = json.loads(text)

        sorted_ids = result.get("sorted_room_ids")

        # 6️⃣ Validate output
        if not sorted_ids or set(sorted_ids) != set(room_ids):
            raise ValueError("Invalid room IDs returned")

        return JsonResponse({"sorted_room_ids": sorted_ids})

    except Exception as e:
        print("AI SORT ERROR:", str(e))
        return JsonResponse(
            {"error": "Failed to parse Gemini sorting response"},
            status=500
        )
