import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback canned responses if API key is not configured or in offline mode
const FALLBACK_RESPONSES: Record<string, string> = {
  general: `Hello! I am your AI Admission Copilot. I can guide you through eligibility criteria, branch cutoff predictions, required documents, scholarship fee waivers (up to 100%), and admission schedules. How can I help you today?`,
  parent: `Namaste! As your Parent Admission Guide, I provide clear insights into verified college fee structures, installment options, hostel safety & warden monitoring, college bus routes, mess hygiene, and genuine placement ROI. What would you like to know?`,
};

// API: Admission Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, mode, language = 'en', studentProfile, chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const personaInstructions = mode === 'parent'
      ? `You are in PARENT MODE. Your persona is a trusted, reassuring, pragmatic senior college counselor speaking to Indian parents. 
Focus on:
1. Total transparent fee breakdown (Tuition, Development, Exam, Caution deposit, Hostel & Mess).
2. Safety & Security (Hostel wardens, campus CCTV, biometric entry, anti-ragging measures, 24/7 on-campus medical care).
3. Commute & Transport (college buses, safety for female students).
4. Realistic ROI, median placements, top recruiters, and education loan/installment options.
Be empathetic, clear, respectful, and transparent.`
      : `You are in STUDENT MODE. Your persona is an energetic, high-IQ senior tech mentor and college admission strategist. 
Focus on:
1. Cutoffs, merit percentiles, branches (Computer Engineering, AI & Data Science, Electronics, IT, Core vs Tech).
2. Coding culture, hackathons, open-source clubs, competitive programming, tech stack relevance.
3. Industry internships, highest and average placement packages, campus lifestyle.
4. Smart CAP round choice-filling strategy (Freeze vs Float/Betterment).
Be encouraging, strategic, direct, and actionable.`;

    const langInstruction = language === 'mr'
      ? `IMPORTANT: Respond primarily in clear, natural Marathi (मराठी) with English technical terms in parentheses where appropriate.`
      : language === 'hi'
      ? `IMPORTANT: Respond primarily in clear, friendly Hindi (हिंदी) with English technical terms in parentheses where appropriate.`
      : `IMPORTANT: Respond in clear, professional English.`;

    const profileContext = studentProfile
      ? `\nActive Student Profile:
- Stream: ${studentProfile.stream || '12th Science'}
- 12th Board Score: ${studentProfile.boardPercentage || 'Not specified'}%
- Entrance Score (CET/JEE/NEET): ${studentProfile.entranceScore || 'Not specified'} percentile
- Category/Quota: ${studentProfile.category || 'Open'}
- Annual Family Income: ₹${studentProfile.annualIncome || 'Not specified'}
- Preferred Branch: ${studentProfile.preferredBranch || 'Any Engineering'}
- Preferred Location: ${studentProfile.preferredLocation || 'Maharashtra / All India'}`
      : '';

    const systemPrompt = `You are "EduGuide AI" - a premier, state-of-the-art AI Admission Copilot & FAQ Counselor for colleges and universities (specifically expert in Engineering, Management, and Professional degrees, CAP rounds, DTE/State CET Cell, MahaDBT scholarships, and TFWS schemes).

${personaInstructions}
${langInstruction}
${profileContext}

Guidelines:
- If the user asks about eligibility or cutoffs, provide direct percentage/percentile ranges and specific branches.
- If they ask about fees, mention applicable government scholarships (e.g., EBC/OBC 50% waiver, SC/ST 100% waiver, TFWS 100% tuition waiver).
- Format your response using clean Markdown with bullet points, bold key terms, and concise tables when comparing numbers.
- Provide a helpful "Next Step" suggestion at the end of your answer.`;

    if (!ai) {
      // Fallback generator when API key is not ready
      const defaultResp = mode === 'parent' ? FALLBACK_RESPONSES.parent : FALLBACK_RESPONSES.general;
      res.json({
        reply: `${defaultResp}\n\n**Quick Guidance regarding "${message}":**\n- For admissions, ensure you have your 10th & 12th marksheet, entrance scorecard (MHT-CET / JEE Main), and Domicile Certificate ready.\n- If family income is below ₹8 Lakhs, you can claim 50% to 100% scholarship or apply under the TFWS (Tuition Fee Waiver Scheme) quota!\n- Use our interactive **Eligibility Matcher** and **Document Checklist** tabs to get a customized report.`,
      });
      return;
    }

    // Prepare conversation messages
    const formattedHistory = chatHistory.slice(-6).map((item: any) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
        },
      ],
    });

    res.json({ reply: response.text || 'I could not generate an answer at the moment. Please try again.' });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to process admission inquiry',
      details: error.message,
    });
  }
});

