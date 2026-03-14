require('dotenv').config();
const { Client } = require('@notionhq/client');

class NotionClient {
  constructor() {
    this.apiToken = process.env.NOTION_API_TOKEN;
    if (!this.apiToken) {
      throw new Error('NOTION_API_TOKEN is not set in .env file');
    }
    
    this.client = new Client({
      auth: this.apiToken
    });
  }

  async getPageContent(pageId) {
    try {
      const response = await this.client.blocks.children.list({
        block_id: pageId,
        page_size: 100
      });
      
      return response.results;
    } catch (error) {
      console.error('Error fetching page content:', error.message);
      throw error;
    }
  }

  async getBlockChildren(blockId) {
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        page_size: 100
      });
      
      return response.results;
    } catch (error) {
      console.error('Error fetching block children:', error.message);
      throw error;
    }
  }

  async getAllBlockContent(blockId, depth = 0, maxDepth = 5) {
    if (depth >= maxDepth) {
      return [];
    }

    try {
      const children = await this.getBlockChildren(blockId);
      
      const allContent = [];
      
      for (const child of children) {
        allContent.push(child);
        
        if (child.has_children) {
          const nestedChildren = await this.getAllBlockContent(child.id, depth + 1, maxDepth);
          allContent.push(...nestedChildren);
        }
      }
      
      return allContent;
    } catch (error) {
      console.error('Error fetching all block content:', error.message);
      throw error;
    }
  }

  async getPageWithChildren(pageId) {
    try {
      const pageContent = await this.getPageContent(pageId);
      const allContent = [];
      
      for (const block of pageContent) {
        allContent.push(block);
        
        if (block.has_children) {
          const nestedChildren = await this.getAllBlockContent(block.id, 1);
          allContent.push(...nestedChildren);
        }
      }
      
      return allContent;
    } catch (error) {
      console.error('Error fetching page with children:', error.message);
      throw error;
    }
  }
}

module.exports = NotionClient;