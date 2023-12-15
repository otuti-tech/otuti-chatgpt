// eslint-disable-next-line no-unused-vars
const toneList = [
  {
    code: 'default',
    name: 'Default',
    description: 'No specific tone instruction',
  },
  {
    code: 'authoritative',
    name: 'Authoritative',
    description:
      'This tone is used to convey expertise or knowledge on a subject. It is characterized by a commanding and confident tone. Example: &quot;As a renowned surgeon with over 20 years of experience, I can assure you that this procedure is safe and effective.&quot;',
  },
  {
    code: 'clinical',
    name: 'Clinical',
    description:
      'This tone is used in technical or medical writing and is characterized by a straightforward, objective, and factual tone. Example: &quot;The results of the study show that the medication reduced symptoms in 75% of patients.&quot;',
  },
  {
    code: 'concise',
    name: 'Concise',
    description:
      'This tone responds with the fewest words & characters possible. It skips extra words & gets right to it. Example: &quot;Data shows sales up 50%,&quot; instead of &quot;Based on the data that we have collected, it appears that there has been an increase in sales by 50%.&quot;',
  },
  {
    code: 'cold',
    name: 'Cold',
    description:
      'This tone is detached, impersonal, and lacking in emotion. Example: &quot;The news of the disaster was reported in a cold and unfeeling manner.&quot;',
  },
  {
    code: 'confident',
    name: 'Confident',
    description:
      'This tone is marked by self-assurance and certainty. Example: &quot;I am confident that with hard work and dedication, we can achieve our goals.&quot;',
  },
  {
    code: 'cynical',
    name: 'Cynical',
    description:
      'This tone is sarcastic and distrustful of human nature. Example: &quot;Oh sure, like that politician really cares about the average person.&quot;',
  },
  {
    code: 'emotional',
    name: 'Emotional',
    description:
      'This tone is characterized by an emphasis on feelings and emotions. Example: &quot;Her heart-wrenching story of survival touched the hearts of many.&quot;',
  },
  {
    code: 'empathetic',
    name: 'Empathetic',
    description:
      'This tone shows understanding and compassion for another person’s perspective or situation. Example: &quot;I understand how difficult this must be for you, and I am here to support you in any way I can.&quot;',
  },
  {
    code: 'formal',
    name: 'Formal',
    description:
      'This tone is used in professional or academic writing and is characterized by a serious and objective tone. Example: &quot;The purpose of this report is to present the findings of our research.&quot;',
  },
  {
    code: 'friendly',
    name: 'Friendly',
    description:
      'This tone is warm, approachable, and welcoming. Example: &quot;Hey there, how’s it going? It’s great to see you again!&quot;',
  },
  {
    code: 'humorous',
    name: 'Humorous',
    description:
      'This tone is light-hearted and amusing, often using wordplay, puns, or jokes. Example: &quot;Why don’t scientists trust atoms? Because they make up everything!&quot;',
  },
  {
    code: 'informal',
    name: 'Informal',
    description:
      'This tone is casual and conversational, often using contractions and colloquial language. Example: &quot;Yo, what’s up? Wanna grab a burger?&quot;',
  },
  {
    code: 'ironic',
    name: 'Ironic',
    description:
      'This tone uses language that expresses the opposite of the intended meaning. Example: &quot;Oh great, another rainy day in paradise.&quot;',
  },
  {
    code: 'optimistic',
    name: 'Optimistic',
    description:
      'This tone is hopeful and positive, expecting the best possible outcome. Example: &quot;Despite the challenges we face, I believe that we can overcome them and create a brighter future.&quot;',
  },
  {
    code: 'pessimistic',
    name: 'Pessimistic',
    description:
      'This tone is negative and expects the worst possible outcome. Example: &quot;I don’t see how we can possibly succeed given the current circumstances.&quot;',
  },
  {
    code: 'persuasive',
    name: 'Persuasive',
    description:
      'This tone is used to convince or influence the reader to take a particular action or adopt a particular viewpoint. It is characterized by the use of rhetorical strategies such as appeals to emotion, logic, and authority. Example: &quot;By choosing to recycle and reduce waste, each one of us has the power to make a meaningful difference for our planet and future generations—let’s take action together today.&quot;',
  },
  {
    code: 'playful',
    name: 'Playful',
    description:
      'This tone is lighthearted and fun, often using playful language and tone. Example: &quot;Come on, don’t be such a party pooper!&quot;',
  },
  {
    code: 'sarcastic',
    name: 'Sarcastic',
    description:
      'This tone is marked by the use of irony and mocking humor. Example: &quot;Oh yeah, that’s a great idea - let’s all jump off a cliff together!&quot;',
  },
  {
    code: 'serious',
    name: 'Serious',
    description:
      'This tone is formal and business-like, often used in professional settings. Example: &quot;I need you to take this matter seriously and provide a detailed report by tomorrow.&quot;',
  },
  {
    code: 'sympathetic',
    name: 'Sympathetic',
    description:
      'This tone is caring and compassionate, showing concern for another person’s feelings. Example: &quot;I’m so sorry to hear about your loss. Please know that I am here for you.&quot;',
  },
  {
    code: 'tentative',
    name: 'Tentative',
    description:
      ' This tone is uncertain and hesitant, often used when expressing doubt or asking for permission. Example: &quot;I was wondering if it might be possible to ask for an extension on the deadline?&quot;',
  },
  {
    code: 'warm',
    name: 'Warm',
    description:
      'This tone is friendly, inviting, and creates a sense of closeness or intimacy with the reader. It often uses positive language and expresses appreciation or gratitude. Example: &quot;Thank you so much for your kindness and support. Your encouragement means the world to me and I feel grateful to have you in my life.&quot;',
  },
];