// API: Smart Course & Eligibility Recommendation
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { stream, boardPercentage, entranceScore, category, annualIncome, preferredBranch, preferredLocation, language = 'en' } = req.body;

    const prompt = `Analyze this student's admission eligibility and recommend top suitable course branches, cutoff feasibility, and applicable scholarships:
- Stream: ${stream}
- 12th Board Marks: ${boardPercentage}%
- Entrance Score: ${entranceScore} Percentile (CET/JEE/NEET)
- Category: ${category}
- Family Annual Income: ₹${annualIncome}
- Preferred Branch: ${preferredBranch}
- Preferred Location: ${preferredLocation}

Provide your analysis in JSON format with the following fields:
{
  "eligibilityVerdict": "High Chance" | "Moderate Chance" | "Competitive / Ambitious",
  "summary": "2-3 sentences overview of where the student stands",
  "recommendedBranches": [
    {
      "branchName": "e.g. Computer Engineering / AI & Data Science",
      "chance": "High" | "Moderate" | "Ambitious",
      "cutoffEstimate": "e.g. 88 - 94 percentile",
      "avgPackage": "e.g. 7.5 LPA",
      "whyFit": "1 sentence reason"
    }
  ],
  "applicableScholarships": [
    {
      "name": "e.g. TFWS / EBC / Post-Matric",
      "benefit": "e.g. 100% Tuition Fee Waiver or ₹50,000 allowance",
      "eligibilityNote": "Income < 8 LPA with Domicile"
    }
  ],
  "strategicAdvice": [
    "Step 1 recommendation for CAP choice filling",
    "Step 2 backup option",
    "Step 3 document precaution"
  ]
}
Language requested: ${language}. Keep the JSON keys in English, but string values can be localized if language is 'hi' or 'mr', or keep in clear English.`;

    if (!ai) {
      // Deterministic fallback response
      const pct = parseFloat(boardPercentage) || 70;
      const cet = parseFloat(entranceScore) || 75;
      res.json({
        eligibilityVerdict: cet >= 85 ? 'High Chance' : cet >= 65 ? 'Moderate Chance' : 'Competitive / Ambitious',
        summary: `With ${boardPercentage}% in 12th and ${entranceScore} percentile in CET/JEE under ${category} category, you meet core eligibility for Maharashtra & Central technical universities.`,
        recommendedBranches: [
          {
            branchName: 'Computer Engineering / IT',
            chance: cet >= 88 ? 'High' : cet >= 75 ? 'Moderate' : 'Ambitious',
            cutoffEstimate: '82 - 93 percentile',
            avgPackage: '7.8 LPA',
            whyFit: 'High industry placement drive and strong software recruitment demand.',
          },
          {
            branchName: 'Artificial Intelligence & Data Science',
            chance: cet >= 80 ? 'High' : 'Moderate',
            cutoffEstimate: '78 - 89 percentile',
            avgPackage: '7.2 LPA',
            whyFit: 'Emerging branch with strong career trajectory in machine learning & analytics.',
          },
          {
            branchName: 'Electronics & Telecommunication (E&TC / VLSI)',
            chance: 'High',
            cutoffEstimate: '68 - 82 percentile',
            avgPackage: '6.5 LPA',
            whyFit: 'Eligible for both core semiconductor/embedded systems and top IT software firms.',
          },
        ],
        applicableScholarships: [
          {
            name: 'TFWS (Tuition Fee Waiver Scheme)',
            benefit: '100% Tuition Fee Exemption',
            eligibilityNote: 'Available for top 5% merit seats with parental income < ₹8 LPA.',
          },
          {
            name: category === 'Open' ? 'Rajarshi Chhatrapati Shahu Maharaj (EBC)' : `${category} Post-Matric Govt Scholarship`,
            benefit: category === 'Open' ? '50% Tuition Fee & 50% Exam Fee Waiver' : '100% Tuition + Exam Fee Waiver',
            eligibilityNote: 'Valid Income Certificate & Domicile of Maharashtra required.',
          },
        ],
        strategicAdvice: [
          'In CAP Round 1, put top dream autonomous colleges in the first 10 choices, then realistic colleges in choices 11-30.',
          'Keep your Domicile, Non-Creamy Layer (valid till 31 March), and Tahsildar Income Certificate ready before verification.',
          'Always opt for "Betterment" if you get a college ranked below your 5th priority in Round 1.',
        ],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/evaluate:', error);
    res.status(500).json({ error: 'Evaluation failed', details: error.message });
  }
});

// API: Admission Problem Solver / Emergency Troubleshooter
app.post('/api/troubleshoot', async (req: Request, res: Response) => {
  try {
    const { problemType, userQuery, details } = req.body;

    const prompt = `You are an expert admission grievance officer. A student or parent is facing an admission crisis:
Problem Category: ${problemType}
User Detail: ${userQuery || details}

Provide an actionable, reassuring resolution plan with:
1. Immediate action to take in the next 24 hours.
2. Authority to contact (e.g. Scrutiny Center FC coordinator, State CET Cell Helpdesk, Tahsildar, Bank payment gateway).
3. Backup documents / Affidavit / Undertaking rules (e.g., ₹100 stamp paper Proforma, bank UTR tracking).
4. Prevention tip so their application/seat is not canceled.

Format as a structured, reassuring Markdown response.`;

    if (!ai) {
      res.json({
        solution: `### 📋 Step-by-Step Resolution Guide\n\n**1. Immediate Action (Within 24 Hours):**\n- Keep your transaction ID / Application ID handy.\n- If bank payment failed but money was deducted, wait 2 to 4 hours for payment gateway reconciliation (Razorpay/BillDesk) before attempting a second payment.\n\n**2. Verification Center / FC Escalation:**\n- Visit the nearest official Facilitation Center (FC). FC officers have direct administrative clearance to verify provisional application receipts.\n\n**3. Affidavit & Undertaking:**\n- If a Caste Validity or NCL certificate is pending, submit the official Application Receipt along with the standard Undertaking Form (Proforma H/Proforma V).\n\n**4. Helpline Support:**\n- Send an email to the official admission cell with screenshot attachments, candidate name, and mobile number.`,
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ solution: response.text });
  } catch (error: any) {
    console.error('Error in /api/troubleshoot:', error);
    res.status(500).json({ error: 'Troubleshoot failed', details: error.message });
  }
});

// Server configuration: Mount Vite middlewares in dev, serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduGuide AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
