/**
 * IDebuggingAssistantProtocol - Interface for Debugging and Troubleshooting
 *
 * Provides comprehensive debugging assistance, error analysis, performance
 * monitoring, and testing support for the Form-Flow repository.
 */

import { MCPResult } from '../../src/lib/mcp/protocols/types'
import {
	BuildErrorAnalysis,
	PerformanceReport,
	TestCase,
	TestImprovement,
	CoverageReport,
} from '../types/CodeAnalysisTypes'

export interface IDebuggingAssistantProtocol {
	/**
	 * Analyze build errors and provide solutions
	 */
	analyzeBuildErrors(): MCPResult<BuildErrorAnalysis>

	/**
	 * Suggest fixes for specific errors
	 */
	suggestErrorFixes(error: BuildError): MCPResult<FixSuggestion[]>

	/**
	 * Trace error source and dependencies
	 */
	traceErrorSource(error: RuntimeError): MCPResult<ErrorTrace>

	/**
	 * Analyze performance bottlenecks
	 */
	analyzePerformanceBottlenecks(): MCPResult<PerformanceReport>

	/**
	 * Suggest performance optimizations
	 */
	suggestPerformanceOptimizations(): MCPResult<OptimizationSuggestion[]>

	/**
	 * Profile component performance
	 */
	profileComponentPerformance(component: string): MCPResult<PerformanceProfile>

	/**
	 * Generate test cases for components
	 */
	generateTestCases(component: FormComponent): MCPResult<TestCase[]>

	/**
	 * Suggest test improvements
	 */
	suggestTestImprovements(testSuite: TestSuite): MCPResult<TestImprovement[]>

	/**
	 * Analyze test coverage
	 */
	analyzeTestCoverage(): MCPResult<CoverageReport>

	/**
	 * Detect memory leaks
	 */
	detectMemoryLeaks(): MCPResult<MemoryLeakReport>

	/**
	 * Analyze bundle size
	 */
	analyzeBundleSize(): MCPResult<BundleAnalysis>

	/**
	 * Check for security vulnerabilities
	 */
	checkSecurityVulnerabilities(): MCPResult<SecurityReport>

	/**
	 * Validate code quality
	 */
	validateCodeQuality(): MCPResult<QualityReport>

	/**
	 * Monitor runtime errors
	 */
	monitorRuntimeErrors(): MCPResult<RuntimeErrorReport>
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
	stack?: string
}

export interface FixSuggestion {
	type: 'import' | 'type' | 'syntax' | 'logic' | 'configuration'
	description: string
	code: string
	impact: 'low' | 'medium' | 'high'
	confidence: number
	alternatives: string[]
}

export interface RuntimeError {
	type: 'javascript' | 'react' | 'network' | 'validation' | 'business'
	severity: 'error' | 'warning'
	message: string
	stack: string
	context: ErrorContext
	timestamp: Date
	userAgent?: string
	url?: string
}

export interface ErrorContext {
	component?: string
	action?: string
	data?: any
	userId?: string
	sessionId?: string
}

export interface ErrorTrace {
	error: RuntimeError
	source: TraceNode[]
	dependencies: DependencyTrace[]
	suggestions: TraceSuggestion[]
}

export interface TraceNode {
	file: string
	line: number
	function: string
	type: 'source' | 'dependency' | 'related'
	relevance: number
}

export interface DependencyTrace {
	from: string
	to: string
	type: 'import' | 'call' | 'data' | 'event'
	strength: number
	path: string[]
}

export interface TraceSuggestion {
	type: 'fix' | 'prevention' | 'monitoring' | 'testing'
	description: string
	implementation: string
	priority: 'low' | 'medium' | 'high'
}

export interface OptimizationSuggestion {
	type: 'performance' | 'bundle-size' | 'memory' | 'rendering' | 'network'
	priority: 'low' | 'medium' | 'high'
	title: string
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
	implementation: string
	examples: string[]
}

export interface PerformanceProfile {
	component: string
	metrics: PerformanceMetrics
	bottlenecks: Bottleneck[]
	recommendations: PerformanceRecommendation[]
	timeline: PerformanceTimeline[]
}

export interface PerformanceMetrics {
	renderTime: number
	mountTime: number
	updateTime: number
	memoryUsage: number
	bundleSize: number
	complexity: number
}

export interface Bottleneck {
	location: string
	type: 'cpu' | 'memory' | 'network' | 'rendering' | 'dom'
	severity: 'low' | 'medium' | 'high'
	description: string
	solution: string
	impact: number
}

export interface PerformanceRecommendation {
	type:
		| 'optimization'
		| 'refactoring'
		| 'caching'
		| 'lazy-loading'
		| 'memoization'
	priority: 'low' | 'medium' | 'high'
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
	implementation: string
	examples: string[]
}

