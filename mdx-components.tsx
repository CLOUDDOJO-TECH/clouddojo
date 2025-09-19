import type { MDXComponents } from 'mdx/types';
import { CustomComponents } from '@/components/mdx/mdx-components';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...CustomComponents,
    ...components,
  };
}