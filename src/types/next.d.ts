declare module "next/server" {
  export class NextRequest extends Request {
    nextUrl: URL;
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined;
      getAll: () => Array<{ name: string; value: string }>;
    };
    json: () => Promise<any>;
  }

  export class NextResponse extends Response {
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined;
      getAll: () => Array<{ name: string; value: string }>;
      set: (name: string, value: string, options?: any) => NextResponse;
    };
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: ResponseInit): NextResponse;
    static rewrite(
      destination: string | URL,
      init?: ResponseInit
    ): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
