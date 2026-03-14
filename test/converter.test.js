const NotionToMarkdownConverter = require('../src/converter');

// 模拟Notion块数据
const mockBlocks = [
  {
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'This is a test paragraph' },
          plain_text: 'This is a test paragraph',
          annotations: {}
        }
      ]
    }
  },
  {
    type: 'heading_1',
    heading_1: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Test Heading 1' },
          plain_text: 'Test Heading 1',
          annotations: {}
        }
      ]
    }
  },
  {
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Test bullet point' },
          plain_text: 'Test bullet point',
          annotations: {}
        }
      ]
    }
  },
  {
    type: 'to_do',
    to_do: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Test todo item' },
          plain_text: 'Test todo item',
          annotations: {}
        }
      ],
      checked: false
    }
  },
  {
    type: 'divider',
    divider: {}
  }
];

console.log('Testing Notion to Markdown converter...');

const converter = new NotionToMarkdownConverter();
const result = converter.convert(mockBlocks);

console.log('Conversion result:');
console.log(result);

// 验证转换结果
if (result.includes('This is a test paragraph')) {
  console.log('✓ Paragraph conversion works');
} else {
  console.log('✗ Paragraph conversion failed');
}

if (result.includes('# Test Heading 1')) {
  console.log('✓ Heading conversion works');
} else {
  console.log('✗ Heading conversion failed');
}

if (result.includes('- Test bullet point')) {
  console.log('✓ Bulleted list conversion works');
} else {
  console.log('✗ Bulleted list conversion failed');
}

if (result.includes('- [ ] Test todo item')) {
  console.log('✓ Todo item conversion works');
} else {
  console.log('✗ Todo item conversion failed');
}

if (result.includes('---')) {
  console.log('✓ Divider conversion works');
} else {
  console.log('✗ Divider conversion failed');
}

console.log('Test completed!');
