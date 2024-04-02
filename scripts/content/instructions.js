// eslint-disable-next-line no-unused-vars
function generateInstructions(conversation, settings, text, forceAddInstructions = false) {
  if (!text.trim()) return text;
  if (!conversation || !settings) return text;
  const { selectedLanguage, selectedTone, selectedWritingStyle } = settings;

  // if (selectedLanguage.code === 'default'
  //   && selectedTone.code === 'default'
  //   && selectedWritingStyle.code === 'default') return text;

  if (!forceAddInstructions && conversation
    && conversation.languageCode === selectedLanguage.code
    && conversation.toneCode === selectedTone.code
    && conversation.writingStyleCode === selectedWritingStyle.code) return text;

  let includeInstructions = false;
  let instructions = '## Instruções\n';

  const languageInstructions = `**Instrução de idioma:**\nPor favor, ignore todas as instruções de idioma anteriores. A partir de agora, quero que você responda apenas no idioma ${selectedLanguage.name} (languageCode: ${selectedLanguage.code}).\n`;

  const toneInstructions = `**Instrução de tom:**\nPor favor, ignore todas as instruções de tom anteriores. A partir de agora, quero que você responda apenas no tom ${selectedTone.name} (toneCode: ${selectedTone.code}).\n`;

  const writingStyleInstructions = `**Instrução de estilo de escrita:**\nPor favor, ignore todas as instruções de estilo de escrita anteriores. A partir de agora, quero que você responda apenas no estilo de escrita ${selectedWritingStyle.name} (writingStyleCode: ${selectedWritingStyle.code}).\n`;

  if (forceAddInstructions || conversation.languageCode !== selectedLanguage.code) {
    if (selectedLanguage.code !== 'default' || (conversation.languageCode && conversation.languageCode !== 'default')) {
      instructions += languageInstructions;
      includeInstructions = true;
    }
  }
  if (forceAddInstructions || conversation.toneCode !== selectedTone.code) {
    if (selectedTone.code !== 'default' || (conversation.toneCode && conversation.toneCode !== 'default')) {
      instructions += toneInstructions;
      includeInstructions = true;
    }
  }
  if (forceAddInstructions || conversation.writingStyleCode !== selectedWritingStyle.code) {
    if (selectedWritingStyle.code !== 'default' || (conversation.writingStyleCode && conversation.writingStyleCode !== 'default')) {
      instructions += writingStyleInstructions;
      includeInstructions = true;
    }
  }
  instructions += 'POR FAVOR, SIGA TODAS AS INSTRUÇÕES ACIMA, E NÃO REPITA OU DIGITE QUALQUER CONFIRMAÇÃO GERAL OU UMA CONFIRMAÇÃO SOBRE QUALQUER UMA DAS INSTRUÇÕES ACIMA NA SUA RESPOSTA\n';
  instructions += '## Fim das Instruções';

  if (!includeInstructions) return text;
  return `${instructions}\n\n${text}`;
}
