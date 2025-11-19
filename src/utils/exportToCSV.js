/**
 * Export scorecard data to CSV format matching Google Sheet structure
 * @param {Object} scorecardData - The scorecard response data
 * @param {Object} template - The scorecard template
 * @param {Object} account - The account being scored
 * @returns {string} - CSV formatted string
 */
export function exportScorecardToCSV(scorecardData, template, account) {
  const rows = [];
  
  // Header row
  rows.push(['Scorecard', 'Data', 'Score', 'Pass/Fail']);
  
  // Date row
  const scorecardDate = scorecardData.scorecard_date 
    ? new Date(scorecardData.scorecard_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(scorecardData.completed_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  
  rows.push(['Date:', scorecardDate, scorecardData.normalized_score, scorecardData.is_pass ? 'PASS' : 'FAIL']);
  
  // Empty row
  rows.push(['', '', '', '']);
  rows.push(['', '', '', '']);
  
  // Group questions by section
  const questionsBySection = {};
  template.questions.forEach((question, index) => {
    const section = question.section || 'Other';
    if (!questionsBySection[section]) {
      questionsBySection[section] = [];
    }
    questionsBySection[section].push({ ...question, index });
  });
  
  // Process each section
  Object.entries(questionsBySection).forEach(([section, questions]) => {
    // Section header
    rows.push([section, '', '', '']);
    
    // Questions in section
    let sectionTotal = 0;
    questions.forEach((question) => {
      // Find response by matching question text or use index
      const response = Array.isArray(scorecardData.responses) 
        ? scorecardData.responses.find(r => r.question_text === question.question_text) || scorecardData.responses[question.index]
        : scorecardData.responses?.[question.index];
      const answer = response?.answer || 0;
      const score = response?.weighted_score || 0;
      sectionTotal += score;
      
      // Format answer based on type
      let answerText = '';
      if (question.answer_type === 'yes_no') {
        answerText = answer === 1 ? 'Yes' : 'No';
      } else {
        answerText = answer.toString();
      }
      
      rows.push([question.question_text, answerText, score, '']);
    });
    
    // Section sub-total
    rows.push(['Sub-total', '', sectionTotal, '']);
    
    // Empty row after section
    rows.push(['', '', '', '']);
  });
  
  // Total score row
  rows.push(['Total Score', '', scorecardData.total_score, scorecardData.is_pass ? 'PASS' : 'FAIL']);
  rows.push(['Normalized Score (out of 100)', '', scorecardData.normalized_score, '']);
  
  // Convert to CSV string
  const csvContent = rows.map(row => {
    return row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (cell === null || cell === undefined) return '';
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',');
  }).join('\n');
  
  return csvContent;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export scorecard to CSV and download
 * @param {Object} scorecardData - The scorecard response data
 * @param {Object} template - The scorecard template
 * @param {Object} account - The account being scored
 */
export function exportAndDownloadScorecard(scorecardData, template, account) {
  const csvContent = exportScorecardToCSV(scorecardData, template, account);
  const dateStr = scorecardData.scorecard_date 
    ? new Date(scorecardData.scorecard_date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  const filename = `${account.name}_${template.name}_${dateStr}.csv`.replace(/[^a-z0-9]/gi, '_');
  downloadCSV(csvContent, filename);
}

