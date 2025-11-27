// ==========================================
// Google Apps Script - 安全批改系統
// ==========================================

// CORS 處理函數
function addCorsHeaders(output) {
  return output
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

// 處理 OPTIONS 請求（CORS preflight）
function doOptions(e) {
  return addCorsHeaders(
    ContentService.createTextOutput('')
  );
}

// 處理 GET 請求 - 用於測試
function doGet(e) {
  var output = ContentService
    .createTextOutput(JSON.stringify({"status": "ok", "message": "Apps Script is working"}))
    .setMimeType(ContentService.MimeType.JSON);
  
  return addCorsHeaders(output);
}

// 處理 POST 請求 - 批改答案或儲存結果
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    Logger.log("Received data: " + JSON.stringify(data));
    
    // 批改答案
    if (data.action === 'grade') {
      return gradeAnswers(data);
    }
    
    // 錯誤：未知的 action
    var output = ContentService
      .createTextOutput(JSON.stringify({
        "status": "error",
        "message": "Unknown action: " + data.action
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    return addCorsHeaders(output);
      
  } catch (error) {
    Logger.log("Error: " + error.toString());
    var output = ContentService
      .createTextOutput(JSON.stringify({
        "status": "error",
        "message": error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    return addCorsHeaders(output);
  }
}

// ==========================================
// 批改答案功能
// ==========================================
function gradeAnswers(data) {
  var userId = String(data.userId).trim();
  var userAnswers = data.answers; // [{questionId, userAnswer}, ...]
  
  Logger.log("Grading for userId: " + userId);
  Logger.log("User answers: " + JSON.stringify(userAnswers));
  
  // 讀取完整題目表（含解答）
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var questionsSheet = spreadsheet.getSheetByName("Questions");
  
  if (!questionsSheet) {
    var output = ContentService
      .createTextOutput(JSON.stringify({
        "status": "error",
        "message": "Questions sheet not found. Please create a 'Questions' sheet with answers."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    return addCorsHeaders(output);
  }
  
  // 讀取所有題目（假設格式：題號, 題目, A, B, C, D, 解答）
  var questionsData = questionsSheet.getDataRange().getValues();
  var questionMap = {};
  
  // 建立題目對照表（從第2行開始，跳過標題）
  for (var i = 1; i < questionsData.length; i++) {
    var row = questionsData[i];
    var questionId = String(row[0]).trim(); // 題號
    var correctAnswer = String(row[6]).trim().toUpperCase(); // 解答（第7欄）
    
    questionMap[questionId] = {
      questionId: questionId,
      question: row[1],
      optionA: row[2],
      optionB: row[3],
      optionC: row[4],
      optionD: row[5],
      correctAnswer: correctAnswer
    };
  }
  
  Logger.log("Question map created with " + Object.keys(questionMap).length + " questions");
  
  // 批改每一題
  var correctCount = 0;
  var details = [];
  
  for (var j = 0; j < userAnswers.length; j++) {
    var answer = userAnswers[j];
    var questionId = String(answer.questionId).trim();
    var userAnswer = String(answer.userAnswer).trim().toUpperCase();
    
    var questionInfo = questionMap[questionId];
    
    if (!questionInfo) {
      Logger.log("Warning: Question ID " + questionId + " not found");
      details.push({
        questionId: questionId,
        isCorrect: false,
        correctAnswer: "N/A",
        error: "Question not found"
      });
      continue;
    }
    
    var isCorrect = userAnswer === questionInfo.correctAnswer;
    if (isCorrect) {
      correctCount++;
    }
    
    details.push({
      questionId: questionId,
      question: questionInfo.question,
      optionA: questionInfo.optionA,
      optionB: questionInfo.optionB,
      optionC: questionInfo.optionC,
      optionD: questionInfo.optionD,
      userAnswer: userAnswer,
      correctAnswer: questionInfo.correctAnswer,
      isCorrect: isCorrect
    });
  }
  
  // 計算分數和通過狀態
  var totalCount = userAnswers.length;
  var score = correctCount * 100;
  var passed = correctCount >= 3; // 可以從環境變數讀取，這裡先寫死
  
  Logger.log("Grading complete: " + correctCount + "/" + totalCount + " correct, score: " + score);
  
  // 儲存成績到 Response 表
  saveResult(userId, score, passed, correctCount, totalCount);
  
  // 回傳批改結果
  var result = {
    status: "success",
    score: score,
    correctCount: correctCount,
    totalCount: totalCount,
    passed: passed,
    details: details
  };
  
  var output = ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  
  return addCorsHeaders(output);
}

// ==========================================
// 儲存成績到 Response 表
// ==========================================
function saveResult(userId, score, passed, correctCount, totalCount) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Response");
  
  // 如果 "Response" 工作表不存在，則建立
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Response");
  }
  
  // 檢查是否有標題列
  var lastRow = sheet.getLastRow();
  if (lastRow === 0 || !sheet.getRange(1, 1).getValue()) {
    sheet.clear();
    sheet.appendRow(["工號", "闖關次數", "總分", "最高分", "第一次通關分數", "花了幾次通關", "最近遊玩時間"]);
    
    // 設定欄位格式
    sheet.getRange("A:A").setNumberFormat("@");
    sheet.getRange("B:B").setNumberFormat("0");
    sheet.getRange("C:C").setNumberFormat("0");
    sheet.getRange("D:D").setNumberFormat("0");
    sheet.getRange("E:E").setNumberFormat("0");
    sheet.getRange("F:F").setNumberFormat("0");
    sheet.getRange("G:G").setNumberFormat("yyyy-mm-dd hh:mm:ss");
  }
  
  // 重新取得最新的行數
  lastRow = sheet.getLastRow();
  var dataRange = sheet.getRange(2, 1, Math.max(1, lastRow - 1), 7);
  var values = lastRow > 1 ? dataRange.getValues() : [];
  
  var rowIndex = -1;
  
  // 搜尋工號是否已存在
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === userId) {
      rowIndex = i + 2;
      Logger.log("Found existing userId at row: " + rowIndex);
      break;
    }
  }
  
  if (rowIndex > 0) {
    // 更新現有資料
    Logger.log("Updating existing record for userId: " + userId);
    
    var attemptsCell = sheet.getRange(rowIndex, 2);
    var currentAttempts = Number(attemptsCell.getValue()) || 0;
    var newAttempts = currentAttempts + 1;
    attemptsCell.setValue(newAttempts);
    
    var totalScoreCell = sheet.getRange(rowIndex, 3);
    var currentTotalScore = Number(totalScoreCell.getValue()) || 0;
    totalScoreCell.setValue(currentTotalScore + score);
    
    var highScoreCell = sheet.getRange(rowIndex, 4);
    var currentHighScore = Number(highScoreCell.getValue()) || 0;
    if (score > currentHighScore) {
      highScoreCell.setValue(score);
    }
    
    sheet.getRange(rowIndex, 7).setValue(new Date());
    
    var clearAttemptsCell = sheet.getRange(rowIndex, 6);
    var clearAttempts = clearAttemptsCell.getValue();
    
    if (passed && (clearAttempts === "" || clearAttempts === 0 || clearAttempts === null)) {
      var firstClearScoreCell = sheet.getRange(rowIndex, 5);
      firstClearScoreCell.setNumberFormat("0");
      firstClearScoreCell.setValue(score);
      
      clearAttemptsCell.setNumberFormat("0");
      clearAttemptsCell.setValue(newAttempts);
      
      Logger.log("First clear! Score: " + score + ", Attempts: " + newAttempts);
    }
    
  } else {
    // 新增資料
    Logger.log("Creating new record for userId: " + userId);
    
    var firstClearScore = passed ? score : "";
    var attemptsToClear = passed ? 1 : "";
    
    var newRow = [
      userId,
      1,
      score,
      score,
      firstClearScore,
      attemptsToClear,
      new Date()
    ];
    
    sheet.appendRow(newRow);
    
    var newRowIndex = sheet.getLastRow();
    sheet.getRange(newRowIndex, 5).setNumberFormat("0");
    sheet.getRange(newRowIndex, 6).setNumberFormat("0");
  }
  
  Logger.log("Result saved successfully");
}
