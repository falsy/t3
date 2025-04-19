declare module 'peggy' {
    export interface Parser {
        parse(input: string): any
    }

    export function generate(grammar: string, options?: any): Parser
}