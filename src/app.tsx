import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { Item, selectedItemAtom } from './state';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { type OramaWithHighlight } from '@orama/plugin-match-highlight';
import { Search } from './search';

export const App = (props: { title: string; itemTree: Item[]; searchIndex: OramaWithHighlight }) => {
  const { title, itemTree, searchIndex } = props;
  const [selectedItem] = useAtom(selectedItemAtom);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  return (
    <>
      <div style={{ maxWidth: sidebarOpen ? 'var(--sidebar-width)' : 0 }} id='toc'>
        <div>
          <ItemTree itemTree={itemTree} />
        </div>
      </div>

      <div id='navbar'>
        <FiMenu className='navButton' onClick={() => void setSidebarOpen((state) => !state)} />

        <FiSearch
          className='navButton'
          onClick={() =>
            void setSearchActive((state) => {
              const newState = !state;
              if (newState) window.scrollTo({ top: 0, behavior: 'smooth' });
              return newState;
            })
          }
        />

        <span style={{ flexGrow: 1 }}>{title}</span>
      </div>

      <div id='content' className='generic-layout'>
        {searchActive && <Search searchIndex={searchIndex} onNavigate={() => void setSearchActive(false)} />}

        {selectedItem?.body !== undefined && <div dangerouslySetInnerHTML={{ __html: selectedItem.body.innerHTML }} />}
      </div>
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
