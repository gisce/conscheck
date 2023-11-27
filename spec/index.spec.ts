import { it, expect, describe } from "vitest";
import { evaluateCondition, Condition } from "../src";

describe("evaluateCondition", () => {
  it.only("should correctly evaluate a simple AND condition", () => {
    const condition: Condition = {
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
    expect(evaluateCondition({ object, condition })).toBe(true);
  });

  it("should correctly evaluate a simple OR condition", () => {
    const condition: Condition = {
      condition: "OR",
      rules: [
        {
          field: "age",
          operator: "<",
          value: 18,
        },
        {
          field: "citizenship",
          operator: "=",
          value: false,
        },
      ],
    };

    const object = { age: 17, citizenship: false };
    expect(evaluateCondition({ object, condition })).toBe(true);
  });

  it("should correctly evaluate a nested condition", () => {
    const condition: Condition = {
      condition: "AND",
      rules: [
        {
          condition: "OR",
          rules: [
            {
              field: "age",
              operator: "<",
              value: 18,
            },
            {
              field: "age",
              operator: ">",
              value: 65,
            },
          ],
        },
        {
          field: "citizenship",
          operator: "=",
          value: true,
        },
      ],
    };

    const object = { age: 70, citizenship: true };
    expect(evaluateCondition({ object, condition })).toBe(true);
  });

  it("should correctly evaluate a simple AND condition with undefined fields", () => {
    const condition: Condition = {
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

    const object = {};
    expect(evaluateCondition({ object, condition })).toBe(false);
  });

  it("should correctly evaluate a simple AND condition with $variable in expected rule value", () => {
    const condition: Condition = {
      condition: "AND",
      rules: [
        {
          field: "age",
          operator: ">=",
          value: "$minAge",
        },
        {
          field: "citizenship",
          operator: "=",
          value: true,
        },
      ],
    };

    expect(
      evaluateCondition({
        object: { age: 20, citizenship: true, minAge: 18 },
        condition,
      }),
    ).toBeTruthy();
    expect(
      evaluateCondition({
        object: { age: 20, citizenship: true, minAge: 50 },
        condition,
      }),
    ).toBeFalsy();
  });
});