export interface PerformanceTimeline {
	timestamp: number
	event: string
	duration: number
	memory: number
	details: any
}

export interface FormComponent {
	id: string
	name: string
	type: string
	props: any
	validation: any
	metadata: any
}

export interface TestSuite {
	name: string
	type: 'unit' | 'integration' | 'e2e'
	tests: Test[]
	coverage: number
	performance: number
}

export interface Test {
	name: string
	description: string
	type: 'unit' | 'integration' | 'e2e'
	status: 'pass' | 'fail' | 'skip'
	duration: number
	coverage: number
}

export interface MemoryLeakReport {
	detected: boolean
	leaks: MemoryLeak[]
	recommendations: MemoryRecommendation[]
	monitoring: MemoryMonitoring[]
}

export interface MemoryLeak {
	type:
		| 'event-listener'
		| 'timer'
		| 'closure'
		| 'dom-reference'
		| 'subscription'
	location: string
	severity: 'low' | 'medium' | 'high'
	description: string
	solution: string
	impact: number
}

export interface MemoryRecommendation {
	type: 'cleanup' | 'optimization' | 'monitoring' | 'prevention'
	description: string
	implementation: string
	priority: 'low' | 'medium' | 'high'
}

export interface MemoryMonitoring {
	metric: string
	threshold: number
	current: number
	trend: 'increasing' | 'decreasing' | 'stable'
	alert: boolean
}

export interface BundleAnalysis {
	totalSize: number
	chunks: BundleChunk[]
	duplicates: DuplicateAnalysis[]
	recommendations: BundleRecommendation[]
	treeShaking: TreeShakingAnalysis
}

export interface BundleChunk {
	name: string
	size: number
	files: string[]
	dependencies: string[]
	optimization: string[]
}

export interface DuplicateAnalysis {
	module: string
	count: number
	locations: string[]
	size: number
	solution: string
}

export interface BundleRecommendation {
	type: 'splitting' | 'optimization' | 'removal' | 'compression'
	description: string
	impact: number
	effort: 'low' | 'medium' | 'high'
	implementation: string
}

export interface TreeShakingAnalysis {
	unused: string[]
	deadCode: string[]
	optimization: number
	recommendations: string[]
}

export interface SecurityReport {
	vulnerabilities: SecurityVulnerability[]
	recommendations: SecurityRecommendation[]
	compliance: ComplianceReport
	monitoring: SecurityMonitoring[]
}

export interface SecurityVulnerability {
	type: 'dependency' | 'code' | 'configuration' | 'runtime'
	severity: 'low' | 'medium' | 'high' | 'critical'
	description: string
	location: string
	solution: string
	cve?: string
}

export interface SecurityRecommendation {
	type: 'dependency' | 'code' | 'configuration' | 'monitoring'
	priority: 'low' | 'medium' | 'high'
	description: string
	implementation: string
	impact: string
}

export interface ComplianceReport {
	standard: string
	score: number
	issues: ComplianceIssue[]
	recommendations: string[]
}

export interface ComplianceIssue {
	rule: string
	severity: 'low' | 'medium' | 'high'
	description: string
	fix: string
}

export interface SecurityMonitoring {
	type: 'dependency' | 'runtime' | 'network' | 'access'
	enabled: boolean
	configuration: string
	alerts: string[]
}

export interface QualityReport {
	overall: number
	metrics: QualityMetric[]
	issues: QualityIssue[]
	recommendations: QualityRecommendation[]
	trends: QualityTrend[]
}

export interface QualityMetric {
	name: string
	value: number
	target: number
	status: 'good' | 'warning' | 'critical'
	description: string
}

export interface QualityIssue {
	type: 'complexity' | 'duplication' | 'maintainability' | 'reliability'
	severity: 'low' | 'medium' | 'high'
	location: string
	description: string
	solution: string
}

export interface QualityRecommendation {
	type: 'refactoring' | 'testing' | 'documentation' | 'optimization'
	priority: 'low' | 'medium' | 'high'
	description: string
	impact: string
	effort: 'low' | 'medium' | 'high'
}

export interface QualityTrend {
	metric: string
	direction: 'improving' | 'declining' | 'stable'
	change: number
	period: string
}

export interface RuntimeErrorReport {
	errors: RuntimeError[]
	patterns: ErrorPattern[]
	trends: ErrorTrend[]
	recommendations: ErrorRecommendation[]
}

export interface ErrorPattern {
	type: string
	frequency: number
	locations: string[]
	commonCauses: string[]
	solutions: string[]
}

export interface ErrorTrend {
	type: string
	direction: 'increasing' | 'decreasing' | 'stable'
	change: number
	period: string
}

export interface ErrorRecommendation {
	type: 'prevention' | 'monitoring' | 'handling' | 'recovery'
	priority: 'low' | 'medium' | 'high'
	description: string
	implementation: string
	impact: string
}
