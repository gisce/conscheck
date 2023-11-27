# @gisce/conscheck

`@gisce/conscheck` is a versatile TypeScript library for evaluating JSON-based conditions in JavaScript. It allows the definition of complex conditional logic to be interpreted from JSON structures, enabling dynamic and flexible decision-making within applications.

## Features

- Evaluate conditions defined in JSON format.
- Support for both simple and nested conditions.
- Operators include '=', '>=', '<=', '>', '<', and '!='.
- Compatible with both client-side and server-side JavaScript.

## Installation

To install the library, use npm:

```bash
npm install @gisce/conscheck
```

## Usage

Here is a basic example of how to use `@gisce/conscheck`:

```typescript
import { evaluateCondition } from "@gisce/conscheck";

const condition = {
  condition: "AND",
  rules: [
    {
      field: "age",
      operator: ">=",
      value: 18,
    },
    {
      field: "citizenship",
      operator: "=",
      value: true,
    },
  ],
};

const object = { age: 20, citizenship: true };

const result = evaluateCondition({ object, condition });
console.log(result); // Output: true
```

### Nested Conditions

`@gisce/conscheck` also supports nested conditions. Here's an example:

```typescript
const nestedCondition = {
  condition: "OR",
  rules: [
    {
      condition: "AND",
      rules: [
        {
          field: "age",
          operator: ">=",
          value: 65,
        },
        {
          field: "retired",
          operator: "=",
          value: true,
        },
      ],
    },
    {
      field: "age",
      operator: "<",
      value: 18,
    },
  ],
};

const object = { age: 70, retired: true };

const nestedResult = evaluateCondition({ object, condition: nestedCondition });
console.log(nestedResult); // Output: true
```

### Optional `evaluateFieldComparison` Function

You can pass a function to `evaluateCondition` to modify the default field comparison behaviour. This function will be called for each field comparison in the condition, and has the following signature:

```typescript
function evaluateFieldComparison({
  fieldName,
  valueInObject,
  expectedValue,
}: FieldComparisonParams): FieldComparisonResult;
```

The function should return a `FieldComparisonResult` object, which has the following structure:

```typescript
interface FieldComparisonResult {
  modifiedValueInObject?: any;
  modifiedExpectedValue?: any;
  directOutcome?: boolean;
}
```

## Contributing

Contributions to `@gisce/conscheck` are welcome. Please feel free to submit pull requests or open issues to improve the library.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
