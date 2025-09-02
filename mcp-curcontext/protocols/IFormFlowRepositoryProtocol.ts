/**
 * IFormFlowRepositoryProtocol - Interface for Form-Flow Repository Intelligence
 *
 * Provides comprehensive repository analysis, navigation, and understanding
 * capabilities for Cursor integration with the Form-Flow project.
 */

import { MCPResult } from '../../src/lib/mcp/protocols/types'
import {
	ProjectStructure,
	FileInfo,
	DependencyInfo,
	CodebaseAnalysis,
	ComponentMatch,
	UsageInfo,
	MCPArchitecture,
	ComponentTree,
	DataFlowGraph,
} from '../types/CursorTypes'

export interface IFormFlowRepositoryProtocol {
	/**
	 * Get complete project structure with file relationships
	 */
	getProjectStructure(): MCPResult<ProjectStructure>

	/**
	 * Find files matching a specific pattern
	 */
	findFilesByPattern(pattern: string): MCPResult<FileInfo[]>

	/**
	 * Get file dependencies and relationships
	 */
	getFileDependencies(filePath: string): MCPResult<DependencyInfo[]>

	/**
	 * Analyze the entire codebase for patterns, issues, and recommendations
	 */
	analyzeCodebase(): MCPResult<CodebaseAnalysis>

	/**
	 * Find components similar to the given component
	 */
	findSimilarComponents(componentName: string): MCPResult<ComponentMatch[]>

	/**
	 * Get usage information for a specific component
	 */
	getComponentUsage(componentId: string): MCPResult<UsageInfo[]>

	/**
	 * Get complete MCP architecture overview
	 */
	getMCPArchitecture(): MCPResult<MCPArchitecture>

	/**
	 * Get component hierarchy and relationships
	 */
	getComponentHierarchy(): MCPResult<ComponentTree>

	/**
	 * Get data flow graph for the application
	 */
	getDataFlow(): MCPResult<DataFlowGraph>

	/**
	 * Search for specific code patterns
	 */
	searchCodePatterns(pattern: string): MCPResult<CodePattern[]>

	/**
	 * Get repository health metrics
	 */
	getRepositoryHealth(): MCPResult<RepositoryHealth>

	/**
	 * Find potential code issues
	 */
	findCodeIssues(): MCPResult<CodeIssue[]>

	/**
	 * Get development recommendations
	 */
	getDevelopmentRecommendations(): MCPResult<DevelopmentRecommendation[]>
}

export interface CodePattern {
	name: string
	type: 'component' | 'hook' | 'util' | 'mcp' | 'pattern'
	frequency: number
	files: string[]
	description: string
	quality: 'good' | 'neutral' | 'bad'
	examples: string[]
}

export interface CodeIssue {
	type: 'error' | 'warning' | 'suggestion' | 'performance' | 'security'
	severity: 'low' | 'medium' | 'high' | 'critical'
	file: string
	line?: number
	column?: number
	message: string
	suggestion?: string
	fix?: string
	context: string
}

export interface RepositoryHealth {
	overall: number
	metrics: HealthMetric[]
	trends: HealthTrend[]
	alerts: HealthAlert[]
}

export interface HealthMetric {
	name: string
	value: number
	target: number
	status: 'good' | 'warning' | 'critical'
	description: string
}

export interface HealthTrend {
	metric: string
	direction: 'up' | 'down' | 'stable'
	change: number
	period: string
}

export interface HealthAlert {
	type: 'performance' | 'security' | 'maintainability' | 'quality'
	severity: 'low' | 'medium' | 'high'
	message: string
	action: string
}

export interface DevelopmentRecommendation {
	type:
		| 'refactoring'
		| 'optimization'
		| 'security'
		| 'testing'
		| 'documentation'
	priority: 'low' | 'medium' | 'high'
	title: string
	description: string
	impact: string
	effort: 'low' | 'medium' | 'high'
	files: string[]
	examples: string[]
}
