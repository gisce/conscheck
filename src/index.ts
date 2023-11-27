export type Operator =
  | "="
  | "=="
  | ">="
  | "<="
  | ">"
  | "<"
  | "!="
  | "<>"
  | "in"
  | "not in";

export interface Rule {
  field: string;
  operator: Operator;
  value: string | number | boolean;
}

export interface Condition {
  condition: "AND" | "OR";
  rules: Array<Rule | NestedCondition>;
}

type NestedCondition = Condition;

export type FieldComparisonParams = {
  fieldName: string;
  valueInObject: any;
  expectedValue: any;
};

export type FieldComparisonResult = {
  modifiedValueInObject?: any;
  modifiedExpectedValue?: any;
  directOutcome?: boolean;
};

const getValue = (
  obj: Record<string, any>,
  valueOrField: string | number | boolean,
): any => {
  if (isField(valueOrField)) {
    const fieldName = (valueOrField as string).slice(1);
    if (fieldName in obj) {
      return obj[fieldName];
    }
  }
  return valueOrField;
};

const isField = (value: string | number | boolean): boolean =>
  typeof value === "string" && value.startsWith("$");

export const evaluateCondition = ({
  object,
  condition,
  evaluateFieldComparison,
}: {
  object: Record<string, any>;
  condition: Rule | NestedCondition;
  evaluateFieldComparison?: (
    args: FieldComparisonParams,
  ) => FieldComparisonResult;
}): boolean => {
  if ("field" in condition && "operator" in condition && "value" in condition) {
    const fieldName = condition.field;
    let valueInObject = object[fieldName];
    let expectedValue = getValue(object, condition.value);

    // Prepare parameters for evaluateFieldComparison
    const comparisonParams: FieldComparisonParams = {
      fieldName,
      valueInObject,
      expectedValue,
    };

    // Evaluate the field comparison if the callback is provided
    const comparisonResult = evaluateFieldComparison?.(comparisonParams) || {
      directOutcome: undefined,
      modifiedValueInObject: null,
      modifiedExpectedValue: null,
    };

    if (comparisonResult?.directOutcome !== undefined) {
      return comparisonResult.directOutcome;
    }
    if (comparisonResult?.modifiedValueInObject !== null) {
      valueInObject = comparisonResult?.modifiedValueInObject;
    }
    if (comparisonResult?.modifiedExpectedValue !== null) {
      expectedValue = comparisonResult?.modifiedExpectedValue;
    }

    switch (condition.operator) {
      case "=":
      case "==":
        return valueInObject == expectedValue;
      case ">=":
        return valueInObject >= expectedValue;
      case "<=":
        return valueInObject <= expectedValue;
      case ">":
        return valueInObject > expectedValue;
      case "<":
        return valueInObject < expectedValue;
      case "<>":
      case "!=":
        return valueInObject != expectedValue;
      case "in":
        return expectedValue.includes(valueInObject);
      case "not in":
        return !expectedValue.includes(valueInObject);
      default:
        throw new Error(
          `Unsupported operator: ${condition.operator as string}`,
        );
    }
  } else if ("condition" in condition && "rules" in condition) {
    const nestedCondition = condition;
    if (nestedCondition.condition === "AND") {
      return nestedCondition.rules.every((rule) =>
        evaluateCondition({ object, condition: rule, evaluateFieldComparison }),
      );
    } else if (nestedCondition.condition === "OR") {
      return nestedCondition.rules.some((rule) =>
        evaluateCondition({ object, condition: rule, evaluateFieldComparison }),
      );
    } else {
      throw new Error(
        `Unsupported condition type: ${nestedCondition.condition as string}`,
      );
    }
  } else {
    throw new Error("Invalid condition format");
  }
};
