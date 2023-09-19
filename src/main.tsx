import React from 'react';
import ReactDOM from 'react-dom/client';
import { getDefaultStore } from 'jotai';
import { App } from './app';
import { docbook, docbookHeader, header, topLevelToc } from './elements';
import { Item, selectedItemAtom } from './state';
import { create, insertMultiple } from '@orama/orama';
import { OramaWithHighlight, afterInsert as highlightAfterInsert } from '@orama/plugin-match-highlight';
import './main.css';

// Save header height to a CSS variable
document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);

// Remove docbook header title
docbookHeader.remove();

// Get title of manual
const title = (docbookHeader as HTMLElement).innerHTML
  .replace(/<[^>]+>/g, ' ') // remove tags
  .trim() // trim start & end spaces
  .replace(/\s+/g, ' '); // replace multiple spaces with one

const getItemTree = (props: { root: Element; toc: Element; parentBreadcrumbs?: string }) => {
  const { root, toc, parentBreadcrumbs } = props;
  return Array.from(toc.querySelectorAll('dl.toc > dt a')).map((link) => {
    const title = link.textContent;
    const href = link.attributes.getNamedItem('href')?.value;

    if (!title || !href) throw Error('Item elements not found');

    let breadcrumbs = '';
    if (parentBreadcrumbs) breadcrumbs += `${parentBreadcrumbs} » `;
    breadcrumbs += title;

    const item: Item = { title, breadcrumbs, href };

    if (href.includes('#')) {
      const anchor = href.substring(href.indexOf('#')).replaceAll('.', '\\.');
      const body = root.querySelector(`:has(> .titlepage ${anchor})`);
      body?.remove();
      const toc = body?.querySelector('.titlepage + :has(.toc)');
      toc?.remove();

      if (!body) throw Error(`Item body not found for ${href}`);
      const children = !toc ? undefined : getItemTree({ root: body, toc, parentBreadcrumbs: breadcrumbs });

      item.body = body;
      item.children = children;
    }

    return item;
  });
};

const flattenItemTree = (itemTree: Item[]): Item[] => {
  return itemTree.reduce<Item[]>((items, item) => items.concat(item, flattenItemTree(item.children ?? [])), []);
};

const setupItemMetadata = () => {
  items.forEach((item) => {
    if (!item.body) return;
    const content = item.body.querySelector('.titlepage + *');
    item.empty = !content;
  });
};

const selectAnchorItem = () => {
  const anchor = window.location.hash;
  if (!anchor) return;

  const item = items.find((item) => {
    if (item.href === window.location.hash) return true;
    if (item.body?.querySelector(anchor)) return true;
  });

  if (item === undefined) return;

  getDefaultStore().set(selectedItemAtom, (currentItem) => {
    if (currentItem?.href === item.href) return currentItem;
    window.scrollTo({ top: 0, behavior: 'instant' });
    return item;
  });
};

const buildSearchIndex = async (items: Item[]) => {
  const searchIndex = (await create({
    schema: {
      title: 'string',
      body: 'string',
    },
    language: 'english',
    components: { afterInsert: [highlightAfterInsert] },
  })) as OramaWithHighlight;

  await insertMultiple(
    searchIndex,
    items.map((item) => {
      const { title, body } = item;
      return { item, title, body: body?.textContent?.replace(/\s+/g, ' ').trim() ?? '' };
    }),
  );

  return searchIndex;
};

const itemTree = getItemTree({ root: docbook, toc: topLevelToc });
const items: Item[] = flattenItemTree(itemTree);
const searchIndex = await buildSearchIndex(items);

getDefaultStore().set(selectedItemAtom, items[0]);
setupItemMetadata();
selectAnchorItem();

window.addEventListener('hashchange', selectAnchorItem);

ReactDOM.createRoot(docbook).render(
  <React.StrictMode>
    <App title={title} itemTree={itemTree} searchIndex={searchIndex} />
  </React.StrictMode>,
);
