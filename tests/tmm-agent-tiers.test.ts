import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAgentMinTier } from "../tmm-agent-tiers.js";

describe("applyAgentMinTier", () => {
  const config = {
    "project-manager-lead": "COMPLEX",
    "engineering": "MEDIUM",
  };

  describe("overrides when classified below minimum", () => {
    it("bumps SIMPLE to COMPLEX for project-manager-lead", () => {
      const r = applyAgentMinTier("SIMPLE", "project-manager-lead", config);
      assert.equal(r.tier, "COMPLEX");
      assert.equal(r.wasOverridden, true);
    });

    it("bumps MEDIUM to COMPLEX for project-manager-lead", () => {
      const r = applyAgentMinTier("MEDIUM", "project-manager-lead", config);
      assert.equal(r.tier, "COMPLEX");
      assert.equal(r.wasOverridden, true);
    });

    it("bumps SIMPLE to MEDIUM for engineering", () => {
      const r = applyAgentMinTier("SIMPLE", "engineering", config);
      assert.equal(r.tier, "MEDIUM");
      assert.equal(r.wasOverridden, true);
    });
  });

  describe("does not override when at or above minimum", () => {
    it("keeps COMPLEX for project-manager-lead", () => {
      const r = applyAgentMinTier("COMPLEX", "project-manager-lead", config);
      assert.equal(r.tier, "COMPLEX");
      assert.equal(r.wasOverridden, false);
    });

    it("keeps REASONING above COMPLEX minimum", () => {
      const r = applyAgentMinTier("REASONING", "project-manager-lead", config);
      assert.equal(r.tier, "REASONING");
      assert.equal(r.wasOverridden, false);
    });

    it("keeps MEDIUM for engineering at minimum", () => {
      const r = applyAgentMinTier("MEDIUM", "engineering", config);
      assert.equal(r.tier, "MEDIUM");
      assert.equal(r.wasOverridden, false);
    });
  });

  describe("no override for unconfigured agents", () => {
    it("returns classified tier for unknown agent", () => {
      const r = applyAgentMinTier("SIMPLE", "design", config);
      assert.equal(r.tier, "SIMPLE");
      assert.equal(r.wasOverridden, false);
    });

    it("returns classified tier when agentId is null", () => {
      const r = applyAgentMinTier("SIMPLE", null, config);
      assert.equal(r.tier, "SIMPLE");
      assert.equal(r.wasOverridden, false);
    });

    it("returns classified tier when config is undefined", () => {
      const r = applyAgentMinTier("SIMPLE", "project-manager-lead", undefined);
      assert.equal(r.tier, "SIMPLE");
      assert.equal(r.wasOverridden, false);
    });
  });
});
