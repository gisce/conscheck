// src/index.ts

export type Operator = '=' | '>=' | '<=' | '>' | '<' | '!=';

export interface Rule {
  field: string;
  operator: Operator;
  value: string | number | boolean;
}

export interface Condition {
  condition: 'AND' | 'OR';
  rules: Array<Rule | NestedCondition>;
}

type NestedCondition = Condition;

function evaluateCondition(object: Record<string, any>, condition: Rule | NestedCondition): boolean {
  const getValue = (obj: Record<string, any>, valueOrField: string | number | boolean): any => {
    if (typeof valueOrField === 'string' && valueOrField.startsWith('$')) {
      const fieldName = valueOrField.slice(1);
      if (fieldName in obj) {
        return obj[fieldName];
      }
      throw new Error(`Field not found: ${fieldName}`);
    }
    return valueOrField;
  };

  if ('field' in condition && 'operator' in condition && 'value' in condition) {
    const rule = condition as Rule;
    const ruleField = getValue(object, `$${rule.field}`);
    const ruleValue = getValue(object, rule.value);
    switch (rule.operator) {
      case '=':
        return ruleField === ruleValue;
      case '>=':
        return ruleField >= ruleValue;
      case '<=':
        return ruleField <= ruleValue;
      case '>':
        return ruleField > ruleValue;
      case '<':
        return ruleField < ruleValue;
      case '!=':
        return ruleField !== ruleValue;
      default:
        throw new Error(`Unsupported operator: ${rule.operator}`);
    }
  } else if ('condition' in condition && 'rules' in condition) {
    const nestedCondition = condition as NestedCondition;
    if (nestedCondition.condition === 'AND') {
      return nestedCondition.rules.every(rule => evaluateCondition(object, rule));
    } else if (nestedCondition.condition === 'OR') {
      return nestedCondition.rules.some(rule => evaluateCondition(object, rule));
    } else {
      throw new Error(`Unsupported condition type: ${nestedCondition.condition}`);
    }
  } else {
    throw new Error('Invalid condition format');
  }
}

export default evaluateCondition;
