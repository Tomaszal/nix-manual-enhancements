import { useAtom } from 'jotai';
import React from 'react';
import { Item, selectedItemAtom } from './state';

export const App = (props: { title: string; itemTree: Item[] }) => {
  const { title, itemTree } = props;
  const [selectedItem] = useAtom(selectedItemAtom);
  return (
    <>
      <div id='toc'>
        <ItemTree itemTree={itemTree} />
      </div>

      <div id='navbar'>{title}</div>

      {selectedItem?.body !== undefined && (
        <div
          id='content'
          className='generic-layout'
          dangerouslySetInnerHTML={{ __html: selectedItem.body.innerHTML }}
        />
      )}
    </>
  );
};

const ItemTree = (props: { itemTree: Item[]; prefix?: string }) => {
  const { itemTree, prefix } = props;
  const [selectedItem] = useAtom(selectedItemAtom);
  return (
    <ol>
      {itemTree.map((item, index) => (
        <React.Fragment key={item.href}>
          <li>
            <a href={item.href} data-selected={item.href === selectedItem?.href} data-empty={item.empty}>
              <strong>
                {prefix}
                {index + 1}.
              </strong>{' '}
              {item.title}
            </a>
          </li>
          {item.children && <ItemTree itemTree={item.children} prefix={`${prefix ?? ''}${index + 1}.`} />}
        </React.Fragment>
      ))}
    </ol>
  );
};
