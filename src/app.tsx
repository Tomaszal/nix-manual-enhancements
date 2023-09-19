import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { Item, selectedItemAtom } from './state';
import { FiMenu } from 'react-icons/fi';

export const App = (props: { title: string; itemTree: Item[] }) => {
  const { title, itemTree } = props;
  const [selectedItem] = useAtom(selectedItemAtom);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <div style={{ maxWidth: sidebarOpen ? 'var(--sidebar-width)' : 0 }} id='toc'>
        <div>
          <ItemTree itemTree={itemTree} />
        </div>
      </div>

      <div id='navbar'>
        <FiMenu className='navButton' onClick={() => void setSidebarOpen((state) => !state)} />

        <span style={{ flexGrow: 1 }}>{title}</span>
      </div>

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
