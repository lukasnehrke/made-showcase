import { OpenAI } from 'openai';
import { toPlainText } from '@/lib/md';

const openai = new OpenAI();

const prompt = `'MADE' is a university course where students work on a data science project. You receive an excerpt of a README.md describing the student's project. Please create a title and a description what this project is about. Use 50 to 100 characters for the description. Use the following structure as output: '{ "title": "title goes here", "description": "description goes here" }': `;

export const summarizeProject = async (contents: string) => {
  const plain = (await toPlainText(contents)).substring(0, 1350);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a knowledgeable assistant who provides concise summaries and output JSON.',
      },
      {
        role: 'user',
        content: prompt + plain,
      },
    ],
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('OpenAI: no content');

  const json = JSON.parse(content) as object;
  if (!('title' in json) || !('description' in json)) {
    throw new Error('OpenAI: no title or description');
  }

  return {
    title: json.title as string,
    description: json.description as string,
  };
};
