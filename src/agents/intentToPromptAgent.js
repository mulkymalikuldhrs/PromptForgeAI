/**
 * Intent to Prompt Agent for PromptForge AI
 * 
 * This agent converts user intent descriptions into structured prompts.
 * It analyzes the user's natural language description of what they want
 * and generates an appropriate prompt structure.
 */

/**
 * Convert user intent to a structured prompt
 * @param {string} userIntent - User's description of what they want
 * @returns {Object} - Structured prompt
 */
async function convertIntentToPrompt(userIntent) {
  try {
    // In a real implementation, this would call an LLM API
    // For demo purposes, we'll use a rule-based approach
    
    const promptStructure = {
      system: '',
      instruction: '',
      input: '',
      outputTemplate: '',
      metadata: {
        source: 'user-intent',
        version: '1.0',
        tags: []
      }
    };
    
    // Extract intent type
    const intentType = analyzeIntentType(userIntent);
    promptStructure.metadata.tags.push(intentType);
    
    // Generate system prompt based on intent type
    promptStructure.system = generateSystemPrompt(intentType, userIntent);
    
    // Extract instruction from user intent
    promptStructure.instruction = extractInstruction(userIntent);
    
    // Generate output template
    promptStructure.outputTemplate = generateOutputTemplate(intentType, userIntent);
    
    return promptStructure;
  } catch (error) {
    console.error('Error converting intent to prompt:', error);
    
    // Fallback to a generic prompt structure
    return {
      system: 'You are a helpful AI assistant that provides accurate and useful information.',
      instruction: userIntent,
      input: '',
      outputTemplate: 'Provide a clear and concise response.',
      metadata: {
        source: 'user-intent',
        version: '1.0',
        tags: ['general']
      }
    };
  }
}

/**
 * Analyze the type of intent from user description
 * @param {string} userIntent - User's intent description
 * @returns {string} - Intent type
 */
function analyzeIntentType(userIntent) {
  const intent = userIntent.toLowerCase();
  
  if (intent.includes('write') || intent.includes('essay') || intent.includes('article') || 
      intent.includes('blog') || intent.includes('content')) {
    return 'writing';
  }
  
  if (intent.includes('code') || intent.includes('program') || intent.includes('develop') || 
      intent.includes('script') || intent.includes('function')) {
    return 'coding';
  }
  
  if (intent.includes('analyze') || intent.includes('research') || intent.includes('study') || 
      intent.includes('investigate') || intent.includes('examine')) {
    return 'analysis';
  }
  
  if (intent.includes('summarize') || intent.includes('summary') || intent.includes('brief') || 
      intent.includes('overview')) {
    return 'summarization';
  }
  
  if (intent.includes('translate') || intent.includes('translation') || 
      intent.includes('convert to') || intent.includes('language')) {
    return 'translation';
  }
  
  if (intent.includes('creative') || intent.includes('story') || intent.includes('poem') || 
      intent.includes('fiction') || intent.includes('imagine')) {
    return 'creative';
  }
  
  if (intent.includes('chat') || intent.includes('conversation') || 
      intent.includes('dialogue') || intent.includes('talk')) {
    return 'conversation';
  }
  
  return 'general';
}

/**
 * Generate a system prompt based on intent type
 * @param {string} intentType - Type of user intent
 * @param {string} userIntent - Original user intent
 * @returns {string} - System prompt
 */
function generateSystemPrompt(intentType, userIntent) {
  switch (intentType) {
    case 'writing':
      return `You are an expert writer with years of experience in creating high-quality written content. 
You excel at crafting engaging, well-structured, and informative pieces that captivate readers.
Your writing is clear, concise, and tailored to the specific needs and goals of each project.`;
      
    case 'coding':
      return `You are an expert software developer with deep knowledge of programming languages, algorithms, and best practices.
You write clean, efficient, and well-documented code that follows industry standards.
You provide explanations for your code to help users understand the implementation.`;
      
    case 'analysis':
      return `You are an analytical expert who excels at examining information, identifying patterns, and drawing insightful conclusions.
You approach problems methodically, consider multiple perspectives, and provide balanced assessments.
Your analysis is thorough, evidence-based, and presented in a clear, structured format.`;
      
    case 'summarization':
      return `You are an expert at distilling complex information into clear, concise summaries.
You identify the most important points and present them in a logical, easy-to-understand manner.
Your summaries capture the essence of the original content while being much shorter and focused.`;
      
    case 'translation':
      return `You are a skilled translator with expertise in multiple languages and cultures.
You provide accurate translations that preserve the meaning, tone, and nuance of the original text.
You consider cultural context and idiomatic expressions to ensure natural-sounding translations.`;
      
    case 'creative':
      return `You are a creative writer with a vivid imagination and excellent storytelling abilities.
You craft engaging narratives with well-developed characters, settings, and plots.
Your creative work is original, evocative, and tailored to the specified genre and style.`;
      
    case 'conversation':
      return `You are a conversational AI designed to engage in natural, helpful dialogue.
You respond to user inputs in a friendly, informative manner while maintaining context.
Your responses are concise yet thorough, and you ask clarifying questions when needed.`;
      
    default:
      return `You are a helpful AI assistant that provides accurate, useful information and assistance.
You respond to user requests in a clear, concise manner and adapt to different types of tasks.
Your goal is to be as helpful as possible while providing high-quality responses.`;
  }
}

