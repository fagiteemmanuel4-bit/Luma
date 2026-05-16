declare module '@/api/*' {
  const content: unknown;
  export default content;
}

declare module '@/components/*' {
  const content: React.ComponentType<Record<string, unknown>>;
  export default content;
}

declare module '@/pages/*' {
  const content: React.ComponentType<Record<string, unknown>>;
  export default content;
}

declare module '@/context/*' {
  const content: unknown;
  export default content;
}

declare module '@/hooks/*' {
  const content: unknown;
  export default content;
}
