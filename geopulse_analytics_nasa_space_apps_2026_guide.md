# GeoPulse Analytics — 2026 NASA Space Apps Challenge Brief

**Team:** GeoPulse Analytics  
**Event:** [2026 NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/) (November 14–15, 2026)  
**Challenge:** [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Difficulty:** [Advanced](https://hackathlone.com/challenges)

> **Note on Source Availability:** During retrieval, `spaceappschallenge.org` returned an upstream connection error (`remote connection failure`), so the dynamic `?tab=resources` tab could not be loaded live. All challenge details, objectives, and hackathon guidelines below are compiled from the indexed cache of the official [challenge page](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/), the [Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), and the [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/), paired with canonical NASA and partner documentation links.

---

## 1. The Problem We Are Solving

Earth's environmental system is constantly changing across land, ocean, and atmosphere, and consistent directional shifts over time—known as **trends**—reveal both the processes driving change and the systems responding to them ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)). However, analyzing these trends presents two core challenges:

1. **Variable Complexity & Selection:** NASA and partner space agencies provide a massive number of Earth science variables—ranging from familiar ones like temperature and rainfall to specialized variables like evaporation or streamflow—making it difficult for users to identify which variables indicate meaningful change ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).
2. **Regional Divergence:** A single Earth science variable can trend in one direction in one region and the *opposite* direction in another, even when both trends are driven by the same underlying physical process ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).

**Our Core Mandate:** Build a tool that selects variables measured by Earth science missions or produced by Earth science models, visualizes how they change over time, and determines **what** is changing, **where** it is changing, **how much** it is changing, and whether those changes are **statistically significant** ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).

---

## 2. Resources Available

The challenge page explicitly highlights satellite instruments, global assimilation models, and hydrological plotting tools, alongside NASA's open data portals ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).

### Satellite Instruments

