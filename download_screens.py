import json
import os
import subprocess
import re
from urllib.request import urlopen, Request

# Load screens list from step 8
step8_path = r"C:\Users\test\.gemini\antigravity\brain\7142219d-6c54-453f-a3aa-abdc2a5b049e\.system_generated\steps\8\output.txt"
with open(step8_path, "r", encoding="utf-8") as f:
    data = json.load(f)

screens_by_id = {}
for s in data.get("screens", []):
    screen_id = s["name"].split("/")[-1]
    screens_by_id[screen_id] = s

# Load project details for DESIGN.md
step30_path = r"C:\Users\test\.gemini\antigravity\brain\7142219d-6c54-453f-a3aa-abdc2a5b049e\.system_generated\steps\30\output.txt"
with open(step30_path, "r", encoding="utf-8") as f:
    project_data = json.load(f)

if "designTheme" in project_data and "designMd" in project_data["designTheme"]:
    with open("DESIGN.md", "w", encoding="utf-8") as f:
        f.write(project_data["designTheme"]["designMd"])
    print("Wrote DESIGN.md")

# Requested screens in exact order
requested = [
    ("01_Dashboard", "Dashboard", "0085e66337e14ef3950a82e3ba8993b7"),
    ("02_Settings_Governance", "Generating Screen... (Settings & System Governance)", "07266de9f3c349dda161e0dc5a44193d"),
    ("03_Analytics_Chart_Spec", "Generating Image... (Analytics Chart Card)", "10d3485d5a9a4919b81b34a11bb47c2e"),
    ("04_Bill_Customization", "Bill Customization", "20d5b8d1dfcd4aebbe9a17c2bb022766"),
    ("05_Payments_and_Ledgers", "Payments & Ledgers", "2ac7191478e24cfea33af7f08860ad5d"),
    ("06_Purchases_2_GRN_Modal", "Purchases 2 (New Purchase Bill / GRN Modal)", "54607f22620b44fba547f44e660d0d9c"),
    ("07_Purchases_1_Add_Vendor", "Purchases 1 (Add Vendor Modal)", "68ebdf1c51f04894b26d99927d16b282"),
    ("08_Purchases_3_Supplier_Payment", "Purchases 3 (Record Supplier Payment Modal)", "6b32d7f995ae40a9b060729908c39ee0"),
    ("09_Products_1_Add_Product", "Products 1 (Add Product Modal)", "776dee28be404fb985e9643d8b1ddf0c"),
    ("10_Shops_and_Udhar", "Shops & Udhar", "8e639c6ada694c1e87c1bec4da2d41f3"),
    ("11_Billing_POS", "Billing (Terminal POS)", "9f6d673822b84e9884ae744314f4585a"),
    ("12_Purchases_and_Suppliers", "Purchases & Suppliers", "a376ba314df94595a4152d53e2b3ef9d"),
    ("13_Reports_and_Profits", "Reports & Profits", "ba525752ace04bc8b2a181b2057ee2dc"),
    ("14_Products_and_Inventory", "Products and Inventory", "d3d0ec07c98d4d2f8d804f08cc9ec119"),
]

def download_with_curl(url, dest_path):
    cmd = ["curl.exe", "-sSL", url, "-o", dest_path]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        print(f"Error downloading {url} to {dest_path}: {res.stderr.decode('utf-8', errors='ignore')}")
        return False
    return True

os.makedirs("screens", exist_ok=True)

manifest = []

for folder_name, user_title, screen_id in requested:
    screen_info = screens_by_id.get(screen_id)
    if not screen_info:
        print(f"Warning: Screen ID {screen_id} not found in project screens!")
        continue
    
    target_dir = os.path.join("screens", folder_name)
    os.makedirs(target_dir, exist_ok=True)
    
    entry = {
        "id": screen_id,
        "user_label": user_title,
        "stitch_title": screen_info.get("title", ""),
        "width": screen_info.get("width"),
        "height": screen_info.get("height"),
        "device_type": screen_info.get("deviceType"),
        "folder": folder_name,
        "has_image": False,
        "has_html": False,
    }
    
    # Screenshot download
    screenshot = screen_info.get("screenshot", {})
    img_url = screenshot.get("downloadUrl")
    if img_url:
        img_dest = os.path.join(target_dir, "screen.png")
        print(f"Downloading image for {folder_name}...")
        if download_with_curl(img_url, img_dest):
            if os.path.exists(img_dest) and os.path.getsize(img_dest) > 0:
                entry["has_image"] = True
                entry["image_size"] = os.path.getsize(img_dest)
    
    # HTML code download
    html_code = screen_info.get("htmlCode", {})
    code_url = html_code.get("downloadUrl")
    if code_url:
        html_dest = os.path.join(target_dir, "code.html")
        print(f"Downloading HTML for {folder_name}...")
        if download_with_curl(code_url, html_dest):
            if os.path.exists(html_dest) and os.path.getsize(html_dest) > 0:
                entry["has_html"] = True
                entry["html_size"] = os.path.getsize(html_dest)
    
    # Write metadata.json
    with open(os.path.join(target_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(screen_info, f, indent=2)
        
    manifest.append(entry)

with open(os.path.join("screens", "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print("\n--- Manifest Summary ---")
for m in manifest:
    img_status = f"{m.get('image_size', 0)} bytes" if m["has_image"] else "NONE"
    html_status = f"{m.get('html_size', 0)} bytes" if m["has_html"] else "NONE (Spec/Image screen)"
    print(f"[{m['folder']}] Image: {img_status} | HTML: {html_status}")
