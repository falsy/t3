export declare function parseT3(code: string): any;
export declare function transpile(ast: any[]): string;
export declare function vitePluginT3(): any;

// .t3 파일 타입 선언 직접 포함
declare module "*.t3" {
  const content: any;
  export default content;
}