/**
 * Extract instruction from user intent
 * @param {string} userIntent - User's intent description
 * @returns {string} - Instruction part of the prompt
 */
function extractInstruction(userIntent) {
  // Remove common prefixes that describe what the user wants but aren't part of the actual task
  const prefixes = [
    'I need a prompt that',
    'I want a prompt to',
    'Create a prompt that',
    'Generate a prompt for',
    'I need an AI to',
    'I want an AI that can',
    'I need help with',
    'I want to',
    'Can you create',
    'Can you make',
    'Please create',
    'Please make'
  ];
  
  let instruction = userIntent;
  
  for (const prefix of prefixes) {
    if (instruction.toLowerCase().startsWith(prefix.toLowerCase())) {
      instruction = instruction.substring(prefix.length).trim();
      // If instruction starts with "can", "will", "would", etc., remove that too
      instruction = instruction.replace(/^(can|will|would|could|should|to)\s+/i, '');
      break;
    }
  }
  
  // Ensure instruction starts with an action verb if possible
  if (!/^[a-z]+\s/i.test(instruction)) {
    // Add a generic action verb if none is present
    instruction = 'Provide ' + instruction;
  }
  
  return instruction;
}

/**
 * Generate output template based on intent type
 * @param {string} intentType - Type of user intent
 * @param {string} userIntent - Original user intent
 * @returns {string} - Output template
 */
function generateOutputTemplate(intentType, userIntent) {
  switch (intentType) {
    case 'writing':
      return `Provide a well-structured written piece with:
1. An engaging introduction that hooks the reader
2. Well-organized body paragraphs with clear topic sentences
3. Supporting details, examples, and evidence
4. A strong conclusion that summarizes key points
5. Appropriate tone and style for the intended audience`;
      
    case 'coding':
      return `Provide your solution in the following format:
1. Brief explanation of the approach
2. Well-commented code implementation
3. Example usage or test cases
4. Explanation of time and space complexity (if applicable)
5. Potential optimizations or alternative approaches`;
      
    case 'analysis':
      return `Structure your analysis as follows:
1. Summary of key findings
2. Detailed analysis with supporting evidence
3. Interpretation of patterns or trends
4. Consideration of limitations or alternative explanations
5. Actionable recommendations or conclusions`;
      
    case 'summarization':
      return `Provide a concise summary that:
1. Captures the main points of the original content
2. Follows a logical structure
3. Omits unnecessary details
4. Maintains accuracy to the source material
5. Can be understood without reference to the original`;
      
    case 'translation':
      return `Provide the translation with:
1. The translated text
2. Notes on any cultural adaptations made
3. Explanation of challenging phrases or idioms (if applicable)
4. Preservation of formatting and structure from the original`;
      
    case 'creative':
      return `Structure your creative piece with:
1. Engaging opening that establishes setting/characters
2. Well-developed narrative or thematic elements
3. Consistent tone and style appropriate to the genre
4. Vivid descriptions and dialogue (if applicable)
5. Satisfying conclusion or resolution`;
      
    case 'conversation':
      return `Respond in a conversational manner that:
1. Directly addresses the user's input
2. Provides helpful and relevant information
3. Maintains a friendly, natural tone
4. Asks clarifying questions if needed
5. Keeps responses concise but thorough`;
      
    default:
      return `Provide a clear, well-structured response that:
1. Directly addresses the request
2. Organizes information logically
3. Includes relevant details and examples
4. Avoids unnecessary information
5. Is easy to understand and actionable`;
  }
}

module.exports = {
  convertIntentToPrompt,
  analyzeIntentType,
  generateSystemPrompt,
  extractInstruction,
  generateOutputTemplate
};