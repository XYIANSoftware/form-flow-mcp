/**
 * IFormBuilderAssistantProtocol - Interface for Form Builder Intelligence
 *
 * Provides intelligent assistance for form building, component selection,
 * layout optimization, and template generation.
 */

import { MCPResult } from '../../src/lib/mcp/protocols/types'
import {
	FormComponent,
	FormLayout,
	FormTemplate,
	FormField,
	ComponentCategory,
	LayoutType,
	TemplateCategory,
} from '../../src/types'
import {
	ComponentSuggestion,
	LayoutSuggestion,
	OptimizationResult,
	ImprovementSuggestion,
	ImplementationGuide,
} from '../types/CodeAnalysisTypes'

export interface IFormBuilderAssistantProtocol {
	/**
	 * Suggest components based on use case description
	 */
	suggestComponentsForUseCase(useCase: string): MCPResult<ComponentSuggestion[]>

	/**
	 * Generate component code from specification
	 */
	generateComponentCode(
		componentType: string,
		props: ComponentProps
	): MCPResult<string>

	/**
	 * Validate component integration and usage
	 */
	validateComponentIntegration(
		component: FormComponent
	): MCPResult<ValidationResult>

	/**
	 * Suggest optimal layouts for given fields
	 */
	suggestLayoutForFields(fields: FormField[]): MCPResult<LayoutSuggestion[]>

	/**
	 * Generate layout code from specification
	 */
	generateLayoutCode(
		layoutType: string,
		sections: FormSection[]
	): MCPResult<string>

	/**
	 * Optimize layout for performance and usability
	 */
	optimizeLayoutPerformance(layout: FormLayout): MCPResult<OptimizationResult>

	/**
	 * Create template from natural language description
	 */
	createTemplateFromDescription(description: string): MCPResult<FormTemplate>

	/**
	 * Generate template variations and alternatives
	 */
	generateTemplateVariations(template: FormTemplate): MCPResult<FormTemplate[]>

	/**
	 * Suggest improvements for existing templates
	 */
	suggestTemplateImprovements(
		template: FormTemplate
	): MCPResult<ImprovementSuggestion[]>

	/**
	 * Analyze form complexity and suggest simplifications
	 */
	analyzeFormComplexity(fields: FormField[]): MCPResult<ComplexityAnalysis>

	/**
	 * Suggest field validation rules
	 */
	suggestFieldValidation(field: FormField): MCPResult<ValidationSuggestion[]>

	/**
	 * Optimize form for accessibility
	 */
	optimizeFormAccessibility(
		form: FormTemplate
	): MCPResult<AccessibilityOptimization>

	/**
	 * Generate form testing scenarios
	 */
	generateFormTestScenarios(form: FormTemplate): MCPResult<TestScenario[]>

	/**
	 * Suggest form performance optimizations
	 */
	suggestFormOptimizations(
		form: FormTemplate
	): MCPResult<OptimizationSuggestion[]>
}

export interface ComponentProps {
	[key: string]: any
}

export interface FormSection {
	id: string
	title: string
	fields: FormField[]
	layout: string
	collapsible: boolean
}

export interface ValidationResult {
	valid: boolean
	errors: ValidationError[]
	warnings: ValidationWarning[]
	suggestions: ValidationSuggestion[]
}

export interface ValidationError {
	field: string
	message: string
	code: string
	severity: 'error' | 'warning'
}

export interface ValidationWarning {
	field: string
	message: string
	suggestion: string
}

export interface ValidationSuggestion {
	field: string
	type: 'validation' | 'format' | 'required' | 'custom'
	rule: string
	message: string
	example: string
}

export interface ComplexityAnalysis {
	score: number
	level: 'simple' | 'moderate' | 'complex' | 'very-complex'
	factors: ComplexityFactor[]
	recommendations: ComplexityRecommendation[]
}

export interface ComplexityFactor {
	name: string
	weight: number
	score: number
	description: string
	impact: string
}

export interface ComplexityRecommendation {
	type: 'simplify' | 'split' | 'optimize' | 'restructure'
	priority: 'low' | 'medium' | 'high'
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
	examples: string[]
}

export interface AccessibilityOptimization {
	score: number
	improvements: AccessibilityImprovement[]
	compliance: ComplianceLevel
	testing: AccessibilityTest[]
}

export interface AccessibilityImprovement {
	type: 'aria' | 'keyboard' | 'color' | 'contrast' | 'screen-reader'
	priority: 'low' | 'medium' | 'high'
	description: string
	implementation: string
	impact: string
}

export interface ComplianceLevel {
	wcag: 'A' | 'AA' | 'AAA'
	score: number
	issues: ComplianceIssue[]
}

export interface ComplianceIssue {
	level: 'A' | 'AA' | 'AAA'
	criteria: string
	description: string
	fix: string
}

export interface AccessibilityTest {
	type: 'automated' | 'manual' | 'assistive-technology'
	description: string
	steps: string[]
	expected: string
}

export interface TestScenario {
	name: string
	description: string
	type: 'happy-path' | 'edge-case' | 'error-case' | 'accessibility'
	steps: TestStep[]
	expected: string
	data: TestData
}

export interface TestStep {
	action: string
	input?: any
	description: string
	validation: string
}

export interface TestData {
	valid: any
	invalid: any
	edgeCases: any[]
}

export interface OptimizationSuggestion {
	type: 'performance' | 'usability' | 'accessibility' | 'maintainability'
	priority: 'low' | 'medium' | 'high'
	title: string
	description: string
	impact: string
	effort: 'low' | 'medium' | 'high'
	implementation: ImplementationGuide
	examples: string[]
}
