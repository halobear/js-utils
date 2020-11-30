declare module '@halobear/dom' {
  type H = HTMLElement[]
  interface Ret extends H {
    append: (el: HTMLElement[] | HTMLElement) => Ret,
    remove: () => Ret,
    addClass: (className: string) => Ret,
    removeClass: (className: string) => Ret,
    eq: (index: number) => Ret,
    show: () => Ret,
    hide: () => Ret,
    html: (html: string) => Ret,
    css: (obj: Record<string, string>) => Ret,
    on: (eventType: string, selector: string|Handler, handler:Handler|undefined) => Ret,
    off: (eventType: string, selector: string|Handler, handler:Handler|undefined) => Ret,
    index: () => Ret,
    offAll: () => Ret,
    val: () => Ret,
    attr: () => Ret,
  }
  type Handler = ((...args:any[]) => Ret)
  interface Bala {
    (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ): Ret;
    one: (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ) => HTMLElement | undefined;
    // TODO how to define methods?
    fn: { [key: string]: (...args: any[]) => any }
    noop: () => void,
    getStyle: (el:HTMLElement, styleProp:string) => string
  }

  const $: Bala;

  export default $;
}
