import * as R from 'ramda';
import type { Transform } from 'style-dictionary/types';

import { noCase } from './noCase.js';
import { getValue } from './utils';

const isPx = R.test(/\b\d+px\b/g);

export const sizeRem: Transform = {
  name: 'ds/size/toRem',
  type: 'value',
  transitive: true,
  filter: (token) => ['sizing', 'spacing', 'borderRadius'].includes(token.type as string),
  transform: (token, config) => {
    const value = getValue<string>(token);

    if (isPx(value)) {
      const baseFont = (config.basePxFontSize as unknown as number) || 16;
      const size = parseInt(value);

      if (size === 0) {
        return '0';
      }

      return `${size / baseFont}rem`;
    }
    return value;
  },
};

export const nameKebab: Transform = {
  name: 'name/cti/hierarchical-kebab',
  type: 'name',
  transform: (token, options) => {
    return noCase([options?.prefix].concat(token.path).join('-'), {
      delimiter: '-',
      stripRegexp: /[^A-Z0-9_]+/gi,
    });
  },
};

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

export const typographyShorthand: Transform = {
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  filter: (token) => token.type === 'typography',
  transform: (token, config) => {
    const typography = getValue<Typgraphy>(token);

    const baseFontPx = (config.basePxFontSize as unknown as number) || 16;
    const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;

    return `${typography.fontWeight} ${fontSize}/${typography.lineHeight} '${typography.fontFamily}'`;
  },
};
