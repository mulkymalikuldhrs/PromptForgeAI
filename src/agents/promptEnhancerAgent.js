/**
 * Prompt Enhancer Agent for PromptForge AI
 * 
 * This agent improves existing prompts by adding clarity, structure,
 * and effectiveness based on best practices in prompt engineering.
 */

/**
 * Enhance a structured prompt
 * @param {Object} promptStructure - Structured prompt components
 * @param {Object} options - Enhancement options
 * @returns {Object} - Enhanced prompt structure
 */
function enhancePrompt(promptStructure, options = {}) {
  const enhancedPrompt = {
    system: enhanceSystemPrompt(promptStructure.system, options),
    instruction: enhanceInstruction(promptStructure.instruction, options),
    input: enhanceInput(promptStructure.input, options),
    outputTemplate: enhanceOutputTemplate(promptStructure.outputTemplate, options),
    metadata: {
      ...promptStructure.metadata,
      enhancedVersion: (promptStructure.metadata?.version || '1.0') + '-enhanced'
    }
  };
  
  return enhancedPrompt;
}

/**
 * Enhance the system part of a prompt
 * @param {string} systemPrompt - Original system prompt
 * @param {Object} options - Enhancement options
 * @returns {string} - Enhanced system prompt
 */
function enhanceSystemPrompt(systemPrompt, options) {
  if (!systemPrompt) {
    // Create a default system prompt if none exists
    return `You are a helpful, accurate, and versatile AI assistant designed to provide high-quality responses.
You communicate clearly and effectively, adapting your tone and style to suit the task at hand.
You strive to be helpful while respecting ethical boundaries and providing factual information.`;
  }
  
  // Check if the system prompt already has key components
  const hasRoleDefinition = /you are|your role|as an|as a/i.test(systemPrompt);
  const hasCapabilities = /you can|you should|you will|you excel/i.test(systemPrompt);
  const hasLimitations = /you cannot|you should not|you must not|you don't|limitations/i.test(systemPrompt);
  
  let enhanced = systemPrompt;
  
  // Add role definition if missing
  if (!hasRoleDefinition) {
    enhanced = `You are an expert assistant specialized in providing high-quality responses. ${enhanced}`;
  }
  
  // Add capabilities if missing
  if (!hasCapabilities && options.addCapabilities !== false) {
    enhanced += `\n\nYou excel at understanding complex requests and providing clear, accurate, and helpful responses.`;
  }
  
  // Add limitations if missing and requested
  if (!hasLimitations && options.addLimitations === true) {
    enhanced += `\n\nYou should acknowledge when you don't know something or when a request falls outside your capabilities.`;
  }
  
  return enhanced;
}

/**
 * Enhance the instruction part of a prompt
 * @param {string} instruction - Original instruction
 * @param {Object} options - Enhancement options
 * @returns {string} - Enhanced instruction
 */
function enhanceInstruction(instruction, options) {
  if (!instruction) {
    return '';
  }
  
  // Check if the instruction has clear directives
  const hasActionVerbs = /analyze|create|describe|explain|summarize|write|provide|generate|list|compare|evaluate|solve/i.test(instruction);
  const hasStructure = /steps|format|sections|parts|points|items|elements/i.test(instruction);
  
  let enhanced = instruction;
  
  // Add action verbs if missing
  if (!hasActionVerbs) {
    enhanced = `Provide a comprehensive response that addresses the following: ${enhanced}`;
  }
  
  // Add structure if missing and requested
  if (!hasStructure && options.addStructure !== false) {
    enhanced += `\n\nOrganize your response in a clear, logical structure with appropriate headings and sections.`;
  }
  
  // Add specificity if requested
  if (options.addSpecificity === true) {
    enhanced += `\n\nBe specific and provide concrete examples or evidence to support your points.`;
  }
  
  return enhanced;
}

/**
 * Enhance the input examples
 * @param {string} input - Original input examples
 * @param {Object} options - Enhancement options
 * @returns {string} - Enhanced input examples
 */
function enhanceInput(input, options) {
  // Input examples are optional, so return as is if empty
  return input || '';
}

/**
 * Enhance the output template
 * @param {string} outputTemplate - Original output template
 * @param {Object} options - Enhancement options
 * @returns {string} - Enhanced output template
 */
function enhanceOutputTemplate(outputTemplate, options) {
  if (!outputTemplate) {
    // Create a default output template if none exists
    return `Provide your response in a clear, well-structured format that:
1. Directly addresses the main points of the request
2. Organizes information logically with appropriate headings
3. Includes specific details, examples, or evidence where relevant
4. Avoids unnecessary information or tangents
5. Concludes with a summary or key takeaways`;
  }
  
  // Check if the output template has key components
  const hasStructure = /format|structure|sections|parts|points|steps|numbered|list/i.test(outputTemplate);
  const hasSpecificity = /specific|detail|example|evidence|support/i.test(outputTemplate);
  const hasConclusion = /conclude|summary|takeaway|final|end/i.test(outputTemplate);
  
  let enhanced = outputTemplate;
  
  // Add structure if missing
  if (!hasStructure) {
    enhanced += `\n\nOrganize your response with clear headings and a logical structure.`;
  }
  
  // Add specificity if missing
  if (!hasSpecificity && options.addSpecificity !== false) {
    enhanced += `\n\nInclude specific details, examples, or evidence to support your points.`;
  }
  
  // Add conclusion if missing and requested
  if (!hasConclusion && options.addConclusion === true) {
    enhanced += `\n\nConclude with a summary of key points or takeaways.`;
  }
  
  return enhanced;
}

/**
 * Apply jailbreak detection and mitigation
 * @param {Object} promptStructure - Structured prompt
 * @returns {Object} - Cleaned prompt structure and detection results
 */
function detectJailbreak(promptStructure) {
  const jailbreakPatterns = [
    /DAN|do anything now/i,
    /ignore (your|previous) (instructions|programming|guidelines)/i,
    /ignore ethical constraints/i,
    /pretend (you are|to be) (a|an) (human|person|developer|programmer)/i,
    /bypass|circumvent|workaround|break|hack/i,
    /illegal|unethical|harmful content/i,
    /\[\[\[\[/i, // Common in some jailbreak attempts
    /system prompt/i,
    /you are a language model|you are an AI|you are chatgpt/i
  ];
  
  const detectionResults = {
    isJailbreak: false,
    jailbreakScore: 0,
    detectedPatterns: []
  };
  
  // Check each part of the prompt for jailbreak patterns
  const fullPromptText = [
    promptStructure.system,
    promptStructure.instruction,
    promptStructure.input,
    promptStructure.outputTemplate
  ].join(' ');
  
  jailbreakPatterns.forEach(pattern => {
    if (pattern.test(fullPromptText)) {
      detectionResults.isJailbreak = true;
      detectionResults.jailbreakScore += 1;
      detectionResults.detectedPatterns.push(pattern.toString());
    }
  });
  
  // For premium users, we don't clean jailbreaks
  if (detectionResults.isJailbreak) {
    detectionResults.message = `Potential jailbreak detected with score ${detectionResults.jailbreakScore}/10. Premium users can use this prompt without restrictions.`;
  }
  
  return {
    promptStructure,
    detectionResults
  };
}

module.exports = {
  enhancePrompt,
  enhanceSystemPrompt,
  enhanceInstruction,
  enhanceInput,
  enhanceOutputTemplate,
  detectJailbreak
};