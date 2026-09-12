import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Resume parsing endpoint
  app.post('/api/resume/parse', async (req, res) => {
    try {
      const { text, fileData } = req.body;

      if (!text && !fileData) {
        return res.status(400).json({
          error: 'Please provide either resume text or an uploaded file.',
        });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets or check fallback.',
          requiresApiKey: true,
        });
      }

      const systemPrompt = `You are a world-class technical resume analyst and talent intelligence system specializing in live entertainment production, concert touring, broadcast engineering, media server programming, and visual show control.

Your job is to rigorously ingest a resume, extract all new information, and carefully discern all technical and operational skills that are clearly stated or demonstrated in the text or document.

Extract the following into a valid JSON object matching this schema:
{
  "profile": {
    "name": string,
    "title": string,
    "email": string,
    "phone": string,
    "location": string,
    "website": string,
    "linkedin": string,
    "summary": string
  },
  "workExperience": [
    {
      "role": string,
      "companyOrVenue": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "employmentType": string (e.g. "Residency / Dept Head", "Touring Contract", "Site Lead", "Freelance / Specialist"),
      "description": string,
      "highlights": [string],
      "skillsUsed": [string],
      "keyMetrics": [
        { "label": string, "value": string }
      ]
    }
  ],
  "skillDomains": [
    {
      "domainName": string (e.g. "Media Servers & Real-Time Playback", "LED Display & Processing", "Video Switching & Routing", "Lighting & Laser Control", "Camera Systems & Video Engineering", "Power, Rigging & Signal Distribution", "Audio, Timecode & Communications", "Software, Scripting & 3D CAD"),
      "description": string,
      "skills": [
        {
          "name": string (e.g. "disguise (d3)", "Resolume Arena 7", "Brompton SX40 / Tessera", "Barco E2", "grandMA3", "Art-Net / sACN", "SMPTE LTC Timecode", "Fiber Optic ST/Neutrik"),
          "proficiency": "Master" | "Expert" | "Advanced" | "Proficient",
          "yearsOfExperience": string (e.g. "10+ Years", "5 Years", "8+ Years"),
          "description": string (explain specific capabilities, setups, or protocols mentioned),
          "keywords": [string] (e.g. ["DMX", "LTC", "Genlock", "4K EDID", "NDI"]),
          "clearlyStatedEvidence": string (the exact quote or proof from the resume that clearly states this skill)
        }
      ]
    }
  ],
  "projects": [
    {
      "title": string,
      "subtitle": string,
      "suggestedCategory": string (e.g. "Concert Tours & Headliners", "Club & Venue Residencies", "Experiential & Art", "Festivals & Mega-Stages", "Corporate & Broadcast"),
      "date": string,
      "location": string,
      "roleTag": string,
      "content": string,
      "tags": [string],
      "metrics": [
        { "label": string, "value": string }
      ]
    }
  ],
  "insights": {
    "totalExperiencesFound": number,
    "totalSkillsDiscerned": number,
    "clearSkillHighlights": [string],
    "summaryNotes": string
  }
}

Important Instructions:
1. Pay close attention to discerning skills that are clearly stated: whenever a piece of hardware, software, media server, protocol, standard, or technical competency is explicitly named in the resume, extract it with the exact evidence quote from the text in "clearlyStatedEvidence".
2. Categorize skills into logical professional domains.
3. If profile fields like website or linkedin are not present, leave them as empty strings.
4. Output strict JSON only. Do not wrap in markdown quotes if possible, or respond with valid JSON.`;

      let contentsPayload: any;

      if (fileData && fileData.base64 && fileData.mimeType) {
        contentsPayload = {
          parts: [
            {
              inlineData: {
                mimeType: fileData.mimeType,
                data: fileData.base64,
              },
            },
            {
              text: `Please analyze this resume document in detail. Ingest all information and discern all clearly stated technical skills and experience.\nAdditional context provided by user: ${text || 'None'}`,
            },
          ],
        };
      } else {
        contentsPayload = {
          parts: [
            {
              text: `Here is the resume text to ingest and analyze:\n\n${text}`,
            },
          ],
        };
      }

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = response.text || '';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        // In case model wrapped in markdown code fence
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse JSON response from Gemini');
        }
      }

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Error during resume parsing:', err);
      return res.status(500).json({
        error: err.message || 'Failed to parse resume with AI engine.',
      });
    }
  });

  // 3. Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
