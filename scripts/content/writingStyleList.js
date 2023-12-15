// eslint-disable-next-line no-unused-vars
const writingStyleList = [
  {
    code: 'default',
    name: 'Default',
    description: 'No specific writing style instruction',
  },
  {
    code: 'academic',
    name: 'Academic',
    description:
      'This style is used in scholarly writing and emphasizes precision, clarity, and objectivity. It often involves using formal language and adhering to specific citation and formatting guidelines. Example: &quot;In this study, we aim to investigate the impact of climate change on global food security using a combination of statistical analysis and field research.&quot;',
  },
  {
    code: 'analytical',
    name: 'Analytical',
    description:
      'This style is characterized by a focus on breaking down complex ideas into smaller parts and analyzing them in detail. It often involves using logic and evidence to support an argument. Example: &quot;By examining the historical and cultural context of the text, we can gain a deeper understanding of its meaning and significance.&quot;',
  },
  {
    code: 'argumentative',
    name: 'Argumentative',
    description:
      'This style involves presenting a clear and compelling argument on a particular topic, often using evidence and logical reasoning. It aims to persuade the reader to accept a particular viewpoint or opinion. Example: &quot;The evidence clearly shows that implementing stricter gun control measures will reduce the incidence of gun violence in our communities.&quot;',
  },
  {
    code: 'conversational',
    name: 'Conversational',
    description:
      'This style is casual and informal, often using contractions and colloquial language. It is characterized by a friendly, approachable tone and aims to create a sense of connection with the reader. Example: &quot;Hey, have you heard about that new restaurant down the street? I tried it last week and it was amazing!&quot;',
  },
  {
    code: 'creative',
    name: 'Creative',
    description:
      'This style is characterized by a focus on imagination, expression, and originality. It often involves using literary devices such as metaphors, imagery, and symbolism to convey meaning. Example: &quot;The sunset painted the sky with a palette of fiery oranges and deep purples, as if nature itself were an artist at work.&quot;',
  },
  {
    code: 'critical',
    name: 'Critical',
    description:
      'This style involves analyzing and evaluating a particular topic or issue, often with a focus on identifying flaws or weaknesses. It aims to provide a balanced and objective assessment of the subject matter. Example: &quot;Although the company’s financial reports appear to show healthy growth, a closer examination reveals several areas of concern, including high levels of debt and a lack of diversity in revenue streams.&quot;',
  },
  {
    code: 'descriptive',
    name: 'Descriptive',
    description:
      'This style is characterized by a focus on vividly describing a particular object, person, or experience, often using sensory details. It aims to create a clear and immersive picture in the reader’s mind. Example: &quot;The old, weathered barn creaked and groaned in the wind, its paint peeling and roof sagging under the weight of years of neglect.&quot;',
  },
  {
    code: 'epigrammatic',
    name: 'Epigrammatic',
    description:
      'This style involves using short, witty statements or aphorisms to convey a particular message or idea. It often aims to be memorable and thought-provoking. Example: &quot;The only way to do great work is to love what you do.&quot; - Steve Jobs',
  },
  {
    code: 'epistolary',
    name: 'Epistolary',
    description:
      'This style involves using letters or other forms of correspondence to convey a story or message. It often aims to create a sense of intimacy or immediacy with the reader. Example: &quot;Dear John, I can hardly believe it’s been a year since we last spoke. I hope this letter finds you well and that you are enjoying life as much as ever.&quot;',
  },
  {
    code: 'expository',
    name: 'Expository',
    description:
      'This style is characterized by a focus on explaining or informing the reader about a particular topic, often in a clear and concise manner. It aims to provide a comprehensive understanding of the subject matter. Example: &quot;In this essay, we will explore the history and evolution of the internet, from its origins as a military communications network to its current status as a ubiquitous tool for communication and information exchange.&quot;',
  },
  {
    code: 'informative',
    name: 'Informative',
    description:
      'This style aims to provide information on a particular topic or subject, often using a straightforward and objective tone. Example: &quot;This brochure provides an overview of the services offered by our company, including pricing, hours of operation, and contact information.&quot;',
  },
  {
    code: 'instructive',
    name: 'Instructive',
    description:
      'This style is focused on providing guidance or directions on how to perform a specific task or achieve a particular goal. It often involves using a step-by-step approach and clear, concise language. Example: &quot;To make a perfect cup of coffee, start by measuring out the right amount of grounds and heating your water to the proper temperature.&quot;',
  },
  {
    code: 'journalistic',
    name: 'Journalistic',
    description:
      'This style is used in news reporting and aims to provide timely, accurate, and objective information on current events or issues. It often involves using a clear and concise writing style, as well as adhering to established journalistic principles such as objectivity and fairness. Example: &quot;In the wake of the recent political scandal, many are calling for a full investigation into allegations of corruption and misconduct.&quot;',
  },
  {
    code: 'metaphorical',
    name: 'Metaphorical',
    description:
      ' This style involves using figurative language and metaphors to convey a particular message or idea. It often aims to create a sense of imagery or evoke a particular emotion in the reader. Example: &quot;Life is a journey, with each step leading us closer to our destination.&quot;',
  },
  {
    code: 'narrative',
    name: 'Narrative',
    description:
      'This style involves telling a story or recounting a particular experience, often using descriptive language and vivid details. It aims to engage the reader and create a sense of suspense or drama. Example: &quot;As I walked through the dark, abandoned alleyway, I could feel my heart pounding in my chest. Suddenly, a figure emerged from the shadows, and I knew I was in trouble.&quot;',
  },
  {
    code: 'persuasive',
    name: 'Persuasive',
    description:
      'This style aims to persuade the reader to accept a particular viewpoint or opinion, often using emotional appeals and logical arguments. It involves using evidence and reasoning to support a particular position. Example: &quot;By implementing renewable energy sources, we can not only reduce our carbon footprint, but also create new jobs and stimulate economic growth.&quot;',
  },
  {
    code: 'poetic',
    name: 'Poetic',
    description:
      'This style is characterized by a focus on language, rhythm, and sound. It often uses literary devices such as metaphor and symbolism to convey meaning and create an emotional impact. Example: &quot;The wind whispered through the trees, its voice a haunting melody that echoed through the night.&quot;',
  },
  {
    code: 'satirical',
    name: 'Satirical',
    description:
      'This style involves using irony, sarcasm, and humor to critique or expose the flaws and shortcomings of a particular subject or idea. It aims to entertain while also making a serious point. Example: &quot;In a shocking display of political posturing, the senator proposed a bill to ban water, citing concerns about its potentially harmful effects on the environment.&quot;',
  },
  {
    code: 'technical',
    name: 'Technical',
    description:
      'This style is used in writing about technical or specialized subjects, such as science or engineering. It often involves using precise and technical language and adhering to established conventions and guidelines. Example: &quot;The results of our experiment were consistent with previous studies, indicating a strong correlation between temperature and pressure in the system.&quot;',
  },
];
