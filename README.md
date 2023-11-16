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
import evaluateCondition from '@gisce/conscheck';

const condition = {
  condition: "AND",
  rules: [
    {
      field: "age",
      operator: ">=",
      value: 18
    },
    {
      field: "citizenship",
      operator: "=",
      value: true
    }
  ]
};

const sampleObject = { age: 20, citizenship: true };

const result = evaluateCondition(sampleObject, condition);
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
          value: 65
        },
        {
          field: "retired",
          operator: "=",
          value: true
        }
      ]
    },
    {
      field: "age",
      operator: "<",
      value: 18
    }
  ]
};

const anotherSampleObject = { age: 70, retired: true };

const nestedResult = evaluateCondition(anotherSampleObject, nestedCondition);
console.log(nestedResult); // Output: true
```

## Contributing
Contributions to `@gisce/conscheck` are welcome. Please feel free to submit pull requests or open issues to improve the library.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
