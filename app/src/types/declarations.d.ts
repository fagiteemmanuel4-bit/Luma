declare module '@/api/*' {
  const content: unknown;
  export default content;
}

declare module '@/components/*' {
  import { ComponentType } from 'react';
  const content: ComponentType<Record<string, unknown>>;
  export default content;
}

declare module '@/pages/*' {
  import { ComponentType } from 'react';
  const content: ComponentType<Record<string, unknown>>;
  export default content;
}

declare module '@/context/*' {
  import { ReactNode } from 'react';
  const content: ({ children }: { children: ReactNode }) => JSX.Element;
  export default content;
}

declare module '@/hooks/*' {
  const content: (...args: unknown[]) => unknown;
  export default content;
}
