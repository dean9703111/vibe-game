import Papa from 'papaparse';
import axios from 'axios';

const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_QUESTION_URL;
const GOOGLE_SHEET_RESPONSE_URL = import.meta.env.VITE_GOOGLE_SHEET_RESPONSE_URL;

export const fetchQuestions = async () => {
  try {
    // In a real scenario, we fetch from the URL.
    // For now, if the URL is a placeholder or fails, we might want to return mock data or throw.
    // We'll attempt to fetch.
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes('...')) {
        console.warn("Google Sheet URL is not set. Using mock data.");
        return getMockQuestions();
    }

    const response = await axios.get(GOOGLE_SHEET_CSV_URL);
    const csvData = response.data;

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          console.log("Raw CSV Data:", results.data);
          console.log("CSV Meta:", results.meta);
          
          // Expected columns: 題號, 題目, A, B, C, D (解答欄位已移到後端)
          // Filter out empty rows
          const questions = results.data.filter(row => row['題號'] && row['題目']);
          
          if (questions.length === 0) {
            console.warn("No valid questions found. The URL might be incorrect (not CSV) or the sheet is empty.");
            console.warn("Expected columns: 題號, 題目, A, B, C, D");
            // If parsing failed to find questions (likely HTML returned), reject.
            reject(new Error("No valid questions found. Please check your Google Sheet URL (must be CSV)."));
          } else {
            console.log(`✅ Loaded ${questions.length} questions from CSV`);
            resolve(questions);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    // If it's a network error or parsing error, we can either throw or return mock.
    // To help the user debug, let's throw so they see the error message in the UI.
    throw error; 
  }
};

export const submitResult = async (data) => {
    // data can be: { action: 'grade', userId, answers: [...] }
    console.log("Submitting to backend:", data);
    
    try {
        if (!GOOGLE_SHEET_RESPONSE_URL || GOOGLE_SHEET_RESPONSE_URL.includes('...')) {
            console.warn("Google Sheet Response URL is not set. Logging to console.");
            console.log("Submit Data:", data);
            
            // Return mock result for development
            return {
                status: 'error',
                message: 'Backend URL not configured'
            };
        }
        
        // 使用 proxy 路徑來繞過 CORS（僅在開發環境）
        const submitUrl = import.meta.env.DEV 
            ? '/api/submit'
            : GOOGLE_SHEET_RESPONSE_URL;
        
        console.log("Submitting to:", submitUrl);
        
        // Google Apps Script Web Apps need redirect: 'follow' mode
        // IMPORTANT: Use text/plain to avoid CORS preflight (OPTIONS) request
        // Google Apps Script doesn't handle OPTIONS requests well for application/json
        const response = await axios.post(submitUrl, JSON.stringify(data), {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });
        
        console.log("✅ Backend response:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("❌ Error submitting to backend:", error);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        // Return error object
        return {
            status: 'error',
            message: error.message || 'Unknown error'
        };
    }
};

const getMockQuestions = () => {
    return [
        { '題目': 'React 的核心概念是什麼？', 'A': 'MVC', 'B': 'Component', 'C': 'Database', 'D': 'API', '解答': 'B' },
        { '題目': '哪一個 Hook 用於處理副作用？', 'A': 'useState', 'B': 'useEffect', 'C': 'useContext', 'D': 'useReducer', '解答': 'B' },
        { '題目': 'Vite 是什麼？', 'A': '資料庫', 'B': '後端框架', 'C': '前端建置工具', 'D': '瀏覽器', '解答': 'C' },
        { '題目': 'CSS Pixel Art 通常使用什麼屬性來保持清晰？', 'A': 'filter: blur', 'B': 'image-rendering: pixelated', 'C': 'transform: scale', 'D': 'opacity: 0.5', '解答': 'B' },
        { '題目': 'Google Sheet 可以用來當作簡易資料庫嗎？', 'A': '不行', 'B': '可以', 'C': '只能存數字', 'D': '只能存圖片', '解答': 'B' },
    ];
};
