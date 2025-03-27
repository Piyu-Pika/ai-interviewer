# AI Interviewer API Documentation

## Base URL
```
https://api.aiinterviewer.com/v1
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "message": string
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication Routes

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "error": null,
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    }
  },
  "error": null,
  "message": "Login successful"
}
```

## Resume Management

### Upload Resume
```http
POST /api/resumes
```

**Request Body:**
```json
{
  "file": "file (PDF/DOCX)",
  "jobRole": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeId": "string",
    "fileName": "string",
    "jobRole": "string",
    "uploadDate": "string"
  },
  "error": null,
  "message": "Resume uploaded successfully"
}
```

### Get Resume Details
```http
GET /api/resumes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeId": "string",
    "fileName": "string",
    "jobRole": "string",
    "uploadDate": "string",
    "parsedContent": {
      "skills": ["string"],
      "experience": ["string"],
      "education": ["string"]
    }
  },
  "error": null,
  "message": "Resume details retrieved successfully"
}
```

## Interview Routes

### Start Interview
```http
POST /api/interviews
```

**Request Body:**
```json
{
  "resumeId": "string",
  "jobRole": "string",
  "interviewType": "video" | "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interviewId": "string",
    "status": "initialized",
    "startTime": "string",
    "questions": ["string"]
  },
  "error": null,
  "message": "Interview started successfully"
}
```

### Get Interview Details
```http
GET /api/interviews/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interviewId": "string",
    "status": "string",
    "startTime": "string",
    "endTime": "string",
    "questions": ["string"],
    "responses": ["string"],
    "score": number,
    "feedback": "string"
  },
  "error": null,
  "message": "Interview details retrieved successfully"
}
```

## LangChain Integration

### Analyze Resume
```http
POST /api/langchain/analyze-resume
```

**Request Body:**
```json
{
  "resumeText": "string",
  "jobRole": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": ["string"],
    "experience": ["string"],
    "education": ["string"],
    "recommendedQuestions": ["string"]
  },
  "error": null,
  "message": "Resume analyzed successfully"
}
```

### Generate Questions
```http
POST /api/langchain/generate-questions
```

**Request Body:**
```json
{
  "resumeAnalysis": "object",
  "jobRole": "string",
  "difficulty": "easy" | "medium" | "hard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "string",
        "text": "string",
        "type": "technical" | "behavioral",
        "difficulty": "string"
      }
    ]
  },
  "error": null,
  "message": "Questions generated successfully"
}
```

### Generate Counter Questions
```http
POST /api/langchain/counter-questions
```

**Request Body:**
```json
{
  "interviewId": "string",
  "previousQuestion": "string",
  "candidateResponse": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "counterQuestions": [
      {
        "id": "string",
        "text": "string",
        "context": "string"
      }
    ]
  },
  "error": null,
  "message": "Counter questions generated successfully"
}
```

### Score Interview
```http
POST /api/langchain/score-interview
```

**Request Body:**
```json
{
  "interviewId": "string",
  "transcript": "string",
  "jobRole": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": number,
    "technicalScore": number,
    "communicationScore": number,
    "detailedFeedback": "string",
    "improvementAreas": ["string"]
  },
  "error": null,
  "message": "Interview scored successfully"
}
```

## Video Interview

### Start Video Session
```http
POST /api/interviews/:id/start-video
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "string",
    "token": "string",
    "roomName": "string"
  },
  "error": null,
  "message": "Video session started successfully"
}
```

### End Video Session
```http
POST /api/interviews/:id/end-video
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recordingUrl": "string",
    "duration": number
  },
  "error": null,
  "message": "Video session ended successfully"
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "string",
    "message": "string",
    "details": object
  },
  "message": "Error message"
}
```

### Common Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid token
- `RESUME_001`: Invalid file format
- `RESUME_002`: File too large
- `INTERVIEW_001`: Interview not found
- `INTERVIEW_002`: Interview already completed
- `VIDEO_001`: Video session initialization failed
- `VIDEO_002`: Recording failed

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- 50 file uploads per day per user

## WebSocket Events

### Video Interview Events
```javascript
// Connection
ws://api.aiinterviewer.com/v1/ws/interview/:interviewId

// Events
{
  "type": "question",
  "data": {
    "questionId": "string",
    "text": "string"
  }
}

{
  "type": "response",
  "data": {
    "questionId": "string",
    "response": "string"
  }
}

{
  "type": "counter_question",
  "data": {
    "questionId": "string",
    "text": "string"
  }
}
```

## Security Considerations
1. All endpoints use HTTPS
2. JWT tokens expire after 24 hours
3. Refresh tokens are required for extended sessions
4. File uploads are scanned for malware
5. Rate limiting is implemented on all endpoints
6. Input validation is performed on all requests
7. CORS is enabled for specified domains only 