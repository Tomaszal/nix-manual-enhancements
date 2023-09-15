import { atom } from 'jotai';

export type Item = {
  title: string;
  href: string;
  body?: Element;
  children?: Item[];
  empty?: boolean;
};

export const selectedItemAtom = atom<Item | undefined>(undefined);
