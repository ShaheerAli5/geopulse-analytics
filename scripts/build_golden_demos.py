"""
Build Golden Demos Script
Pre-fetches and generates the 4 verified Golden Case Files in public/data/golden_demos/
for instant offline/judge testing (<50ms load time).
"""

import json
import os
import sys
import time

# Ensure project root and api dir are on sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from api.analyze import execute_investigation

GOLDEN_DIR = os.path.join(PROJECT_ROOT, "public", "data", "golden_demos")

GOLDEN_CASES = [
    {
        "file": "pk_divergence.json",
        "params": {
            "investigation_id": "pk-divergence",
            "variable_id": "GWETROOT",
            "latA": 35.30,
            "lonA": 75.60,
            "nameA": "Upper Indus (Gilgit-Baltistan)",
            "latB": 27.50,
            "lonB": 64.00,
            "nameB": "Southwestern Balochistan",
            "start_year": 1981,
            "end_year": 2025,
            "aggregation_mode": "annual",
        },
        "description": "Pakistan Hydrological Divergence: Upper Indus wetting vs. Balochistan drying",
    },
    {
        "file": "pk_heatwave.json",
        "params": {
            "investigation_id": "pk-heatwave",
            "variable_id": "T2M",
            "latA": 28.28,
            "lonA": 68.44,
            "nameA": "Jacobabad (Inland Thermal Pole)",
            "latB": 24.86,
            "lonB": 67.01,
            "nameB": "Karachi (Arabian Sea Coast)",
            "start_year": 1981,
            "end_year": 2025,
            "aggregation_mode": "annual",
        },
        "description": "South Asian Heat Envelope: Jacobabad extreme inland warming vs. Karachi coastal moderation",
    },
    {
        "file": "aral_sea.json",
        "params": {
            "investigation_id": "aral-sea",
            "variable_id": "GWETROOT",
            "latA": 45.00,
            "lonA": 59.50,
            "nameA": "Aral Sea Basin (Desiccated Bed)",
            "latB": 42.00,
            "lonB": 75.00,
            "nameB": "Tien Shan Mountains (Glacial Headwaters)",
            "start_year": 1981,
            "end_year": 2025,
            "aggregation_mode": "annual",
        },
        "description": "Central Asian Water Loss: Desiccated Aral Sea basin vs. Tien Shan mountain headwaters",
    },
    {
        "file": "amazon_drying.json",
        "params": {
            "investigation_id": "amazon-drying",
            "variable_id": "PRECTOTCORR",
            "latA": -12.50,
            "lonA": -55.50,
            "nameA": "Mato Grosso (Arc of Deforestation)",
            "latB": -3.10,
            "lonB": -60.00,
            "nameB": "Central Amazon Rainforest (Core)",
            "start_year": 1981,
            "end_year": 2025,
            "aggregation_mode": "annual",
        },
        "description": "Amazon Basin Drying: Southern deforestation arc vs. intact central rainforest core",
    },
]


def build_all_golden_demos():
    os.makedirs(GOLDEN_DIR, exist_ok=True)
    print(f"[*] Building 4 Golden Case Files into: {GOLDEN_DIR}")

    success_count = 0
    for case in GOLDEN_CASES:
        out_path = os.path.join(GOLDEN_DIR, case["file"])
        print(f"\n[->] Generating {case['file']} ({case['description']})...")
        t0 = time.time()

        max_retries = 3
        data = None
        for attempt in range(1, max_retries + 1):
            try:
                data = execute_investigation(case["params"])
                break
            except Exception as e:
                print(f"     [!] Attempt {attempt}/{max_retries} failed: {e}")
                if attempt < max_retries:
                    time.sleep(2)

        if data is None:
            print(f"     [ERROR] Failed to fetch data for {case['file']} after {max_retries} attempts.")
            continue

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        elapsed = time.time() - t0
        file_size_kb = os.path.getsize(out_path) / 1024.0
        print(f"     [OK] Saved {case['file']} ({file_size_kb:.1f} KB) in {elapsed:.2f}s")
        success_count += 1

    print(f"\n[DONE] Successfully generated {success_count}/{len(GOLDEN_CASES)} Golden Demos.")


if __name__ == "__main__":
    build_all_golden_demos()
