# AI Backend - Gemini Integration

This is the backend service for the GenAI Hackathon project with integrated Gemini AI capabilities for code generation, testing, analysis, and optimization.

## Features

- **Test Case Generation**: Automatically generate unit, integration, and edge-case test cases for code snippets
- **Code Analysis**: Analyze code for bugs, security vulnerabilities, and best practice violations
- **Documentation Generation**: Create comprehensive documentation for your code
- **Code Generation**: Generate code based on natural language requirements
- **Code Optimization**: Get suggestions for optimizing code performance
- **AI Chat**: Interact with AI for code-related questions and discussions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gemini API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Supabase project (for database operations)

## Installation

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Configure Environment Variables**

Create a `.env` file in the backend directory with the following variables:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

3. **Get Gemini API Key**

- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Click "Create API Key"
- Copy your API key and paste it in the `.env` file

## Running the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Generate Test Cases
**Request:**
```
POST /api/ai/generate-tests
Content-Type: application/json

{
  "code": "function add(a, b) { return a + b; }",
  "testType": "unit"
}
```

**Response:**
```json
{
  "success": true,
  "testType": "unit",
  "data": {
    "testCases": [
      {
        "id": 1,
        "description": "Test basic addition",
        "input": { "a": 2, "b": 3 },
        "expectedOutput": 5,
        "testCode": "expect(add(2, 3)).toBe(5);"
      }
    ],
    "summary": "Generated 5 comprehensive test cases"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Analyze Code
**Request:**
```
POST /api/ai/analyze
Content-Type: application/json

{
  "code": "function process(data) { return data.map(...); }"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "issues": ["Missing null check", "No error handling"],
    "performance": "O(n) - acceptable",
    "security": ["No input validation"],
    "bestPractices": ["Add JSDoc comments"],
    "suggestions": ["Add error handling", "Validate input"],
    "overallScore": 6
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Generate Documentation
**Request:**
```
POST /api/ai/document
Content-Type: application/json

{
  "code": "function calculateTotal(items) { ... }"
}
```

### 4. Generate Code
**Request:**
```
POST /api/ai/generate-code
Content-Type: application/json

{
  "requirement": "Create a function to validate email addresses",
  "language": "javascript"
}
```

### 5. Optimize Code
**Request:**
```
POST /api/ai/optimize
Content-Type: application/json

{
  "code": "function findDuplicate(arr) { ... }"
}
```

### 6. Chat with AI
**Request:**
```
POST /api/ai/chat
Content-Type: application/json

{
  "message": "How do I optimize this function?",
  "code": "function search(arr, target) { ... }"
}
```

### 7. Health Check
**Request:**
```
GET /api/ai/health
```

## Project Structure

```
backend/
├── config/
│   ├── index.js              # Configuration management
│   └── supabaseClient.js     # Supabase setup
├── constants/
│   └── index.js              # Constants and enums
├── middlewares/
│   └── validators.js         # Request validation middleware
├── routes/
│   └── aiRoutes.js          # AI API endpoints
├── services/
│   └── geminiService.js     # Gemini AI service
├── utils/
│   ├── supabase.ts          # Supabase utilities
│   └── supabaseUtils.js     # Database operations
├── .env                      # Environment variables
├── app.js                    # Express app setup
└── package.json             # Dependencies
```

## Database Schema

### test_cases table
```sql
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  test_type VARCHAR(50),
  generated_tests JSONB,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### code_analysis table
```sql
CREATE TABLE code_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  analysis_result JSONB,
  score INTEGER,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### chat_history table
```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  code_context TEXT,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

All endpoints follow this error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Status Code**: 429 (Too Many Requests)

## Security Considerations

1. **API Key**: Never commit `.env` file with sensitive keys
2. **CORS**: Configure appropriate CORS origins
3. **Input Validation**: All endpoints validate input
4. **Rate Limiting**: Implemented to prevent abuse
5. **Error Messages**: Detailed errors only in development mode

## Troubleshooting

### Error: "Gemini API key is not configured"
- Check `.env` file has `GEMINI_API_KEY` set
- Verify the API key is valid at Google AI Studio

### Error: "Timeout exceeded"
- Increase the timeout value in `config/index.js`
- Check your internet connection
- Verify Gemini API quota

### Error: "CORS policy"
- Update `CORS_ORIGIN` in `.env`
- Check frontend URL matches CORS configuration

## Contributing

1. Create a new branch for features
2. Follow the existing code style
3. Test endpoints before submitting
4. Update documentation

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
