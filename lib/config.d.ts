import { Context } from 'probot';
import * as t from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { CommitState } from './model/pullrequest';
export declare const Config: t.ExactC<t.TypeC<{
    requiredStatusRegex: t.StringC;
    pendingStatusRegex: t.StringC;
    successStatusRegex: t.StringC;
    errorStatusRegex: t.StringC;
}>>;
export declare type IConfig = t.TypeOf<typeof Config>;
export declare const DefaultConfig: IConfig;
export declare type LabelStatus = {
    context: string;
    commitState: CommitState;
    internalState: CommitState | 'required';
};
export declare function matchStatus(input: string, c: IConfig): Option<LabelStatus>;
export declare function _matchStatus(input: string, re: string): Option<string>;
export declare function getConfig(bot: Context, ref: string): Promise<IConfig>;
