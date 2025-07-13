/**
 * Prompt Parser Agent for PromptForge AI
 * 
 * This agent is responsible for parsing raw prompt text into structured components:
 * - System: The core instructions that define the AI's behavior
 * - Instruction: Specific tasks or guidelines for the AI
 * - Input: Example inputs or context
 * - Output Template: Expected format for responses
 */

/**
 * Parse a raw prompt text into structured components
 * @param {string} rawPrompt - The raw prompt text to parse
 * @returns {Object} - Structured prompt components
 */
function parsePrompt(rawPrompt) {
  // Default structure
  const promptStructure = {
    system: '',
    instruction: '',
    input: '',
    outputTemplate: '',
    metadata: {
      source: '',
      version: '1.0',
      tags: []
    }
  };
  
  try {
    // Check if the prompt is in markdown format with sections
    if (rawPrompt.includes('#') || rawPrompt.includes('##')) {
      return parseMarkdownPrompt(rawPrompt, promptStructure);
    }
    
    // Check if the prompt is in JSON format
    if (rawPrompt.trim().startsWith('{') && rawPrompt.trim().endsWith('}')) {
      try {
        const jsonPrompt = JSON.parse(rawPrompt);
        return {
          system: jsonPrompt.system || jsonPrompt.systemPrompt || '',
          instruction: jsonPrompt.instruction || jsonPrompt.userPrompt || jsonPrompt.task || '',
          input: jsonPrompt.input || jsonPrompt.context || jsonPrompt.examples || '',
          outputTemplate: jsonPrompt.outputTemplate || jsonPrompt.format || jsonPrompt.responseFormat || '',
          metadata: {
            source: jsonPrompt.source || '',
            version: jsonPrompt.version || '1.0',
            tags: jsonPrompt.tags || []
          }
        };
      } catch (e) {
        // Not valid JSON, continue with other parsing methods
      }
    }
    
    // Default parsing for plain text prompts
    return parseTextPrompt(rawPrompt, promptStructure);
  } catch (error) {
    console.error('Error parsing prompt:', error);
    
    // If parsing fails, put everything in the system field
    promptStructure.system = rawPrompt;
    return promptStructure;
  }
}

/**
 * Parse a markdown-formatted prompt
 * @param {string} markdownPrompt - Markdown prompt text
 * @param {Object} promptStructure - Base structure to populate
 * @returns {Object} - Populated prompt structure
 */
function parseMarkdownPrompt(markdownPrompt, promptStructure) {
  const lines = markdownPrompt.split('\n');
  let currentSection = 'system';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers
    if (line.startsWith('# ') || line.startsWith('## ')) {
      const sectionTitle = line.replace(/^#+ /, '').toLowerCase();
      
      if (sectionTitle.includes('system') || sectionTitle.includes('behavior') || sectionTitle.includes('role')) {
        currentSection = 'system';
        continue;
      } else if (sectionTitle.includes('instruction') || sectionTitle.includes('task') || sectionTitle.includes('guidelines')) {
        currentSection = 'instruction';
        continue;
      } else if (sectionTitle.includes('input') || sectionTitle.includes('context') || sectionTitle.includes('example')) {
        currentSection = 'input';
        continue;
      } else if (sectionTitle.includes('output') || sectionTitle.includes('format') || sectionTitle.includes('response')) {
        currentSection = 'outputTemplate';
        continue;
      }
    }
    
    // Add line to current section
    promptStructure[currentSection] += line + '\n';
  }
  
  // Trim whitespace from all sections
  Object.keys(promptStructure).forEach(key => {
    if (typeof promptStructure[key] === 'string') {
      promptStructure[key] = promptStructure[key].trim();
    }
  });
  
  return promptStructure;
}

/**
 * Parse a plain text prompt
 * @param {string} textPrompt - Plain text prompt
 * @param {Object} promptStructure - Base structure to populate
 * @returns {Object} - Populated prompt structure
 */
function parseTextPrompt(textPrompt, promptStructure) {
  const paragraphs = textPrompt.split('\n\n');
  
  // Heuristic: First paragraph is usually system instructions
  if (paragraphs.length > 0) {
    promptStructure.system = paragraphs[0];
  }
  
  // Heuristic: Look for instruction keywords in paragraphs
  for (let i = 1; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].toLowerCase();
    
    if (paragraph.includes('task:') || paragraph.includes('instruction:') || 
        paragraph.includes('do the following:') || paragraph.includes('your job is to')) {
      promptStructure.instruction += paragraphs[i] + '\n\n';
    } else if (paragraph.includes('example:') || paragraph.includes('input:') || 
               paragraph.includes('context:') || paragraph.includes('for instance:')) {
      promptStructure.input += paragraphs[i] + '\n\n';
    } else if (paragraph.includes('format:') || paragraph.includes('output:') || 
               paragraph.includes('respond with:') || paragraph.includes('your response should')) {
      promptStructure.outputTemplate += paragraphs[i] + '\n\n';
    } else if (i === 1 && promptStructure.instruction === '') {
      // If second paragraph and no instruction yet, assume it's the instruction
      promptStructure.instruction = paragraphs[i];
    } else if (promptStructure.system === '' && i === 0) {
      // If first paragraph and no system yet, assume it's the system
      promptStructure.system = paragraphs[i];
    } else {
      // Default: add to instruction
      promptStructure.instruction += paragraphs[i] + '\n\n';
    }
  }
  
  // Trim whitespace from all sections
  Object.keys(promptStructure).forEach(key => {
    if (typeof promptStructure[key] === 'string') {
      promptStructure[key] = promptStructure[key].trim();
    }
  });
  
  return promptStructure;
}

/**
 * Convert a structured prompt back to text format
 * @param {Object} promptStructure - Structured prompt components
 * @param {string} format - Output format ('text', 'markdown', or 'json')
 * @returns {string} - Formatted prompt text
 */
function formatPrompt(promptStructure, format = 'markdown') {
  if (format === 'json') {
    return JSON.stringify(promptStructure, null, 2);
  }
  
  if (format === 'markdown') {
    let markdown = '';
    
    if (promptStructure.system) {
      markdown += '# System\n\n' + promptStructure.system + '\n\n';
    }
    
    if (promptStructure.instruction) {
      markdown += '# Instruction\n\n' + promptStructure.instruction + '\n\n';
    }
    
    if (promptStructure.input) {
      markdown += '# Input\n\n' + promptStructure.input + '\n\n';
    }
    
    if (promptStructure.outputTemplate) {
      markdown += '# Output Format\n\n' + promptStructure.outputTemplate + '\n\n';
    }
    
    return markdown.trim();
  }
  
  // Default: text format
  let text = '';
  
  if (promptStructure.system) {
    text += promptStructure.system + '\n\n';
  }
  
  if (promptStructure.instruction) {
    text += promptStructure.instruction + '\n\n';
  }
  
  if (promptStructure.input) {
    text += 'Example Input:\n' + promptStructure.input + '\n\n';
  }
  
  if (promptStructure.outputTemplate) {
    text += 'Output Format:\n' + promptStructure.outputTemplate;
  }
  
  return text.trim();
}

module.exports = {
  parsePrompt,
  formatPrompt
};