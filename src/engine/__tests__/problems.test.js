/**
 * Unit tests for Problem data definitions.
 * Validates problem structure, data integrity, and helper functions.
 */

import { describe, it, expect } from 'vitest';
import {
  problems,
  getProblemById,
  getAllProblems,
  validateProblem,
} from '../problems.js';

describe('Problem Data', () => {
  describe('problems array', () => {
    it('should contain at least one problem', () => {
      expect(problems.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
      const ids = problems.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('binary-search-1 problem', () => {
    const problem = getProblemById('binary-search-1');

    it('should exist', () => {
      expect(problem).toBeDefined();
    });

    it('should have correct metadata', () => {
      expect(problem.title).toBe('Find the Hidden Number');
      expect(problem.difficulty).toBe('easy');
      expect(problem.maxQueries).toBe(7);
      expect(problem.maxAttempts).toBe(2);
    });

    it('should have required tags', () => {
      expect(problem.tags).toContain('binary-search');
      expect(problem.tags).toContain('interactive');
    });

    it('should have a complete statement', () => {
      expect(problem.statement.description).toBeDefined();
      expect(problem.statement.interaction.length).toBeGreaterThan(0);
      expect(problem.statement.rules.length).toBeGreaterThan(0);
      expect(problem.statement.hint).toBeDefined();
    });

    it('should have example interactions', () => {
      expect(problem.example.length).toBeGreaterThan(0);
      const types = problem.example.map((e) => e.type);
      expect(types).toContain('query');
      expect(types).toContain('response');
    });
  });

  describe('getProblemById', () => {
    it('should return problem for valid ID', () => {
      const p = getProblemById('binary-search-1');
      expect(p).toBeDefined();
      expect(p.id).toBe('binary-search-1');
    });

    it('should return undefined for invalid ID', () => {
      const p = getProblemById('nonexistent');
      expect(p).toBeUndefined();
    });
  });

  describe('getAllProblems', () => {
    it('should return all problems', () => {
      const all = getAllProblems();
      expect(all).toEqual(problems);
    });
  });

  describe('validateProblem', () => {
    it('should validate a correct problem', () => {
      const p = getProblemById('binary-search-1');
      expect(validateProblem(p)).toBe(true);
    });

    it('should reject null', () => {
      expect(validateProblem(null)).toBe(false);
    });

    it('should reject incomplete problem', () => {
      expect(validateProblem({ id: 'test' })).toBe(false);
    });
  });
});
