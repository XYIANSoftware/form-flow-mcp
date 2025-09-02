/**
 * Code Analysis Types
 *
 * Types for analyzing and understanding code patterns, quality, and structure
 */

export interface ComponentSuggestion {
	component: FormComponent
	confidence: number
	reasons: string[]
	alternatives: FormComponent[]
	implementation: ImplementationGuide
}

export interface ImplementationGuide {
	steps: ImplementationStep[]
	estimatedTime: string
	complexity: 'low' | 'medium' | 'high'
	dependencies: string[]
	examples: CodeExample[]
}

export interface ImplementationStep {
	order: number
	title: string
	description: string
	code?: string
	files: string[]
	type: 'create' | 'modify' | 'test' | 'document'
}

export interface CodeExample {
	title: string
	description: string
	code: string
	language: 'typescript' | 'tsx' | 'css' | 'json'
	context: string
}

export interface LayoutSuggestion {
	layout: FormLayout
	confidence: number
	reasons: string[]
	alternatives: FormLayout[]
	customization: CustomizationOptions
}

export interface CustomizationOptions {
	sections: SectionCustomization[]
	responsive: ResponsiveOptions
	styling: StylingOptions
	accessibility: AccessibilityOptions
}

export interface SectionCustomization {
	sectionId: string
	suggestions: string[]
	modifications: string[]
}

export interface ResponsiveOptions {
	breakpoints: BreakpointConfig[]
	mobileOptimizations: string[]
	desktopEnhancements: string[]
}

export interface BreakpointConfig {
	name: string
	value: string
	behavior: string
}

export interface StylingOptions {
	themes: ThemeOption[]
	colors: ColorOption[]
	spacing: SpacingOption[]
}

export interface ThemeOption {
	name: string
	description: string
	variables: Record<string, string>
}

export interface ColorOption {
	name: string
	value: string
	usage: string[]
}

export interface SpacingOption {
	name: string
	value: string
	context: string
}

export interface AccessibilityOptions {
	ariaLabels: string[]
	keyboardNavigation: string[]
	screenReader: string[]
	colorContrast: string[]
}

export interface OptimizationResult {
	before: PerformanceMetrics
	after: PerformanceMetrics
	improvements: Improvement[]
	recommendations: string[]
}

export interface PerformanceMetrics {
	renderTime: number
	bundleSize: number
	memoryUsage: number
	complexity: number
}

export interface Improvement {
	type: 'performance' | 'bundle-size' | 'memory' | 'complexity'
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
}

export interface ImprovementSuggestion {
	type: 'performance' | 'usability' | 'maintainability' | 'accessibility'
	priority: 'low' | 'medium' | 'high' | 'critical'
	description: string
	impact: string
	effort: 'low' | 'medium' | 'high'
	examples: CodeExample[]
}

export interface GeneratedCode {
	files: GeneratedFile[]
	dependencies: string[]
	tests: GeneratedTest[]
	documentation: GeneratedDocumentation
	integration: IntegrationGuide
}

export interface GeneratedFile {
	path: string
	content: string
	type: 'component' | 'mcp' | 'util' | 'type' | 'test'
	description: string
}

export interface GeneratedTest {
	path: string
	content: string
	type: 'unit' | 'integration' | 'e2e'
	coverage: number
}

export interface GeneratedDocumentation {
	path: string
	content: string
	type: 'readme' | 'api' | 'guide' | 'example'
	format: 'markdown' | 'html' | 'json'
}

export interface IntegrationGuide {
	steps: IntegrationStep[]
	dependencies: string[]
	configuration: ConfigurationStep[]
	testing: TestingStep[]
}

export interface IntegrationStep {
	order: number
	title: string
	description: string
	code: string
	files: string[]
}

export interface ConfigurationStep {
	file: string
	changes: string[]
	description: string
}

export interface TestingStep {
	type: 'unit' | 'integration' | 'e2e'
	description: string
	commands: string[]
}

export interface BuildErrorAnalysis {
	errors: BuildError[]
	warnings: BuildWarning[]
	suggestions: ErrorSuggestion[]
	patterns: ErrorPattern[]
}

export interface BuildError {
	type: 'syntax' | 'type' | 'import' | 'runtime' | 'build'
	severity: 'error' | 'warning'
	file: string
	line: number
	column: number
	message: string
	code: string
	context: string
}

export interface BuildWarning {
	type: 'unused' | 'deprecated' | 'performance' | 'accessibility'
	file: string
	line: number
	message: string
	suggestion: string
}

export interface ErrorSuggestion {
	error: BuildError
	fixes: FixOption[]
	explanation: string
	confidence: number
}

export interface FixOption {
	type: 'import' | 'type' | 'syntax' | 'logic'
	description: string
	code: string
	impact: 'low' | 'medium' | 'high'
}

export interface ErrorPattern {
	pattern: string
	frequency: number
	files: string[]
	commonFixes: string[]
	prevention: string[]
}

export interface PerformanceReport {
	overall: PerformanceScore
	components: ComponentPerformance[]
	recommendations: PerformanceRecommendation[]
	bottlenecks: Bottleneck[]
}

export interface PerformanceScore {
	score: number
	grade: 'A' | 'B' | 'C' | 'D' | 'F'
	factors: PerformanceFactor[]
}

export interface PerformanceFactor {
	name: string
	score: number
	weight: number
	description: string
}

export interface ComponentPerformance {
	component: string
	renderTime: number
	bundleSize: number
	memoryUsage: number
	issues: PerformanceIssue[]
}

export interface PerformanceIssue {
	type: 'slow-render' | 'large-bundle' | 'memory-leak' | 'inefficient-re-render'
	severity: 'low' | 'medium' | 'high'
	description: string
	solution: string
}

export interface PerformanceRecommendation {
	type: 'optimization' | 'refactoring' | 'caching' | 'lazy-loading'
	priority: 'low' | 'medium' | 'high'
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
	examples: CodeExample[]
}

export interface Bottleneck {
	location: string
	type: 'cpu' | 'memory' | 'network' | 'rendering'
	severity: 'low' | 'medium' | 'high'
	description: string
	solution: string
}

export interface TestCase {
	name: string
	description: string
	type: 'unit' | 'integration' | 'e2e'
	code: string
	coverage: string[]
	dependencies: string[]
}

export interface TestImprovement {
	type: 'coverage' | 'quality' | 'performance' | 'maintainability'
	description: string
	current: number
	target: number
	suggestions: string[]
}

export interface CoverageReport {
	overall: number
	files: FileCoverage[]
	components: ComponentCoverage[]
	recommendations: CoverageRecommendation[]
}

export interface FileCoverage {
	file: string
	coverage: number
	lines: LineCoverage[]
	functions: FunctionCoverage[]
}

export interface LineCoverage {
	line: number
	covered: boolean
	hits: number
}

export interface FunctionCoverage {
	name: string
	covered: boolean
	hits: number
}

export interface ComponentCoverage {
	component: string
	coverage: number
	props: PropCoverage[]
	events: EventCoverage[]
}

export interface PropCoverage {
	prop: string
	tested: boolean
	testCases: number
}

export interface EventCoverage {
	event: string
	tested: boolean
	testCases: number
}

export interface CoverageRecommendation {
	type: 'missing-tests' | 'edge-cases' | 'error-handling' | 'integration'
	priority: 'low' | 'medium' | 'high'
	description: string
	files: string[]
	examples: CodeExample[]
}

// Re-export FormComponent and related types
export type { FormComponent, FormLayout, FormTemplate } from '../../src/types'
