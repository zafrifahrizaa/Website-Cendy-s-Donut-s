import json

log_path = r"C:\Users\LOQ\.gemini\antigravity-ide\brain\05bc5c97-2e53-410c-af22-09dca95e26b0\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if "06-product-data-spec.md" in line and "The following code has been modified" in line:
            content = data.get("output", "")
            if content:
                print(content[:500])
                with open("recover_06.txt", "w", encoding="utf-8") as out:
                    out.write(content)
