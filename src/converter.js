class NotionToMarkdownConverter {
  constructor() {
    this.converters = {
      'paragraph': this.convertParagraph.bind(this),
      'heading_1': this.convertHeading.bind(this, 1),
      'heading_2': this.convertHeading.bind(this, 2),
      'heading_3': this.convertHeading.bind(this, 3),
      'heading_4': this.convertHeading.bind(this, 4),
      'heading_5': this.convertHeading.bind(this, 5),
      'heading_6': this.convertHeading.bind(this, 6),
      'bulleted_list_item': this.convertListItem.bind(this, '-'),
      'numbered_list_item': this.convertNumberedListItem.bind(this),
      'to_do': this.convertTodoItem.bind(this),
      'toggle': this.convertToggle.bind(this),
      'child_page': this.convertChildPage.bind(this),
      'image': this.convertImage.bind(this),
      'divider': this.convertDivider.bind(this),
      'quote': this.convertQuote.bind(this),
      'code': this.convertCode.bind(this),
      'table': this.convertTable.bind(this),
      'callout': this.convertCallout.bind(this),
      'embed': this.convertEmbed.bind(this),
      'bookmark': this.convertBookmark.bind(this),
      'link_preview': this.convertLinkPreview.bind(this),
      'equation': this.convertEquation.bind(this),
      'file': this.convertFile.bind(this),
      'pdf': this.convertPdf.bind(this),
      'video': this.convertVideo.bind(this),
      'audio': this.convertAudio.bind(this)
    };
  }

  convertText(text) {
    if (!text || !text.rich_text) return '';
    
    return text.rich_text.map(rt => {
      let content = rt.plain_text;
      
      if (rt.annotations.bold) {
        content = `**${content}**`;
      }
      if (rt.annotations.italic) {
        content = `*${content}*`;
      }
      if (rt.annotations.strikethrough) {
        content = `~~${content}~~`;
      }
      if (rt.annotations.underline) {
        content = `<u>${content}</u>`;
      }
      if (rt.annotations.code) {
        content = `\`${content}\``;
      }
      if (rt.href) {
        content = `[${content}](${rt.href})`;
      }
      
      return content;
    }).join('');
  }

  convertParagraph(block) {
    return this.convertText(block.paragraph) + '\n';
  }

  convertHeading(level, block) {
    const hashes = '#'.repeat(level);
    const content = this.convertText(block[`heading_${level}`]);
    return `${hashes} ${content}\n`;
  }

  convertListItem(prefix, block) {
    const content = this.convertText(block[Object.keys(block).find(key => key.includes('list_item'))]);
    return `${prefix} ${content}\n`;
  }

  convertNumberedListItem(block) {
    // 注意：编号列表需要上下文信息来确定序号，这里简化处理
    return `1. ${this.convertText(block.numbered_list_item)}\n`;
  }

  convertTodoItem(block) {
    const checked = block.to_do.checked ? 'x' : ' ';
    const content = this.convertText(block.to_do);
    return `- [${checked}] ${content}\n`;
  }

  convertToggle(block) {
    const content = this.convertText(block.toggle);
    return `<details>\n<summary>${content}</summary>\n\n</details>\n`;
  }

  convertChildPage(block) {
    return `[[${block.child_page.title}]]\n`;
  }

  convertImage(block) {
    const url = block.image.external?.url || block.image.file?.url;
    const caption = this.convertText(block.image);
    return `![${caption}](${url})\n`;
  }

  convertDivider(block) {
    return '---\n';
  }

  convertQuote(block) {
    const content = this.convertText(block.quote);
    return `> ${content}\n`;
  }

  convertCode(block) {
    const language = block.code.language || '';
    const content = block.code.rich_text.map(rt => rt.plain_text).join('');
    return `\`\`\`${language}\n${content}\n\`\`\`\n`;
  }

  convertTable(block) {
    // 简化处理，实际需要获取表格内容
    return `| Table |\n|-------|\n`;
  }

  convertCallout(block) {
    const content = this.convertText(block.callout);
    const emoji = block.callout.icon?.emoji || '';
    return `> ${emoji} ${content}\n`;
  }

  convertEmbed(block) {
    const url = block.embed.url;
    return `[Embed](${url})\n`;
  }

  convertBookmark(block) {
    const url = block.bookmark.url;
    const title = block.bookmark.title || url;
    return `[${title}](${url})\n`;
  }

  convertLinkPreview(block) {
    const url = block.link_preview.url;
    return `[Link Preview](${url})\n`;
  }

  convertEquation(block) {
    const expression = block.equation.expression;
    return `$${expression}$\n`;
  }

  convertFile(block) {
    const url = block.file.external?.url || block.file.file?.url;
    const name = block.file.name;
    return `[${name}](${url})\n`;
  }

  convertPdf(block) {
    const url = block.pdf.external?.url || block.pdf.file?.url;
    return `[PDF](${url})\n`;
  }

  convertVideo(block) {
    const url = block.video.external?.url || block.video.file?.url;
    return `[Video](${url})\n`;
  }

  convertAudio(block) {
    const url = block.audio.external?.url || block.audio.file?.url;
    return `[Audio](${url})\n`;
  }

  convertBlock(block) {
    const type = block.type;
    const converter = this.converters[type];
    
    if (converter) {
      return converter(block);
    } else {
      console.warn(`Unsupported block type: ${type}`);
      return '';
    }
  }

  convert(blocks) {
    return blocks.map(block => this.convertBlock(block)).join('');
  }
}

module.exports = NotionToMarkdownConverter;