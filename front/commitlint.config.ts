import { RuleConfigCondition, RuleConfigSeverity } from '@commitlint/types';

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'wip',
      ],
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  },
};
