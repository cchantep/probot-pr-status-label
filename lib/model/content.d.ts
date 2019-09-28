import * as t from 'io-ts';
export declare const GetContentResponse: t.ExactC<t.TypeC<{
    data: t.ExactC<t.TypeC<{
        name: t.StringC;
        path: t.StringC;
        sha: t.StringC;
        size: t.NumberC;
        type: t.StringC;
        content: t.StringC;
        encoding: t.StringC;
    }>>;
}>>;
export declare type IGetContentResponse = t.TypeOf<typeof GetContentResponse>;
