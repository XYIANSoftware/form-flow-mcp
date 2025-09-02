/**
 * Tests for FormFlowRepositoryMCP
 *
 * Basic tests to ensure the MCP system works correctly.
 */

import { FormFlowRepositoryMCP } from '../implementations/FormFlowRepositoryMCP'
import { CodeAnalyzer } from '../utils/CodeAnalyzer'

describe('FormFlowRepositoryMCP', () => {
	describe('getProjectStructure', () => {
		it('should return project structure', async () => {
			const result = await FormFlowRepositoryMCP.getProjectStructure()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.root).toBeDefined()
			expect(result.data.directories).toBeInstanceOf(Array)
			expect(result.data.files).toBeInstanceOf(Array)
			expect(result.data.dependencies).toBeInstanceOf(Array)
			expect(result.data.architecture).toBeDefined()
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('findFilesByPattern', () => {
		it('should find files matching pattern', async () => {
			const result = await FormFlowRepositoryMCP.findFilesByPattern('*.ts')

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})

		it('should handle invalid patterns gracefully', async () => {
			const result = await FormFlowRepositoryMCP.findFilesByPattern(
				'invalid[pattern'
			)

			expect(result).toBeDefined()
			expect(result.success).toBe(false)
			expect(result.errors).toBeInstanceOf(Array)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('analyzeCodebase', () => {
		it('should analyze codebase', async () => {
			const result = await FormFlowRepositoryMCP.analyzeCodebase()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.totalFiles).toBeGreaterThanOrEqual(0)
			expect(result.data.totalLines).toBeGreaterThanOrEqual(0)
			expect(result.data.complexity).toBeGreaterThanOrEqual(0)
			expect(result.data.patterns).toBeInstanceOf(Array)
			expect(result.data.issues).toBeInstanceOf(Array)
			expect(result.data.recommendations).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('findSimilarComponents', () => {
		it('should find similar components', async () => {
			const result = await FormFlowRepositoryMCP.findSimilarComponents('Button')

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})

		it('should handle empty component name', async () => {
			const result = await FormFlowRepositoryMCP.findSimilarComponents('')

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('getMCPArchitecture', () => {
		it('should get MCP architecture', async () => {
			const result = await FormFlowRepositoryMCP.getMCPArchitecture()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.protocols).toBeInstanceOf(Array)
			expect(result.data.implementations).toBeInstanceOf(Array)
			expect(result.data.relationships).toBeInstanceOf(Array)
			expect(result.data.health).toBeDefined()
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('getComponentHierarchy', () => {
		it('should get component hierarchy', async () => {
			const result = await FormFlowRepositoryMCP.getComponentHierarchy()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.root).toBeDefined()
			expect(result.data.totalComponents).toBeGreaterThanOrEqual(0)
			expect(result.data.maxDepth).toBeGreaterThanOrEqual(0)
			expect(result.data.relationships).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('getDataFlow', () => {
		it('should get data flow', async () => {
			const result = await FormFlowRepositoryMCP.getDataFlow()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.nodes).toBeInstanceOf(Array)
			expect(result.data.edges).toBeInstanceOf(Array)
			expect(result.data.entryPoints).toBeInstanceOf(Array)
			expect(result.data.exitPoints).toBeInstanceOf(Array)
			expect(result.data.cycles).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('searchCodePatterns', () => {
		it('should search code patterns', async () => {
			const result = await FormFlowRepositoryMCP.searchCodePatterns('function')

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('getRepositoryHealth', () => {
		it('should get repository health', async () => {
			const result = await FormFlowRepositoryMCP.getRepositoryHealth()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeDefined()
			expect(result.data.overall).toBeGreaterThanOrEqual(0)
			expect(result.data.metrics).toBeInstanceOf(Array)
			expect(result.data.trends).toBeInstanceOf(Array)
			expect(result.data.alerts).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('findCodeIssues', () => {
		it('should find code issues', async () => {
			const result = await FormFlowRepositoryMCP.findCodeIssues()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})

	describe('getDevelopmentRecommendations', () => {
		it('should get development recommendations', async () => {
			const result = await FormFlowRepositoryMCP.getDevelopmentRecommendations()

			expect(result).toBeDefined()
			expect(result.success).toBe(true)
			expect(result.data).toBeInstanceOf(Array)
			expect(result.executionTime).toBeGreaterThan(0)
		})
	})
})

describe('CodeAnalyzer', () => {
	describe('analyzeTypeScriptFile', () => {
		it('should analyze TypeScript file', () => {
			const mockContent = `
        import React from 'react'
        import { Button } from './Button'
        
        export interface Props {
          title: string
        }
        
        export function Component({ title }: Props) {
          return <Button>{title}</Button>
        }
      `

			// Mock fs.readFileSync
			const originalReadFileSync = require('fs').readFileSync
			require('fs').readFileSync = jest.fn().mockReturnValue(mockContent)

			try {
				const analysis = CodeAnalyzer.analyzeTypeScriptFile('./test.tsx')

				expect(analysis).toBeDefined()
				expect(analysis.imports).toBeInstanceOf(Array)
				expect(analysis.exports).toBeInstanceOf(Array)
				expect(analysis.functions).toBeInstanceOf(Array)
				expect(analysis.classes).toBeInstanceOf(Array)
				expect(analysis.interfaces).toBeInstanceOf(Array)
				expect(analysis.types).toBeInstanceOf(Array)
				expect(analysis.complexity).toBeGreaterThan(0)
				expect(analysis.lines).toBeGreaterThan(0)

				expect(analysis.imports.length).toBe(2)
				expect(analysis.exports.length).toBe(2)
				expect(analysis.functions.length).toBe(1)
				expect(analysis.interfaces.length).toBe(1)
			} finally {
				// Restore original function
				require('fs').readFileSync = originalReadFileSync
			}
		})

		it('should handle file not found', () => {
			expect(() => {
				CodeAnalyzer.analyzeTypeScriptFile('./nonexistent.tsx')
			}).toThrow()
		})
	})

	describe('findSimilarComponents', () => {
		it('should find similar components', () => {
			const components = [
				{
					name: 'Button',
					type: 'button',
					props: ['label', 'onClick'],
					location: 'src/components/Button.tsx',
				},
				{
					name: 'SubmitButton',
					type: 'button',
					props: ['label', 'onClick', 'disabled'],
					location: 'src/components/SubmitButton.tsx',
				},
				{
					name: 'Input',
					type: 'input',
					props: ['value', 'onChange'],
					location: 'src/components/Input.tsx',
				},
			]

			const matches = CodeAnalyzer.findSimilarComponents('Button', components)

			expect(matches).toBeInstanceOf(Array)
			expect(matches.length).toBeGreaterThan(0)

			// Should find Button and SubmitButton as similar
			const buttonMatches = matches.filter(match =>
				match.component.name.includes('Button')
			)
			expect(buttonMatches.length).toBeGreaterThan(0)

			// Check similarity scores
			matches.forEach(match => {
				expect(match.similarity).toBeGreaterThan(0)
				expect(match.similarity).toBeLessThanOrEqual(1)
				expect(match.reasons).toBeInstanceOf(Array)
			})
		})

		it('should handle empty component list', () => {
			const matches = CodeAnalyzer.findSimilarComponents('Button', [])

			expect(matches).toBeInstanceOf(Array)
			expect(matches.length).toBe(0)
		})
	})

	describe('calculateSimilarity', () => {
		it('should calculate similarity correctly', () => {
			// Test exact match
			const exactMatch = CodeAnalyzer['calculateSimilarity']('Button', 'Button')
			expect(exactMatch).toBe(1)

			// Test similar strings
			const similarMatch = CodeAnalyzer['calculateSimilarity'](
				'Button',
				'SubmitButton'
			)
			expect(similarMatch).toBeGreaterThan(0.5)

			// Test different strings
			const differentMatch = CodeAnalyzer['calculateSimilarity'](
				'Button',
				'Input'
			)
			expect(differentMatch).toBeLessThan(0.5)

			// Test empty strings
			const emptyMatch = CodeAnalyzer['calculateSimilarity']('', '')
			expect(emptyMatch).toBe(1)
		})
	})
})
