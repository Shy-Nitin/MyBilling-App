import json
import os

manifest_path = r"screens\manifest.json"
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern POS and Billing ERP - Stitch Screens</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Geist', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-indigo-950">Modern POS and Billing ERP</h1>
        <p class="text-xs text-slate-500 mt-0.5">Stitch Project ID: <span class="mono font-medium text-indigo-600">14257338939885243512</span> • 14 Screens Downloaded</p>
      </div>
      <a href="DESIGN.md" target="_blank" class="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-200">
        View DESIGN.md
      </a>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
"""

for item in manifest:
    folder = item["folder"]
    user_label = item["user_label"]
    stitch_title = item.get("stitch_title", "")
    screen_id = item["id"]
    has_html = item["has_html"]
    img_rel = f"screens/{folder}/screen.png"
    html_rel = f"screens/{folder}/code.html" if has_html else None

    html += f"""
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div class="relative bg-slate-100 aspect-video overflow-hidden border-b border-slate-200 group">
          <img src="{img_rel}" alt="{user_label}" class="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105" loading="lazy">
          <a href="{img_rel}" target="_blank" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
            Expand Image ↗
          </a>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="mono text-[10px] text-slate-400 font-semibold">{folder}</span>
              <span class="mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded truncate max-w-[120px]">{screen_id}</span>
            </div>
            <h2 class="text-sm font-semibold text-slate-900 mt-1">{user_label}</h2>
            <p class="text-xs text-slate-500 mt-0.5 line-clamp-2" title="{stitch_title}">{stitch_title}</p>
          </div>
          
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <a href="{img_rel}" download class="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1">
              Download PNG
            </a>
            {f'<a href="{html_rel}" target="_blank" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded shadow-sm transition-colors">Open HTML ↗</a>' if has_html else '<span class="text-[11px] text-slate-400 italic">Image Spec Only</span>'}
          </div>
        </div>
      </div>
"""

html += """
    </div>
  </main>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Generated index.html gallery successfully.")
