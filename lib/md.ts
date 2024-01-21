import { remark } from 'remark';
import strip from 'strip-markdown';
import { visit } from 'unist-util-visit';

export const toPlainText = async (md: string) => {
  return String(await remark().use(strip).process(md));
};

export const getHeading = (md: string) => {
  const tree = remark().parse(md);

  let heading = { depth: 6, text: '' };

  visit(tree, 'heading', (node) => {
    if (node.depth < heading.depth) {
      const text = node.children
        .filter((child) => child.type === 'text')
        .map((child) => ('value' in child ? child.value : ''))
        .join('');

      heading = { depth: node.depth, text };
    }
  });

  return heading.text;
};
