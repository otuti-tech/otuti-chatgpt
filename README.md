
# Otuti ChatGPT ⚡️

A browser extension to add the missing features like **Folders**, **Search**, and **Community Prompts** to ChatGPT

# Features

## Chat Management for ChatGPT

🗂 Folders and reordering for your chats: Create folders easily and organize your chats in folders. Assign a different color to each folder. Drag and drop files to reorder them or add/remove them to folders. Drop a file in the Trash to automatically delete it.

🔁 Auto Sync: Never lose your chats. Automatically sync a copy of all your chats on ChatGPT to your computer

🏎️ Quick Sync: Select the option to only sync the last 100 chats in your history for best performance

📥 Export: Select and Export any number of your chats into multiple formats(.txt, .json, .md). You can also export your prompt history, your settings, your shortcuts and your folders.

🔎 Search and Highlight: Search through all your previous chats on ChatGPT and highlight results for quick review

📌 Pinned Messages: Pin important messages in each conversation and quickly access them using our quick navigation sidebar

🗑️ Group Deletion: Select and delete a group of chats on ChatGPT

🗃 Archived chats: Easily see the chats you have deleted previously.

🕰️ Timestamps: Timestamps for all chats on ChatGPT. Easily switch between "last updated" and "created" time

🔻 More sidebar space: Easily minimize the bottom section of the sidebar for more space to see your conversation list

🕵️‍♀️ Incognito Mode: Chat with History Off and continue it later

## Prompt Management for ChatGPT

⛓️ Prompt Chains: Save a series of prompts as a prompt chain. Then run each prompt in the prompt chain one by one with a single click

⚡️ Auto Complete Menu: Simply type @ or # to open a menu of all your custom prompts or prompt chains right above the input box

🔙 Input History: Every prompt you have ever used is saved privately on your computer. Click on My Prompt History to scroll through all your ChatGPT prompt history, mark them as favorites, or share them with the community

🔼🔽 Quick Access: Just use the Up/Down Arrow key in the input box to go through your previous prompts on ChatGPT

⭐ Favorite prompts: Mark your prompts as favorite in your prompt history

📄 Prompt templates: put words inside {{double curly brackets}} in your prompt, and you'll be asked to replace them before submitting the prompt

🔍 Search Function: Easily search through your prompt history and hundreds of prompt examples from the ChatGPT community

📜 Community Prompts: Get inspiration from hundreds of other prompts created by the ChatGPT Community and share your prompts too. Upvote, downvote, and report prompts, and sort them by the most used or most upvoted. Filter prompts by category and language

🎨 Preset prompt management: Add as many preset custom prompts as you like and quickly access them with a click of a button

🔗 Prompt Sharing: Easily share a direct link to the community prompt with a single click

## Language and Style for ChatGPT

🌍 Language Selection: Change ChatGPT response language with one click (Supports over 190 different languages)

🎭 Tone and Style: Change the Tone and the Writing style of ChatGPT Response

## Utilities for ChatGPT

👥 Custom Instruction Profiles: Easily create and save multiple custom instruction profiles and quickly access them with a click of a button

✂️ Auto Splitter: Automatically split your long input into smaller chunks and send them to ChatGPT one by one.

🗒 Auto summarize: Using the power of auto-splitter, your long text will be summarized into a shorter version so you can ask question

📏 Custom Conversation Width: Adjust the width of the conversation to your liking

🔄  Smart Replace: Automatically replace pre-defined phrases with longer text as you type prompts

🖱️ Auto Click: Automatically click on the default custom prompt button at the end of each response

👉 Custom Instruction: Don't repeat yourself. Automatically  add a custom instruction to the end of each prompt

📊 Word and Character Count: Add the word and character counters to both the user input and the ChatGPT responses

🎛 Model Switcher: Easily change the model(GPT-4, GPT-3.5, etc.) in the middle of the conversation. Simply hover over the ChatGPT avatar icon to see what model was used for each response

📋 Copy and Paste: Easily copy each chat with a click of a button and keep the formatting(support plain text, markdown, and HTML format)

🕶️ Copy Mode: Setting to copy either both user input and ChatGPT response or only the chat response

⌨️ Short keys: Quickly access your most used features using our growing list of short keys

➡️⬅️ Open/close the ChatGPT sidebar for more space on smaller screens

🔒 Safe Mode: Disabled ChatGPT moderation by default when Auto-Sync is ON

⏫⏬ Scroll to the top/bottom

🆕 GPT4 Support: Support GPT4 and shows the number GPT4 requests made based on latest limit from OpenAI


## Installation from source

### Chrome, Microsoft Edge, Brave, etc.

1. Clone the repository: `git clone https://github.com/USERNAME/EXTENSION-NAME.git`
2. Open Chrome and go to `chrome://extensions/` (`edge://extensions` in Microsoft Edge.)
3. Enable Developer mode by toggling the switch in the upper-right corner
4. Click on the "Load unpacked" button in the upper-left corner
5. Select the cloned repository folder

### Firefox

1. Clone or download the extension's source code from GitHub.
2. Extract the downloaded ZIP file to a local folder.
3. Open the manifest file and replace

```
"background": {
	"service_worker": "scripts/background/background.js"
},
```

with

```
"browser_specific_settings": {
	"gecko": {
		"id": "cjiggdeafkdppmdmlcdpfigbalcgbkpg@fancydino.com"
	}
},

"background": {
	"scripts": [
		"scripts/background/initialize.js"
	]
},
```

3. Open Firefox and type `about:debugging` in the URL bar.
4. Click `This Firefox` in the left sidebar, then click the `Load Temporary Add-on` button.
5. Navigate to the local folder where you extracted the extension's source code, and select the `manifest.json` file.

#### For persistent installation

1. Open Firefox, go to `about:config` and set `xpinstall.signatures.required` to `false`.
2. Go to `about:addons`
3. Click on the gear icon in the top right corner of the Add-ons page and select `Install Add-on From File`.
4. Select the `manifest.json` file from the extension's source code folder.
5. Firefox will prompt you to confirm the installation of the addon. Click Install.
6. The addon will be installed and will appear in the list of installed addons on the Add-ons page.
