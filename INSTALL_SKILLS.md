# NASA Space Apps Challenge 2026 — Skills Installation Guide
**Project:** GeoPulse Analytics (Earth System Trend Detective)  
**Skills Source:** [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills)

This guide walks you through installing the 5 essential AI agent skills needed to build your hackathon project:
1. **`kpi-dashboard-design`** — Streamlit & Dashboard UI templates
2. **`plotly`** — Interactive charts and time-series plots
3. **`data-scientist`** — Statistical significance testing & math
4. **`python-pro`** — High-performance Pandas & data ingestion
5. **`data-storytelling`** — 7-slide pitch deck structure & narratives

---

## Method 1: Automated Download via PowerShell (Fastest on Windows)

Open **PowerShell** in your project root folder and run this single block of commands. It automatically creates the skills directory and downloads all 5 `SKILL.md` files directly from GitHub:

```powershell
# 1. Create local skills directory
New-Item -ItemType Directory -Force -Path ".agent\skills"

# 2. Define the skills list
$skills = @(
    "kpi-dashboard-design",
    "plotly",
    "data-scientist",
    "python-pro",
    "data-storytelling"
)

# 3. Download each SKILL.md file
foreach ($skill in $skills) {
    New-Item -ItemType Directory -Force -Path ".agent\skills\$skill"
    $url = "https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/$skill/SKILL.md"
    $dest = ".agent\skills\$skill\SKILL.md"
    Invoke-WebRequest -Uri $url -OutFile $dest
    Write-Host "Downloaded: $skill" -ForegroundColor Green
}
```

> **Note for Gemini / Antigravity Users:** If your agent looks in `.gemini/skills`, replace `.agent\skills` in the script with `.gemini\skills`.

---

## Method 2: Interactive Installer via NPM / NPX

If you have Node.js installed, you can use the official repository CLI tool to browse and install skills interactively:

```bash
npx agentic-awesome-skills
```
* When prompted, type the skill name (e.g. `plotly` or `data-scientist`) and select **Install**.

---

## Method 3: Manual Download Links

If you prefer to download them manually, click the direct links below, right-click **Raw**, and save as `SKILL.md` inside your `.agent/skills/<skill-name>/` folder:

| Skill Name | Purpose | GitHub Folder | Raw File Link |
| :--- | :--- | :--- | :--- |
| **kpi-dashboard-design** | Streamlit UI & metric cards | [View Folder](https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/kpi-dashboard-design) | [Raw SKILL.md](https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/kpi-dashboard-design/SKILL.md) |
| **plotly** | Interactive zoom/hover charts | [View Folder](https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/plotly) | [Raw SKILL.md](https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/plotly/SKILL.md) |
| **data-scientist** | Statistics, $p$-values, t-tests | [View Folder](https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/data-scientist) | [Raw SKILL.md](https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/data-scientist/SKILL.md) |
| **python-pro** | Pandas & data cleaning | [View Folder](https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/python-pro) | [Raw SKILL.md](https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/python-pro/SKILL.md) |
| **data-storytelling** | 7-slide deck & judge narrative | [View Folder](https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/data-storytelling) | [Raw SKILL.md](https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main/skills/data-storytelling/SKILL.md) |

---

## Expected Folder Structure

Once installed, your project workspace should look like this:

```text
your-project/
├── .agent/
│   └── skills/
│       ├── kpi-dashboard-design/
│       │   └── SKILL.md
│       ├── plotly/
│       │   └── SKILL.md
│       ├── data-scientist/
│       │   └── SKILL.md
│       ├── python-pro/
│       │   └── SKILL.md
│       └── data-storytelling/
│           └── SKILL.md
├── app.py              # Your Streamlit Dashboard
└── data/               # Downloaded NASA sample datasets
```

---

## How to Verify That Your AI Agent Has Loaded Them

Once the files are in `.agent/skills/`, test your assistant by asking:
1. *"Can you use the kpi-dashboard-design skill to lay out our Earth Trend Streamlit app?"*
2. *"Can you use the data-scientist skill to calculate the Mann-Kendall trend significance for our temperature series?"*
3. *"Can you use the data-storytelling skill to outline our 7-slide presentation for NASA judges?"*
