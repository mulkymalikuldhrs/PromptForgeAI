/**
 * Crawler Agent for PromptForge AI
 * 
 * This agent is responsible for crawling the web to find and extract prompt data
 * from various sources like GitHub repositories, Pastebin, forums, and PDFs.
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Crawl a GitHub repository for prompt files
 * @param {string} repoUrl - URL of the GitHub repository
 * @returns {Promise<Array>} - Array of prompt data objects
 */
async function crawlGitHubRepo(repoUrl) {
  try {
    // Extract owner and repo name from URL
    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    
    // Use GitHub API to get repository contents
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
      }
    });
    
    // Filter for markdown and text files that might contain prompts
    const promptFiles = response.data.filter(file => 
      file.type === 'file' && 
      (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json'))
    );
    
    // Fetch content of each file
    const promptData = await Promise.all(promptFiles.map(async (file) => {
      const fileResponse = await axios.get(file.download_url);
      return {
        source: file.html_url,
        filename: file.name,
        content: fileResponse.data,
        type: 'github'
      };
    }));
    
    return promptData;
  } catch (error) {
    console.error('Error crawling GitHub repo:', error);
    return [];
  }
}

/**
 * Crawl Pastebin for prompt data
 * @param {string} pastebinUrl - URL of the Pastebin paste
 * @returns {Promise<Object>} - Prompt data object
 */
async function crawlPastebin(pastebinUrl) {
  try {
    const response = await axios.get(pastebinUrl);
    const $ = cheerio.load(response.data);
    
    // Extract content from the paste
    const content = $('.paste_code_wpr').text();
    
    return {
      source: pastebinUrl,
      filename: pastebinUrl.split('/').pop(),
      content,
      type: 'pastebin'
    };
  } catch (error) {
    console.error('Error crawling Pastebin:', error);
    return null;
  }
}

/**
 * Crawl a forum for prompt data
 * @param {string} forumUrl - URL of the forum thread
 * @returns {Promise<Array>} - Array of prompt data objects
 */
async function crawlForum(forumUrl) {
  try {
    const response = await axios.get(forumUrl);
    const $ = cheerio.load(response.data);
    
    // This is a simplified example - actual implementation would depend on forum structure
    const posts = $('.post-content').map((i, el) => {
      return {
        source: forumUrl,
        postId: i,
        content: $(el).text(),
        type: 'forum'
      };
    }).get();
    
    return posts;
  } catch (error) {
    console.error('Error crawling forum:', error);
    return [];
  }
}

/**
 * Main function to crawl a URL based on its type
 * @param {string} url - URL to crawl
 * @returns {Promise<Array|Object>} - Prompt data
 */
async function crawlUrl(url) {
  if (url.includes('github.com')) {
    return crawlGitHubRepo(url);
  } else if (url.includes('pastebin.com')) {
    return crawlPastebin(url);
  } else if (url.includes('forum') || url.includes('reddit.com')) {
    return crawlForum(url);
  } else {
    // Generic URL handling
    try {
      const response = await axios.get(url);
      return {
        source: url,
        content: response.data,
        type: 'generic'
      };
    } catch (error) {
      console.error('Error crawling URL:', error);
      return null;
    }
  }
}

module.exports = {
  crawlUrl,
  crawlGitHubRepo,
  crawlPastebin,
  crawlForum
};