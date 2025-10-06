
declare module 'vanta/dist/vanta.fog.min' {
  const FOG: (options: any) => { destroy: () => void };
  export default FOG;
}

declare module 'vanta/dist/vanta.*' {
  const content: (options: any) => { destroy: () => void };
  export default content;
}