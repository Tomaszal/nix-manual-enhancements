import { useState } from 'react';
import { Item } from './state';
import {
  type OramaWithHighlight,
  type SearchResultWithHighlight,
  type Position,
  searchWithHighlight,
} from '@orama/plugin-match-highlight';

const limit = 30;
const previewStartOffset = 50;
const previewLength = 250;

export const Search = (props: { searchIndex: OramaWithHighlight; onNavigate: () => void }) => {
  const { searchIndex, onNavigate } = props;
  const [active, setActive] = useState(false);
  const [results, setResults] = useState<SearchResultWithHighlight['hits']>([]);
  return (
    <div id='search'>
      <input
        autoFocus
        placeholder='Search this manual...'
        onChange={(event) => {
          const query = event.target.value;
          setActive(!!query);
          searchWithHighlight(searchIndex, { term: query, boost: { title: 2 }, limit: limit + 1 })
            .then((result) => void setResults(result.hits))
            .catch(console.error);
        }}
      />
      {active && (
        <>
          <div id='search-title'>
            {Math.min(results.length, limit)}
            {results.length > limit && '+'} search result(s):
          </div>

          <div id='search-results'>
            {results.map((result) => {
              const item = result.document.item as Item;
              const body = result.document.body as string;

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              const wordPositions: Record<string, Position[]> = (result as any).positions.body;
              const positions = Object.values(wordPositions)
                .reduce((accummulator, positions) => accummulator.concat(positions), [])
                .sort((a, b) => a.start - b.start);

              const firstHit = positions[0]?.start ?? 0;
              const startOffset = Math.min(firstHit, previewStartOffset);
              let previewStart = firstHit - startOffset;
              let previewEnd = previewStart + previewLength;

              // Add extra start offset if preview is under maximum length
              const extraStartOffset = Math.min(Math.max(previewEnd - body.length, 0), previewStart);
              previewStart -= extraStartOffset;
              previewEnd -= extraStartOffset;

              const previewRaw = body.substring(previewStart, previewEnd);
              let preview = <></>;
              let last = 0;

              positions.forEach((position) => {
                if (position.start > previewEnd) return;
                const start = position.start - previewStart;
                const end = start + position.length;
                preview = (
                  <>
                    {preview}
                    {previewRaw.slice(last, start)}
                    <strong>{previewRaw.slice(start, end)}</strong>
                  </>
                );
                last = end;
              });

              preview = (
                <>
                  {preview}
                  {previewRaw.slice(last)}
                </>
              );

              return (
                <div key={result.id} className='search-result'>
                  <a href={item.href} onClick={onNavigate}>
                    {item.breadcrumbs}
                  </a>
                  <div>
                    {previewStart !== 0 && '...'}
                    {preview}
                    {previewEnd < body.length && '...'}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
