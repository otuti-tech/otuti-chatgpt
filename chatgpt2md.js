/**
 * @path `chatgpt2md.js`
 * @fullpath `/Users/jasoncarr/projects/BROWSER-DIR/bookmarklets/export-chatgpt-to-markdown/chatgpt2md.js`
 * @version 1.1.0
 * @Updated 2023-08-14
 */

function getFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Get the page title and date for the file name.
  let pageTitle = document.title;

  // remove special characters and spaces from the page title
  pageTitle = pageTitle.replace(/[^a-zA-Z0-9-]/g, '-');

  // Make sure page title doesn't start with a dash
  if (pageTitle.startsWith('-')) {
    pageTitle = pageTitle.slice(1);
  }

  let fileName = `${pageTitle}-${dateString}.md`;

  // Replace any occurrence of one or more dashes with a single dash
  fileName = fileName.replace(/-+/g, '-');

  // Remove any trailing dashes from the file name
  fileName = fileName.replace(/-$/, '');

  return fileName;
}

function convertHtmlToMarkdown(html) {
  return html
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '')
    .replace(/<b>/g, '**')
    .replace(/<\/b>/g, '**')
    .replace(/<i>/g, '_')
    .replace(/<\/i>/g, '_')
    .replace(/<code[^>]*>/g, (match) => {
      const lm = match.match(/class="[^"]*language-([^"]*)"/);
      return lm ? '\n```' + lm[1] + '\n' : '```';
    })
    .replace(/<\/code[^>]*>/g, '```')
    .replace(/<[^>]*>/g, '')
    .replace(/Copy code/g, '')
    .replace(
      /This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area./g,
      '',
    )
    .trim();
}

function getChatMessages() {
  // Each chatMessage is a <div class="text-base"> element.
  const chatMessages = Array.from(document.querySelectorAll('.text-base'));
  return chatMessages;
}

function getMessageText(message) {
  // The message text is in a <span class="whitespace-pre-wrap"> element.
  const messageTextElement = message.querySelector('.whitespace-pre-wrap');
  return messageTextElement ? messageTextElement.innerHTML : '';
}

function getMessageSender(message) {
  // Get the name of the person who sent the message.
  let messageSender = '';

  // img if it's a user, svg if it's chatgpt
  const senderImageElements = message.querySelector('img');
  const senderSVGElements = message.querySelector('svg');
  // messageSender = senderImageElements ? senderImageElements.alt : "ChatGPT";

  // div class="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white"
  const userEmailElement = document.querySelector('nav div.group.relative div.text-left');
  const userEmailText = userEmailElement ? userEmailElement.innerHTML : undefined;

  if (userEmailText && senderImageElements) {
    messageSender = userEmailText;
  } else {
    messageSender = 'ChatGPT';
  }

  return messageSender;
}

function createMarkdownContent(chatMessages) {
  let markdownContent = '';

  for (const message of chatMessages) {
    const messageText = getMessageText(message);

    if (messageText) {
      const messageSender = getMessageSender(message);

      markdownContent += markdownContent == '' ? '' : '--------\n';
      markdownContent += `**${messageSender}:** ${convertHtmlToMarkdown(messageText)}\n\n`;
    }
  }

  return markdownContent;
}

function downloadMarkdownFile(fileName, markdownContent) {
  // Create a new <a> element with the download attribute set to the file name
  // and the href attribute set to a URL representing the markdown content
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.href = URL.createObjectURL(new Blob([markdownContent], { type: 'text/markdown' }));

  // Append the <a> element to the document body and click it to initiate the download
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  // document.body.removeChild(link);

  // Return the length of the markdown content
  return markdownContent.length;
}

function exportChatLog() {
  const fileName = getFileName();
  const chatMessages = getChatMessages();
  const markdownContent = createMarkdownContent(chatMessages);

  // downloadMarkdownFile(fileName, markdownContent);
  const length = downloadMarkdownFile(fileName, markdownContent);

  // Display a message to the user
  console.log(`Exported chat log with ${chatMessages.length} messages (${length} characters)`);
  console.log(`Saved as: ${fileName}`);
  return undefined; // Optional - to prevent the "undefined" message in the console
}
exportChatLog();
