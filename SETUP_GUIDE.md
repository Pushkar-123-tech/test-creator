# Quick Setup Guide - Gemini AI Integration

## Steps to Complete Setup

### 1. **Get Your Gemini API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 2. **Update Environment Variables**

Update the `.env` file in the `backend` folder:

```env
GEMINI_API_KEY=your_copied_api_key_here
VITE_SUPABASE_URL=https://vtkcyugklvhouvxsjjfx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xFMjSEC52GrWUYUYUDc9eQ_3U7sOvtM
PORT=3000
NODE_ENV=development
```

### 3. **Start the Backend Server**

```bash
# Navigate to backend folder
cd backend

# Start in development mode (with auto-reload)
npm run dev

# Or start in production mode
npm start
```

You should see:
```
App is running on http://localhost:3000
```

### 4. **Test the API**

Open a new terminal and run:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test AI health
curl http://localhost:3000/api/ai/health

# Test generate tests endpoint
curl -X POST http://localhost:3000/api/ai/generate-tests \
  -H "Content-Type: application/json" \
  -d '{"code":"function add(a,b){return a+b;}","testType":"unit"}'
```

## Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/ai/health` | AI service health check |
| POST | `/api/ai/generate-tests` | Generate test cases |
| POST | `/api/ai/analyze` | Analyze code |
| POST | `/api/ai/document` | Generate documentation |
| POST | `/api/ai/generate-code` | Generate code from requirements |
| POST | `/api/ai/optimize` | Optimize code |
| POST | `/api/ai/chat` | Chat with AI |

## Frontend Integration

Update your frontend `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Database Setup (Optional)

If you want to save test cases and analytics, create these tables in Supabase:

```sql
-- Test Cases Table
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  test_type VARCHAR(50),
  generated_tests JSONB,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code Analysis Table
CREATE TABLE code_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  analysis_result JSONB,
  score INTEGER,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History Table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  code_context TEXT,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Issue: "Cannot find module '@google/generative-ai'"
**Solution**: Run `npm install` in the backend folder

### Issue: "Gemini API key is not configured"
**Solution**: Check that `GEMINI_API_KEY` is set in `.env` file

### Issue: CORS errors in frontend
**Solution**: Update `CORS_ORIGIN` in `.env` to match your frontend URL

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up Gemini API key
3. ✅ Start server with `npm run dev`
4. ✅ Test endpoints with provided curl commands
5. Connect frontend to API endpoints
6. Set up Supabase tables for data persistence

## Support

- Check backend `README.md` for detailed API documentation
- Review `services/geminiService.js` for available AI functions
- Check `routes/aiRoutes.js` for endpoint implementations
