const querySelectorOrThrow = (root: ParentNode, query: string) => {
  const result = root.querySelector(query);
  if (result === null) throw Error(`Failed query selector ${query}`);
  return result;
};

export const header = querySelectorOrThrow(document, 'header') as HTMLElement;

const docbookPage = querySelectorOrThrow(document, '.docbook-page');
export const docbookHeader = querySelectorOrThrow(docbookPage, '.page-header');
export const docbook = querySelectorOrThrow(docbookPage, '.docbook');

export const topLevelToc = querySelectorOrThrow(docbook, '.toc');