| Instrument | Full Name | Primary Earth Science Variables | Official Resource |
| :--- | :--- | :--- | :--- |
| **MODIS** | Moderate Resolution Imaging Spectroradiometer | Land cover, vegetation, aerosols, clouds, surface temperature (36 spectral channels, 1–2 day global coverage) | [MODIS Data Access & Tools](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools) |
| **OMI** | Ozone Monitoring Instrument | Ozone, aerosol types (smoke, dust, sulfates), atmospheric trace gases | [OMI Resources](https://www.earthdata.nasa.gov/data/instruments/omi/resources) |
| **AIRS** | Atmospheric Infrared Sounder | 3D temperature and water vapor profiles, trace gases, cloud and surface properties | [AIRS Overview](https://www.earthdata.nasa.gov/data/instruments/airs) |
| **GPM** | Global Precipitation Measurement | Global rain and snow observations (e.g., IMERG monthly/daily precipitation) | [GPM Mission Page](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) |

### Global Models & Reanalysis

| Model | Full Name | Scope & Resolution | Official Resource |
| :--- | :--- | :--- | :--- |
| **MERRA-2** | Modern-Era Retrospective analysis for Research and Applications, Version 2 | Global atmospheric reanalysis (1980–present) at 0.625° × 0.5° resolution; meteorological fields, aerosols, radiation, ozone | [MERRA-2 at GES DISC](https://www.earthdata.nasa.gov/data/catalog/ges-disc-m2i6npana-5.12.4) |
| **GLDAS** | Global Land Data Assimilation System | Land surface fluxes and states (soil moisture, evapotranspiration, runoff, snow water equivalent, surface temperature) | [GLDAS at GES DISC](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) |

### Data Portals & Visualization Tools

- **[NASA Earthdata Search](https://search.earthdata.nasa.gov/search):** Central gateway for discovering and downloading NASA Earth observation datasets across all DAACs ([NASA Earthdata](https://www.earthdata.nasa.gov/)).
- **[NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/):** Web-based interface at GES DISC for interactively visualizing and analyzing time series and maps for MERRA-2, GLDAS, GPM, AIRS, and OMI ([Giovanni Overview](https://www.earthdata.nasa.gov/data/tools/giovanni)).
- **[NASA Worldview](https://www.earthdata.nasa.gov/data/tools/worldview):** Interactive imagery browser for exploring global satellite layers over time ([Worldview](https://www.earthdata.nasa.gov/data/tools/worldview)).
- **[CUAHSI](https://www.cuahsi.org/) ([HydroClient](https://data.cuahsi.org/) & [HydroShare](https://www.hydroshare.org/)):** Explicitly recommended in the challenge's *Working with the Data* section for publicly available hydrological data plotting and time-series access ([CUAHSI Solutions](https://www.cuahsi.org/data-services/solutions)).

---

## 3. Our Objectives & Technical Approach

A complete solution must integrate four required functional elements ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)):

1. **Identify Variables of Interest:** Enable users to discover and select Earth science variables (familiar or specialized) suitable for trend investigation.
2. **Acquire Regional Data:** Retrieve variable data for a specific user-selected region (since most trends are regional rather than global, though global trends are also valid).
3. **Generate & Visualize Time Series:** Plot the variable's time series for the chosen region over a sufficiently long period to support statistical analysis.
4. **Perform Statistical Trend Analysis:** Compute the **rate of change over time** and test **statistical significance** using methods such as a **t-test**, **Mann-Kendall test**, or **confidence intervals**.

### Potential Considerations & Design Guidance

- **Target Audience:** High school and college students, plus members of the public with some scientific background. Providing **plain-language definitions** of variables will make the tool far more accessible ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).
- **Temporal Resolution:** Earth science datasets are available at hourly, 3-hourly, daily, and monthly resolutions; **daily and monthly data** are recommended as the easiest to process for this challenge ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).
- **Scope of Trend Analysis:** Focus on **linear trends** first. Non-linear trends and seasonal-cycle removal are noted as more complex and beyond the core scope, though surfacing non-significant trends is still valuable (sometimes a longer time series is needed for significance) ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).
- **Guided UX & Optional AI:** Users can answer a short series of questions about *what* or *where* they want to investigate to narrow down relevant variables, supported by a couple of **demonstration examples**. AI/SI is optional and could help suggest variables likely to show trends in specific regions (e.g., deserts, rainforests, tidal estuaries, or urban atmospheres) ([NASA Space Apps Challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)).

---

## 4. Hackathon Guidelines, Rules & Judging Criteria

### Submission Requirements & Deadlines

Per the [Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/) and [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/):

- **Event Dates:** November 14–15, 2026.
- **Submission Deadline:** **Sunday, November 15, 2026, at 11:59 p.m. local time** (according to your team's registered Local Event, or the Team Lead's local time for the Universal Event).
- **Team Registration:** All team members must be registered for the 2026 NASA Space Apps Challenge, belong to the same Local Event (not waitlisted) or Universal Event, and appear on the **Members** tab of the team page (recommended maximum of 6 members per team per [eligibility guidelines](https://mindshipglobal.com/opportunities/nasa-space-apps-challenge-2026/)).
- **Language:** All fields on the Project Submission page and any linked materials must be in **English**.
- **Project Demo:** Provide either a **slide presentation (7-slide limit, including title and intro slides)** OR a **video presentation (30-second limit)**.
- **Minors (Under 18):** Must be registered and accompanied by a parent or legal guardian, and must not upload personal photos/videos/voices/likenesses to team avatars or project demos ([Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/)).
- **Code of Conduct:** Harassment, discrimination, or bullying is strictly prohibited; issues can be reported to Local Leads or `conduct@spaceappschallenge.org` ([Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/)).

### Judging Criteria

Projects are evaluated across five equally important criteria ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)):

| Criterion | What Judges Look For |
| :--- | :--- |
| **Impact** | Potential of the solution to address a meaningful problem and benefit science, people, or society. |
| **Creativity** | Originality, innovation, or meaningful improvement over existing approaches. |
| **Validity** | Grounding in scientific principles and technical/functional feasibility in real-world use. |
| **Relevance** | Direct alignment with the challenge objectives and **meaningful integration of NASA data** as a core component (not a superficial addition). |
| **Presentation** | Clear, compelling storytelling and communication of the challenge, solution, and significance in the demo. |

### Judging Timeline & Global Awards

- **December 3, 2026:** Global Nominees announced from Local Events and the Universal Event ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)).
- **December 17, 2026:** Global Finalists & Honorable Mentions announced ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)).
- **January 2027:** Global Winners announced across 10 award categories: *Best Use of Science*, *Best Use of Data*, *Best Use of Technology*, *Galactic Impact*, *Best Mission Concept*, *Most Inspirational*, *Best Storytelling Award*, *Global Connection Award*, *Art & Technology Award*, and *Local Impact Award* ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/)).
