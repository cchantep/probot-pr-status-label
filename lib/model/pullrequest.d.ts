import * as t from 'io-ts';
export declare type CommitState = 'success' | 'error' | 'failure' | 'pending';
export declare const UserInfo: t.ExactC<t.TypeC<{
    login: t.StringC;
}>>;
export declare const Label: t.ExactC<t.TypeC<{
    name: t.StringC;
}>>;
export declare const PullRequestInfo: t.ExactC<t.TypeC<{
    number: t.NumberC;
    html_url: t.StringC;
    state: t.StringC;
    title: t.StringC;
    user: t.ExactC<t.TypeC<{
        login: t.StringC;
    }>>;
    base: t.ExactC<t.TypeC<{
        label: t.StringC;
        ref: t.StringC;
        sha: t.StringC;
    }>>;
    head: t.ExactC<t.TypeC<{
        label: t.StringC;
        ref: t.StringC;
        sha: t.StringC;
    }>>;
    labels: t.ArrayC<t.ExactC<t.TypeC<{
        name: t.StringC;
    }>>>;
}>>;
export declare type IPullRequestInfo = t.TypeOf<typeof PullRequestInfo>;
export declare const PullRequestEvent: t.ExactC<t.TypeC<{
    pull_request: t.ExactC<t.TypeC<{
        number: t.NumberC;
        html_url: t.StringC;
        state: t.StringC;
        title: t.StringC;
        user: t.ExactC<t.TypeC<{
            login: t.StringC;
        }>>;
        base: t.ExactC<t.TypeC<{
            label: t.StringC;
            ref: t.StringC;
            sha: t.StringC;
        }>>;
        head: t.ExactC<t.TypeC<{
            label: t.StringC;
            ref: t.StringC;
            sha: t.StringC;
        }>>;
        labels: t.ArrayC<t.ExactC<t.TypeC<{
            name: t.StringC;
        }>>>;
    }>>;
    repository: t.ExactC<t.TypeC<{
        id: t.NumberC;
        name: t.StringC;
        owner: t.ExactC<t.TypeC<{
            login: t.StringC;
        }>>;
    }>>;
    sender: t.ExactC<t.TypeC<{
        login: t.StringC;
    }>>;
}>>;
export declare type IPullRequestEvent = t.TypeOf<typeof PullRequestEvent>;
export declare const PullRequestLabelEvent: t.ExactC<t.TypeC<{
    label: t.ExactC<t.TypeC<{
        name: t.StringC;
    }>>;
    pull_request: t.ExactC<t.TypeC<{
        number: t.NumberC;
        html_url: t.StringC;
        state: t.StringC;
        title: t.StringC;
        user: t.ExactC<t.TypeC<{
            login: t.StringC;
        }>>;
        base: t.ExactC<t.TypeC<{
            label: t.StringC;
            ref: t.StringC;
            sha: t.StringC;
        }>>;
        head: t.ExactC<t.TypeC<{
            label: t.StringC;
            ref: t.StringC;
            sha: t.StringC;
        }>>;
        labels: t.ArrayC<t.ExactC<t.TypeC<{
            name: t.StringC;
        }>>>;
    }>>;
    repository: t.ExactC<t.TypeC<{
        id: t.NumberC;
        name: t.StringC;
        owner: t.ExactC<t.TypeC<{
            login: t.StringC;
        }>>;
    }>>;
    sender: t.ExactC<t.TypeC<{
        login: t.StringC;
    }>>;
}>>;
export declare type IPullRequestLabelEvent = t.TypeOf<typeof PullRequestLabelEvent>;
