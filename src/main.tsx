import React from 'react';
import ReactDOM from 'react-dom/client';
import { getDefaultStore } from 'jotai';
import { App } from './app';
import { docbook, docbookHeader, header, topLevelToc } from './elements';
import { Item, selectedItemAtom } from './state';
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

const getItemTree = (root: Element, toc: Element) =>
  Array.from(toc.querySelectorAll('dl.toc > dt a')).map((link) => {
    const title = link.textContent;
    const href = link.attributes.getNamedItem('href')?.value;

    if (!title || !href) throw Error('Item elements not found');

    const item: Item = { title, href };

    if (href.includes('#')) {
      const anchor = href.substring(href.indexOf('#')).replaceAll('.', '\\.');
      const body = root.querySelector(`:has(> .titlepage ${anchor})`);
      body?.remove();
      const toc = body?.querySelector('.titlepage + :has(.toc)');
      toc?.remove();

      if (!body) throw Error(`Item body not found for ${href}`);
      const children = !toc ? undefined : getItemTree(body, toc);

      item.body = body;
      item.children = children;
    }

    return item;
  });

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

const itemTree = getItemTree(docbook, topLevelToc);
const items: Item[] = flattenItemTree(itemTree);

getDefaultStore().set(selectedItemAtom, items[0]);
setupItemMetadata();
selectAnchorItem();

window.addEventListener('hashchange', selectAnchorItem);

ReactDOM.createRoot(docbook).render(
  <React.StrictMode>
    <App title={title} itemTree={itemTree} />
  </React.StrictMode>,
);
