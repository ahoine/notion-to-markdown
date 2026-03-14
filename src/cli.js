#!/usr/bin/env node
const { Command } = require('commander');
const NotionClient = require('./notion-client');
const NotionToMarkdownConverter = require('./converter');
const fs = require('fs-extra');
const path = require('path');

const program = new Command();

program
  .version('1.0.0')
  .description('Notion to Markdown converter')
  .option('-p, --page <pageId>', 'Notion page ID to convert')
  .option('-b, --batch <file>', 'File containing multiple page IDs to convert')
  .option('-o, --output <directory>', 'Output directory for Markdown files', './output')
  .option('-t, --token <token>', 'Notion API token (overrides .env file)')
  .parse(process.argv);

const options = program.opts();

async function convertSinglePage(pageId, outputDir) {
  try {
    console.log(`Converting page ${pageId}...`);
    
    const client = new NotionClient();
    const converter = new NotionToMarkdownConverter();
    
    const blocks = await client.getPageWithChildren(pageId);
    const markdown = converter.convert(blocks);
    
    // 确保输出目录存在
    await fs.ensureDir(outputDir);
    
    const outputFile = path.join(outputDir, `${pageId}.md`);
    await fs.writeFile(outputFile, markdown);
    
    console.log(`Successfully converted page ${pageId} to ${outputFile}`);
  } catch (error) {
    console.error(`Error converting page ${pageId}:`, error.message);
  }
}

async function convertBatchPages(filePath, outputDir) {
  try {
    console.log(`Converting batch pages from ${filePath}...`);
    
    const pageIds = await fs.readFile(filePath, 'utf8')
      .then(content => content.split('\n').filter(id => id.trim()));
    
    for (const pageId of pageIds) {
      if (pageId.trim()) {
        await convertSinglePage(pageId.trim(), outputDir);
      }
    }
    
    console.log(`Batch conversion completed`);
  } catch (error) {
    console.error(`Error in batch conversion:`, error.message);
  }
}

async function main() {
  if (options.token) {
    process.env.NOTION_API_TOKEN = options.token;
  }
  
  if (options.page) {
    await convertSinglePage(options.page, options.output);
  } else if (options.batch) {
    await convertBatchPages(options.batch, options.output);
  } else {
    program.help();
  }
}

main();