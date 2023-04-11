/*
Language: CFEngine3
Author: Nick Anderson <nick@cmdln.org>
Website: https://docs.cfengine.com
Category: config
*/

export default function(hljs) {
  const CFEngine3_KEYWORDS = {
    components:
	  [ 'agent', 'common', 'server', 'executor', 'monitor' ],

    builtin_promise_types:
    [ 'meta', 'vars', 'classes', 'files', 'commands', 'processes', 'methods', 'reports', 'packages'],

    block_names:
	  [ 'main', '__main__', 'control' ],

    built_in:
	  [
	    'inputs',
	    'bundlesequence',
      'namespace',
      'usebundle',
	  ],

    function_names:
	  [
		  "ifelse",
		  "usemodule",
	  ]

  };

  // CFEngine comments start with a hash and go until the end of the line. They can be trailing comments.
  const COMMENT = hljs.COMMENT('#', '$');

  const IDENT_RE = '([A-Za-z_]|::)(\\w|::)*';

  const TITLE = hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE });

  const VARIABLE = {
    className: 'variable',
    begin: '\\$' + IDENT_RE
  };

  const STRING = {
    className: 'string',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VARIABLE
    ],
    variants: [
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      },
      {
        begin: /`/,
        end: /`/
      }

    ]
  };

  return {
    name: 'CFEngine3',
    aliases: [ 'cf3', 'cfengine', 'cfengine3' ],
    contains: [
      COMMENT,
      VARIABLE,
      STRING,
      {
        beginKeywords: 'bundle',
        end: '\\{|;',
        illegal: /=/,
        contains: [
          TITLE,
          COMMENT
        ]
      },
      {
        beginKeywords: 'body',
        end: '\\{|;',
        illegal: /=/,
        contains: [
          TITLE,
          COMMENT
        ]
      },
      {
        beginKeywords: 'promise',
        end: '\\{|;',
        illegal: /=/,
        contains: [
          TITLE,
          COMMENT
        ]
      },
      {
        begin: '^@if',
        keywords: "if endif",
        end: '^@endif',
        illegal: /=/,
        contains: [
          TITLE,
          COMMENT
        ]
      },
      {
        begin: hljs.IDENT_RE + '\\s+\\{',
        returnBegin: true,
        end: /\S/,
        contains: [
          {
            className: 'keyword',
            begin: hljs.IDENT_RE,
            relevance: 0.2
          },
          {
            begin: /\{/,
            end: /\}/,
            keywords: CFEngine3_KEYWORDS,
            relevance: 0,
            contains: [
              STRING,
              COMMENT,
              {
                begin: '[a-zA-Z_]+\\s*=>',
                returnBegin: true,
                end: '=>',
                contains: [
                  {
                    className: 'attr',
                    begin: hljs.IDENT_RE
                  }
                ]
              },
              {
                className: 'number',
                begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
                relevance: 0
              },
              VARIABLE
            ]
          }
        ],
        relevance: 0
      }
    ]
  };
}
