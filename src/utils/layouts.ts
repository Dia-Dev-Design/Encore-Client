import { reduce } from 'lodash';

export type MediaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const mediaSizesInPx: [MediaSize, number][] = [
    ['xs', 425],
    ['sm', 768],
    ['md', 992],
    ['lg', 1200],
    ['xl', 1440],
];

export const mediaSizesInPxMap = reduce(
    mediaSizesInPx,
    (result: { [mediaSize: string]: number }, [mediaSize, sizeInPx]: [MediaSize, number]) => ({
        ...result,
        [mediaSize]: sizeInPx,
    }),
    {}
);

// const scree

const getSizeUpMediaQuery = (sizeInPx: number) => `(min-width: ${sizeInPx}px)`;

const getSizeDownMediaQuery = (sizeInPx: number) => `(max-width: ${sizeInPx - 1}px)`;

const getBoundedMediaquery = (mediaSizeIndex: number) => {
    const [, sizeInPx] = mediaSizesInPx[mediaSizeIndex];
    switch (mediaSizeIndex) {
        case mediaSizesInPx.length - 1:
            return getSizeUpMediaQuery(sizeInPx);
        default:
            const [, nextSizeInPx] = mediaSizesInPx[mediaSizeIndex + 1];
            return `${getSizeUpMediaQuery(sizeInPx)} and ${getSizeDownMediaQuery(nextSizeInPx)}`;
    }
};

export const mediaQueries = reduce(
    mediaSizesInPx,
    (result: { [sizeName: string]: string }, [sizeName, sizeInPx], index: number) => ({
        ...result,
        [`${sizeName}Up`]: getSizeUpMediaQuery(sizeInPx),
        [`${sizeName}Down`]: getSizeDownMediaQuery(sizeInPx),
        [sizeName]: getBoundedMediaquery(index),
    }),
    {}
);

export const mediaQuerySnippets = reduce(
    mediaQueries,
    (result: { [mediaQueryName: string]: string }, mediaQuery: string, mediaQueryName: string) => ({
        ...result,
        [mediaQueryName]: `@media ${mediaQuery}`,
    }),
    {}
);

/**
 * Usage in styled components:
 *
 * import mq from '../../constants/layout';
 *
 * const Container = styled.div`
 *   ${mq.smDown} {
 *      color: red;
 *   }
 * `;
 */

export default mediaQuerySnippets;
