import { it, expect, describe } from "vitest";
import { evaluateCondition, Condition } from "../src";

describe("evaluateCondition", () => {
  it("should correctly evaluate a simple AND condition", () => {
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

    const sampleObject = { age: 20, citizenship: true };
    expect(evaluateCondition(sampleObject, condition)).toBe(true);
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

    const sampleObject = { age: 17, citizenship: false };
    expect(evaluateCondition(sampleObject, condition)).toBe(true);
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

    const sampleObject = { age: 70, citizenship: true };
    expect(evaluateCondition(sampleObject, condition)).toBe(true);
  });
});
