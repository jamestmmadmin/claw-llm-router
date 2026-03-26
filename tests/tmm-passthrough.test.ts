import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyWithPassthrough } from "../tmm-passthrough.js";

describe("classifyWithPassthrough", () => {
  describe("passthrough triggers", () => {
    it("marks 'hello' as passthrough", () => {
      const result = classifyWithPassthrough("hello");
      assert.equal(result.passthrough, true);
      assert.equal(result.tier, "SIMPLE");
      assert.ok(result.signals.some((s) => s.includes("passthrough")));
    });

    it("marks 'what is a dog' as passthrough", () => {
      const result = classifyWithPassthrough("what is a dog");
      assert.equal(result.passthrough, true);
      assert.equal(result.tier, "SIMPLE");
    });

    it("marks 'who is Einstein' as passthrough", () => {
      const result = classifyWithPassthrough("who is Einstein");
      assert.equal(result.passthrough, true);
    });

    it("marks 'capital of France' as passthrough", () => {
      const result = classifyWithPassthrough("capital of France");
      assert.equal(result.passthrough, true);
    });
  });

  describe("passthrough does NOT trigger", () => {
    it("lone 'yes' is SIMPLE but not passthrough (score too high)", () => {
      const result = classifyWithPassthrough("yes");
      assert.equal(result.tier, "SIMPLE");
      assert.equal(result.passthrough, false);
    });

    it("complex prompt is not passthrough", () => {
      const result = classifyWithPassthrough(
        "Build a distributed microservice architecture with kubernetes and deploy it",
      );
      assert.equal(result.passthrough, false);
    });

    it("long simple prompt blocked by length guard", () => {
      const long = "what is " + "the meaning of life ".repeat(15);
      assert.ok(long.length > 200);
      const result = classifyWithPassthrough(long);
      assert.equal(result.passthrough, false);
    });

    it("code prompt is not passthrough", () => {
      const result = classifyWithPassthrough("Write a function to sort an array");
      assert.equal(result.passthrough, false);
    });
  });

  describe("result shape", () => {
    it("always includes passthrough boolean", () => {
      const r1 = classifyWithPassthrough("hello");
      const r2 = classifyWithPassthrough("Explain quantum computing step by step");
      assert.equal(typeof r1.passthrough, "boolean");
      assert.equal(typeof r2.passthrough, "boolean");
    });

    it("preserves upstream classification fields", () => {
      const result = classifyWithPassthrough("hello");
      assert.ok("tier" in result);
      assert.ok("score" in result);
      assert.ok("confidence" in result);
      assert.ok("signals" in result);
      assert.ok("reasoningMatches" in result);
    });
  });
});
