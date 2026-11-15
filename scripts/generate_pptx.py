"""
GeoPulse Analytics - 7-Slide Pitch Deck Generator
Creates a professional, dark-themed 16:9 widescreen PowerPoint presentation (.pptx)
for the 2026 NASA Space Apps Challenge judges.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path: str):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette
    BG_COLOR = RGBColor(11, 15, 25)         # #0B0F19 Dark Navy
    CARD_BG = RGBColor(19, 27, 46)          # #131B2E Card Background
    CARD_BORDER = RGBColor(30, 41, 59)      # #1E293B Border
    CYAN = RGBColor(34, 211, 238)           # #22D3EE Primary Accent
    CORAL = RGBColor(251, 113, 133)         # #FB7185 Secondary Accent
    WHITE = RGBColor(248, 250, 252)         # #F8FAFC Heading text
    MUTED = RGBColor(148, 163, 184)         # #94A3B8 Body text
    GREEN = RGBColor(16, 185, 129)          # #10B981 Success badge
    GOLD = RGBColor(245, 158, 11)           # #F59E0B Gold badge

    def add_background(slide):
        bg = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5)
        )
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag: str, title: str, subtitle: str, slide_num: int):
        # Category Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.0), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(10.0), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(10.0), Inches(0.4))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.name = "Arial"
        p_s.font.size = Pt(13)
        p_s.font.color.rgb = MUTED

        # Slide Number Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.3), Inches(0.45), Inches(1.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = CARD_BG
        badge.line.color.rgb = CARD_BORDER
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = f"SLIDE {slide_num} / 7"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(9)
        p_b.font.bold = True
        p_b.font.color.rgb = CYAN

    def add_card(slide, left, top, width, height, title="", border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.35))
            tf = tb.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = "Arial"
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = CYAN
        return card

    # =========================================================================
    # SLIDE 1: Title & Vision Hook
    # =========================================================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    add_background(s1)

    # Challenge Badge
    top_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(4.5), Inches(0.4))
    top_badge.fill.solid()
    top_badge.fill.fore_color.rgb = CARD_BG
    top_badge.line.color.rgb = CYAN
    p = top_badge.text_frame.paragraphs[0]
    p.text = "NASA SPACE APPS CHALLENGE 2026"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p.alignment = PP_ALIGN.CENTER

    # Live demo URL badge
    url_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(0.7), Inches(4.5), Inches(0.4))
    url_badge.fill.solid()
    url_badge.fill.fore_color.rgb = CARD_BG
    url_badge.line.color.rgb = CARD_BORDER
    p = url_badge.text_frame.paragraphs[0]
    p.text = "LIVE APP: geopulse-analytics.vercel.app"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle Box
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.0))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "GEOPULSE ANALYTICS"
    p.font.name = "Arial Black"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "The Serverless Earth System Trend Detective"
    p2.font.name = "Arial"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = CYAN
    p2.space_before = Pt(10)

    p3 = tf.add_paragraph()
    p3.text = "Transforming 45 Years of NASA Satellite Observations into Statistically Rigorous Environmental Discoveries in <2 Seconds."
    p3.font.name = "Arial"
    p3.font.size = Pt(14)
    p3.font.color.rgb = MUTED
    p3.space_before = Pt(8)

    # 3 Pillar Cards
    pillars = [
        ("🛰️ 45-Year NASA Pipeline", "Direct integration with NASA POWER REST & GIBS WMTS. 45 years of continuous daily/monthly reanalysis (1981–2025) delivered in <15 KB JSON without gigabyte downloads."),
        ("📐 Dual Statistical Rigor", "Pairs parametric OLS regression with non-parametric Theil–Sen robust median slopes, Mann–Kendall Tau/Z/p-values, 95% CIs, and lag-1 autocorrelation diagnostics."),
        ("🤖 Grounded Scientific AI", "Evidence-first narrative engine that synthesizes physical climate explanations with zero LLM hallucinations and 1-click verification links to NASA Giovanni & CUAHSI.")
    ]

    for i, (p_title, p_desc) in enumerate(pillars):
        left = Inches(0.8 + i * 3.95)
        top = Inches(4.0)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.8), Inches(2.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CYAN if i == 0 else CARD_BORDER
        card.line.width = Pt(1.5)

        tb = s1.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(3.4), Inches(2.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = p_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = WHITE

        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.name = "Arial"
        p2.font.size = Pt(11)
        p2.font.color.rgb = MUTED
        p2.space_before = Pt(10)

    # Speaker Notes
    s1.notes_slide.notes_text_frame.text = (
        "Timing: 0:00 - 0:04 (4 seconds)\n"
        "Voiceover: 'Welcome to GeoPulse Analytics. We turn 45 years of raw NASA satellite observations into verified, "
        "statistically tested Earth system trend discoveries in less than two seconds.'"
    )

    # =========================================================================
    # SLIDE 2: The Twin Problem - Variable Overload & Regional Divergence
    # =========================================================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    add_background(s2)
    add_header(s2, "Problem Statement & Relevance", "The Twin Problem: Data Overload & Hidden Divergence", "Global & National Climate Averages Obscure Local Disasters", 2)

    # Left Column: Challenge 1 & 2 Cards
    add_card(s2, Inches(0.8), Inches(1.9), Inches(5.6), Inches(2.3), "Challenge 1: NASA Variable Overload")
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(5.2), Inches(1.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• NASA stores petabytes across complex NetCDF/HDF5 archives.\n• Incomprehensible scientific units (e.g., kg/m²/s or dimensionless indices).\n• Overwhelming technical barrier for students, journalists, and policy planners."
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED

    add_card(s2, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.4), "Challenge 2: The Masking Bias of Averages")
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(4.9), Inches(5.2), Inches(1.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• National averages falsely imply stability by averaging wet and dry zones together.\n• Same climatic forcing creates diametrically OPPOSITE regional impacts.\n• Pakistan National Average: 'Stable rainfall' — completely hides glacial surge in North vs drought in Southwest!"
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED

    # Right Column: Flagship Case Study Card with Screenshot
    right_card = add_card(s2, Inches(6.7), Inches(1.9), Inches(5.8), Inches(4.9), "Case Study: Pakistan Hydro-Divergence (1981–2025)", border_color=CYAN)
    screenshot_path = "public/screenshot_workbench2.png"
    if os.path.exists(screenshot_path):
        s2.shapes.add_picture(screenshot_path, Inches(6.9), Inches(2.5), width=Inches(5.4))

    tb = s2.shapes.add_textbox(Inches(6.9), Inches(5.7), Inches(5.4), Inches(1.0))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Region A (Upper Indus): +0.0129/dec (p = 0.0090) -> SIGNIFICANT WETTING\nRegion B (Balochistan): +0.0005/dec (p = 0.2787) -> ARID STALLING / NO SIGNAL"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN

    s2.notes_slide.notes_text_frame.text = (
        "Timing: 0:04 - 0:08 (4 seconds)\n"
        "Voiceover: 'Students and planners face thousands of complex NASA files, while national averages hide reality: "
        "in Pakistan, Indus glacial basins are wetting significantly, while neighboring Balochistan is parched.'"
    )

    # =========================================================================
    # SLIDE 3: Guided Detective Workflow (2-Step Wizard)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    add_background(s3)
    add_header(s3, "User Experience & Accessibility", "Guided Detective Workflow: From Curiosity to NASA Data", "2-Step Wizard Translates Environmental Questions into Analysis-Ready Observations", 3)

    # Step 1 Card
    add_card(s3, Inches(0.8), Inches(1.9), Inches(5.6), Inches(2.5), "Step 1: Choose Research Theme")
    tb = s3.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(5.2), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Curated real-world environmental themes for students:\n💧 Drought & Soil Wetness Loss (GWETROOT)\n🔥 Extreme Heatwaves & Urban Envelopes (T2M)\n🌧️ Monsoon Shifts & Flood Extremes (PRECTOTCORR)\n☀️ Solar Dimming & Evaporation Potential (ALLSKY_SW)"
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED

    # Step 2 Card
    add_card(s3, Inches(0.8), Inches(4.6), Inches(5.6), Inches(2.2), "Step 2: Plain-English Science Translation")
    tb = s3.shapes.add_textbox(Inches(1.0), Inches(5.1), Inches(5.2), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Translates cryptic NASA codes into student-friendly cards:\n'GWETROOT measures the fraction of soil pores filled with water in the top 100 cm root zone — vital for crops and drought detection.'\nOne-click dispatch: 'Apply & Investigate' updates the workbench in <1 ms."
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED

    # Right Column: Screenshot of Wizard Step 1 & 2
    add_card(s3, Inches(6.7), Inches(1.9), Inches(5.8), Inches(4.9), "Interactive 2-Step Detective Wizard", border_color=CYAN)
    wiz_img = "public/screenshot_wizard.png"
    if os.path.exists(wiz_img):
        s3.shapes.add_picture(wiz_img, Inches(6.9), Inches(2.45), width=Inches(5.4))

    s3.notes_slide.notes_text_frame.text = (
        "Timing: 0:08 - 0:12 (4 seconds)\n"
        "Voiceover: 'Our 2-step Question Wizard guides any student from an environmental question to the exact NASA variable, "
        "providing plain-English definitions and automatic coordinate targets.'"
    )

    # =========================================================================
    # SLIDE 4: Zero-Download Serverless Architecture
    # =========================================================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    add_background(s4)
    add_header(s4, "Engineering & Cloud Architecture", "Zero-Download Serverless Pipeline", "Direct Integration with NASA POWER & GIBS Delivering Sub-2-Second Execution", 4)

    # 4 Flow Boxes
    stages = [
        ("1. Browser Client", "Next.js App Router\nMapLibre Dark GL\nRecharts Dual Series\nIn-memory Golden Cache (<1ms)"),
        ("2. Serverless Engine", "Vercel Python Function\nFastAPI REST Endpoint\nCoordinate Sanitization\nSeasonal Aggregator (JJAS/DJF)"),
        ("3. NASA Satellite APIs", "NASA POWER REST (LaRC)\n45 Years Daily/Monthly ARD\nNASA GIBS WMTS Tiles\nSMAP, AIRS, GPM, MODIS"),
        ("4. Scientific Scipy Core", "NumPy & SciPy Engine\nTheil-Sen Median Slope\nMann-Kendall Tau, Z, p\n95% Confidence Bounds")
    ]

    for i, (title, desc) in enumerate(stages):
        left = Inches(0.8 + i * 2.95)
        top = Inches(2.0)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(2.8), Inches(2.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CYAN if i == 0 or i == 3 else CARD_BORDER
        card.line.width = Pt(1.5)

        tb = s4.shapes.add_textbox(left + Inches(0.15), top + Inches(0.15), Inches(2.5), Inches(2.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = CYAN

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(11)
        p2.font.color.rgb = MUTED
        p2.space_before = Pt(8)

    # Key Performance Metrics Card
    add_card(s4, Inches(0.8), Inches(4.8), Inches(11.7), Inches(2.0), "Architectural Benchmarks & Zero-Cost Infrastructure", border_color=GREEN)
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(5.3), Inches(11.3), Inches(1.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• Zero Data Download: Streams analysis-ready JSON payloads under 15 KB instead of multi-gigabyte HDF5 files.\n• Instant Response: 4 pre-cached Golden Cases resolve in <1 ms; custom global coordinates resolve in 2–3 seconds.\n• Complete Independence: 100% deterministic local statistical fallback with zero external LLM downtime or costs."
    p.font.size = Pt(12)
    p.font.color.rgb = WHITE

    s4.notes_slide.notes_text_frame.text = (
        "Timing: 0:12 - 0:17 (5 seconds)\n"
        "Voiceover: 'Our serverless pipeline pulls analysis-ready data directly from NASA POWER and GIBS. No multi-gigabyte downloads. "
        "SciPy computes dual-region statistics in the cloud in under two seconds.'"
    )

    # =========================================================================
    # SLIDE 5: Statistical Rigor (OLS vs. Sen's Slope vs. Mann-Kendall)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    add_background(s5)
    add_header(s5, "Mathematical & Scientific Rigor", "Beyond Naive Trends: Dual-Method Statistical Testing", "Parametric OLS Paired with Non-Parametric Theil–Sen Median and Mann–Kendall p-Values", 5)

    # Left: Scorecard Table
    add_card(s5, Inches(0.8), Inches(1.9), Inches(6.8), Inches(4.9), "Quantitative Statistical Scorecard")
    table_shape = s5.shapes.add_table(7, 3, Inches(1.0), Inches(2.5), Inches(6.4), Inches(3.8))
    table = table_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(1.9)
    table.columns[2].width = Inches(1.9)

    headers = ["Statistical Metric", "Region A (Indus)", "Region B (Balochistan)"]
    data = [
        ["6-Tier Semantic Badge", "INCREASING • SIG", "UPWARD DRIFT • NOT SIG"],
        ["Theil-Sen Median Slope", "+0.0129 / decade", "+0.0005 / decade"],
        ["OLS Linear Slope", "+0.0131 / decade", "+0.0011 / decade"],
        ["Mann-Kendall p-value", "p = 0.0090 (p < 0.05)", "p = 0.2787 (p >= 0.05)"],
        ["Kendall Tau (Z-score)", "τ = +0.270 (Z = +2.60)", "τ = +0.115 (Z = +1.07)"],
        ["Serial Autocorrelation", "r₁ = 0.607 (Caveat noted)", "r₁ = 0.261 (Acceptable)"]
    ]

    for col_idx, h in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(30, 41, 59)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = CYAN

    for row_idx, row in enumerate(data):
        for col_idx, val in enumerate(row):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(9.5)
            p.font.color.rgb = GREEN if "SIG" in val and "NOT" not in val else (WHITE if col_idx == 0 else MUTED)

    # Right: Semantic Badges & Why It Matters
    add_card(s5, Inches(7.8), Inches(1.9), Inches(4.7), Inches(4.9), "6-Tier Badge System & Integrity", border_color=CYAN)
    tb = s5.shapes.add_textbox(Inches(8.0), Inches(2.4), Inches(4.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Why Theil-Sen Median Slope?\nClimate time series have severe single-year outliers (e.g., 2022 Pakistan super-flood). OLS regression gets dragged by outliers; Theil–Sen calculates median pairwise slopes and resists up to 29% data contamination."
    p.font.size = Pt(10.5)
    p.font.color.rgb = MUTED

    p2 = tf.add_paragraph()
    p2.text = "\n6-Tier Semantic Badges:\n• ↗ INCREASING • SIGNIFICANT (p < 0.05)\n• ↘ DECREASING • SIGNIFICANT (p < 0.05)\n• ~ UPWARD DRIFT (p >= 0.05)\n• ~ DOWNWARD DRIFT (p >= 0.05)\n• — NO MONOTONIC TREND\n• ⚠️ INSUFFICIENT DATA (<10 observations)"
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(8)

    s5.notes_slide.notes_text_frame.text = (
        "Timing: 0:17 - 0:22 (5 seconds)\n"
        "Voiceover: 'We don't stop at simple lines. We pair parametric OLS with non-parametric Mann-Kendall and Sen's slope, "
        "auditing serial autocorrelation to ensure judges and scientists see true statistical signal.'"
    )

    # =========================================================================
    # SLIDE 6: Grounded AI & Reproducibility
    # =========================================================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    add_background(s6)
    add_header(s6, "Scientific Integrity & Open Science", "Evidence-First Grounded AI & Total Provenance", "Zero Hallucination Guarantee with 1-Click Verification Links to NASA Giovanni & CUAHSI", 6)

    # Left: 3-Part Verdict Breakdown
    add_card(s6, Inches(0.8), Inches(1.9), Inches(5.6), Inches(4.9), "3-Part Grounded Verdict Engine")
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(5.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. Direction & Magnitude (Exact Numbers):\n'Upper Indus shows an increasing rate of +0.0131 fraction/decade (Sen: +0.0129, p = 0.0090).'"
    p.font.size = Pt(11)
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "\n2. Regional Divergence Comparison:\n'In contrast, Southwestern Balochistan shows a modest upward drift of +0.0011 fraction/decade (p = 0.2787), which is not statistically significant.'"
    p2.font.size = Pt(11)
    p2.font.color.rgb = MUTED

    p3 = tf.add_paragraph()
    p3.text = "\n3. Physical Mechanism & Policy Impact:\n'Divergence confirms localized glaciated headwater expansion while arid plateaus remain unreplenished. High serial autocorrelation (r1 = 0.607) noted.'"
    p3.font.size = Pt(11)
    p3.font.color.rgb = CYAN

    # Right: Provenance & Audit Card
    add_card(s6, Inches(6.7), Inches(1.9), Inches(5.8), Inches(4.9), "NASA Provenance & One-Click Audit Links", border_color=GREEN)
    tb = s6.shapes.add_textbox(Inches(6.9), Inches(2.4), Inches(5.4), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Verified NASA Data Provenance:\n• Primary Source: NASA MERRA-2 & GLDAS-2.1\n• Spatial Grid: 0.5° × 0.625° Analysis-Ready Resolution\n• Time Horizon: 1981–2025 (45 Continuous Years)\n• Missing Data Filter: 0 Missing Months"
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED

    p2 = tf.add_paragraph()
    p2.text = "\nDirect NASA Verification Portals:\n🔗 NASA Giovanni: giovanni.gsfc.nasa.gov\n🔗 NASA Earthdata: earthdata.nasa.gov\n🔗 CUAHSI HydroClient: data.cuahsi.org\n🔗 NASA Worldview: worldview.earthdata.nasa.gov"
    p2.font.size = Pt(11)
    p2.font.color.rgb = WHITE

    p3 = tf.add_paragraph()
    p3.text = "\nExport Formats:\n📄 One-Click Markdown Case Report (.MD download)\n🖨️ Two-Page Tailored Print PDF (@media print ready)"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = CYAN

    s6.notes_slide.notes_text_frame.text = (
        "Timing: 0:22 - 0:26 (4 seconds)\n"
        "Voiceover: 'Our AI engine explains only verified statistical outputs with zero hallucinations, complete with one-click "
        "verification links directly to NASA Giovanni, Earthdata, and CUAHSI.'"
    )

    # =========================================================================
    # SLIDE 7: Live Right Now - 4 Golden Cases & Call to Action
    # =========================================================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    add_background(s7)
    add_header(s7, "Global Hackathon Submission", "Live Right Now: 4 Pre-Cached Golden Cases", "Experience GeoPulse Analytics with Instant <1ms Switching on Vercel", 7)

    # 4 Golden Case Cards
    cases = [
        ("Case 1: Pakistan Hydro-Divergence", "Upper Indus Basin vs. Balochistan\nGWETROOT • Wetting vs. Parched\np = 0.0090 (Significant Divergence)", "public/screenshot_workbench2.png"),
        ("Case 2: South Asian Heat Envelope", "Jacobabad Inland vs. Karachi Coast\nT2M • +0.1283°C/dec Coastal Warming\np = 0.0022 (Significant)", "public/screenshot_case2.png"),
        ("Case 3: Aral Sea vs. Tien Shan", "Aral Sea Bed vs. Tien Shan Glaciers\nGWETROOT • Historic Desiccation\nPost-2010 Stabilization", "public/screenshot_case3.png"),
        ("Case 4: Amazon Basin Drying", "Mato Grosso Arc vs. Central Core\nPRECTOTCORR • -0.3366 mm/day/dec\np = 0.0003 (Severe Deforestation)", "public/screenshot_case4.png")
    ]

    for i, (c_title, c_desc, img_p) in enumerate(cases):
        left = Inches(0.8 + i * 2.95)
        top = Inches(1.9)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(2.8), Inches(4.9))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CYAN if i == 0 else CARD_BORDER
        card.line.width = Pt(1.5)

        # Image thumbnail
        if os.path.exists(img_p):
            s7.shapes.add_picture(img_p, left + Inches(0.15), top + Inches(0.15), width=Inches(2.5))

        tb = s7.shapes.add_textbox(left + Inches(0.15), top + Inches(2.3), Inches(2.5), Inches(2.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = c_title
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = WHITE

        p2 = tf.add_paragraph()
        p2.text = c_desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = MUTED
        p2.space_before = Pt(6)

    # Bottom Live URL Bar
    bar = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = RGBColor(16, 24, 39)
    bar.line.color.rgb = GREEN
    bar.line.width = Pt(1.5)
    tf = bar.text_frame
    p = tf.paragraphs[0]
    p.text = "🌐 LIVE PRODUCTION APP: https://geopulse-analytics.vercel.app    |    📦 REPO: github.com/se-mohiuddin/geopulse-analytics"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    s7.notes_slide.notes_text_frame.text = (
        "Timing: 0:26 - 0:30 (4 seconds)\n"
        "Voiceover: 'Try it right now on Vercel. Click through four pre-cached golden cases in under 50 milliseconds, "
        "or investigate any coordinate on Earth. GeoPulse Analytics: Be an Earth System Trend Detective.'"
    )

    # Save Presentation
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath("docs/pitch/GeoPulse_Analytics_Pitch_Deck.pptx")
    create_deck(out)
