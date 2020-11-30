declare module '@halobear/dom' {
  interface Fn {
    append: () => any,
    remove: () => any,
    find: () => any,
    addClass: () => any,
    removeClass: () => any,
    eq: () => any,
    show: () => any,
    hide: () => any,
    css: () => any,
    on: () => any,
    off: () => any,
    index: () => any,
    offAll: () => any,
    val: () => any,
    attr: () => any,
    [key: string]: (...args: any[]) => any 
  }

  interface Bala {
    (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ): HTMLElement[];
    one: (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ) => HTMLElement | undefined;
    // TODO how to define methods?
    fn: Fn,
    noop: () => void,
    getStyle: (el:HTMLElement, styleProp:string) => string
  }

  const $: Bala;

  export default $;
}
