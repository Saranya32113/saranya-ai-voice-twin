import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { SARANYA_PROFILE, SYSTEM_INSTRUCTION_SARANYA } from './src/data/profile.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini API client on the server side
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Intelligent local fallback responder for Saranya's digital twin
 * Ensures 100% reliability if API key is not yet set or under quota limits.
 */
function findFallbackAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  // Check direct matches from the 20 prepared interview questions
  for (const item of SARANYA_PROFILE.interviewAnswers) {
    const questionLower = item.question.toLowerCase();
    if (q.includes(questionLower) || questionLower.includes(q)) {
      return item.answer;
    }
  }

  // Topic matching
  if (q.includes('tell me about yourself') || q.includes('who are you') || q.includes('introduce yourself') || q.includes('life story') || q.includes('background')) {
    return SARANYA_PROFILE.interviewAnswers[0].answer;
  }
  if (q.includes('superpower') || q.includes('greatest strength') || q.includes('best skill')) {
    return SARANYA_PROFILE.interviewAnswers[1].answer;
  }
  if (q.includes('plant disease') || q.includes('leaf') || q.includes('agriculture')) {
    return SARANYA_PROFILE.interviewAnswers[16].answer;
  }
  if (q.includes('why should 100x hire you') || q.includes('why hire you') || q.includes('why 100x') || q.includes('hire')) {
    return SARANYA_PROFILE.interviewAnswers[12].answer;
  }
  if (q.includes('five years') || q.includes('5 years') || q.includes('career goals') || q.includes('future')) {
    return SARANYA_PROFILE.interviewAnswers[11].answer;
  }
  if (q.includes('traffic') || q.includes('number plate') || q.includes('violation')) {
    return "In my Traffic Management System project, I built an AI-based traffic monitoring application using Python, OpenCV, and CNNs. The system identifies vehicle classes, performs automated license plate recognition, and flags speed or lane violations in real-time. It taught me how to handle inference latency under dynamic lighting conditions.";
  }
  if (q.includes('compression') || q.includes('image compression') || q.includes('hd image')) {
    return "My HD Image Compression project focused on dramatically reducing image file size while maintaining visual fidelity. By studying structural similarity and matrix quantization techniques in Python and OpenCV, I was able to optimize compression efficiency without noticeable visual degradation.";
  }
  if (q.includes('support ticket') || q.includes('flask') || q.includes('mysql')) {
    return "For my Support Ticket Management System, I developed a full-stack ticketing tool using Flask and MySQL. It organizes ticket lifecycles, assigns priorities, and tracks resolution SLAs with role-based dashboards, strengthening my core database and API engineering skills.";
  }
  if (q.includes('internship') || q.includes('google for developers') || q.includes('eduskills')) {
    return SARANYA_PROFILE.interviewAnswers[14].answer;
  }
  if (q.includes('programming language') || q.includes('python') || q.includes('code in')) {
    return SARANYA_PROFILE.interviewAnswers[15].answer;
  }
  if (q.includes('failure') || q.includes('mistake') || q.includes('handle failure')) {
    return SARANYA_PROFILE.interviewAnswers[10].answer;
  }
  if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('cgpa') || q.includes('grade')) {
    return `I completed my B.Tech in Artificial Intelligence and Machine Learning at KIET (Kakinada Institute of Engineering and Technology), affiliated with JNTUK, graduating in 2026 with a CGPA of 8.08. Throughout my academic program, I focused deeply on core mathematics, machine learning theory, computer vision, and building practical software applications.`;
  }
  if (q.includes('skills') || q.includes('tech stack') || q.includes('technologies')) {
    return `My technical stack centers on Python and SQL. In AI and machine learning, I work with Deep Learning, CNNs, Generative AI, PyTorch, TensorFlow, Keras, and OpenCV. For development, I build web solutions using Flask, MySQL, React.js, and manage code with Git and VS Code.`;
  }

  // Default thoughtful conversational first-person response
  return `Thank you for asking! As an AI Engineer graduate from KIET (JNTUK) with an 8.08 CGPA, I specialize in building practical machine learning systems—like my plant disease detection and traffic monitoring applications—using Python, TensorFlow, and OpenCV. I am driven by creating high-impact AI solutions and eager to bring this energy to 100x. Feel free to ask me about my specific projects, technical skills, or problem-solving mindset!`;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required.' });
    return;
  }

  // Attempt Gemini API call first if client is available
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      // Build conversation contents including previous context
      const formattedContents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user' && item.text) {
            formattedContents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'assistant' && item.text) {
            formattedContents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      // Add current user message
      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      // Race the Gemini API call with a 6-second timeout to maintain rapid voice latency
      const geminiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_SARANYA,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API call timed out')), 6000);
      });

      const response = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && response.text && response.text.trim().length > 0) {
        res.json({
          reply: response.text.trim(),
          source: 'gemini',
        });
        return;
      }
    } catch (err: unknown) {
      console.warn('Gemini call bypassed/failed, seamlessly using grounded profile responder:', err);
      // Fall through to fallback response
    }
  }

  // Fallback to grounded profile responder
  const fallbackReply = findFallbackAnswer(message);
  res.json({
    reply: fallbackReply,
    source: 'knowledge_base',
  });
});

// Setup server with Vite in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Saranya AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
