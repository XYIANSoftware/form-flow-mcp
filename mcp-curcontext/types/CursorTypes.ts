/**
 * Cursor MCP Types
 *
 * Core types for Cursor integration with the Form-Flow repository
 */

export interface ProjectStructure {
	root: string
	directories: DirectoryInfo[]
	files: FileInfo[]
	dependencies: DependencyInfo[]
	architecture: ArchitectureInfo
}

export interface DirectoryInfo {
	name: string
	path: string
	type: 'src' | 'docs' | 'config' | 'public' | 'tests' | 'other'
	children: (DirectoryInfo | FileInfo)[]
	purpose?: string
}

export interface FileInfo {
	name: string
	path: string
	type: 'component' | 'mcp' | 'page' | 'util' | 'type' | 'config' | 'other'
	size: number
	lastModified: Date
	dependencies: string[]
	exports: string[]
	imports: string[]
	purpose?: string
}

export interface DependencyInfo {
	from: string
	to: string
	type: 'import' | 'export' | 'extends' | 'implements' | 'uses'
	strength: 'strong' | 'medium' | 'weak'
}

export interface ArchitectureInfo {
	layers: string[]
	patterns: string[]
	mcpCount: number
	componentCount: number
	complexity: 'low' | 'medium' | 'high'
}

export interface ComponentMatch {
	component: FormComponent
	similarity: number
	reasons: string[]
	usage: UsageInfo[]
}

export interface UsageInfo {
	file: string
	line: number
	context: string
	frequency: number
}

export interface CodebaseAnalysis {
	totalFiles: number
	totalLines: number
	complexity: number
	patterns: CodePattern[]
	issues: CodeIssue[]
	recommendations: Recommendation[]
}

export interface CodePattern {
	name: string
	frequency: number
	files: string[]
	description: string
	quality: 'good' | 'neutral' | 'bad'
}

export interface CodeIssue {
	type: 'error' | 'warning' | 'suggestion'
	severity: 'low' | 'medium' | 'high' | 'critical'
	file: string
	line?: number
	message: string
	suggestion?: string
}

export interface Recommendation {
	type: 'performance' | 'maintainability' | 'security' | 'best-practice'
	priority: 'low' | 'medium' | 'high'
	description: string
	impact: string
	effort: 'low' | 'medium' | 'high'
}

export interface MCPArchitecture {
	protocols: MCPProtocol[]
	implementations: MCPImplementation[]
	relationships: MCPRelationship[]
	health: MCPHealth
}

export interface MCPProtocol {
	name: string
	file: string
	methods: MCPMethod[]
	dependencies: string[]
	complexity: number
}

export interface MCPImplementation {
	name: string
	file: string
	protocol: string
	methods: MCPMethod[]
	testCoverage: number
	performance: number
}

export interface MCPMethod {
	name: string
	parameters: Parameter[]
	returnType: string
	complexity: number
	usage: number
}

export interface Parameter {
	name: string
	type: string
	required: boolean
	description?: string
}

export interface MCPRelationship {
	from: string
	to: string
	type: 'uses' | 'extends' | 'implements' | 'depends'
	strength: number
}

export interface MCPHealth {
	overall: number
	protocols: number
	implementations: number
	tests: number
	documentation: number
	issues: CodeIssue[]
}

export interface ComponentTree {
	root: ComponentNode
	totalComponents: number
	maxDepth: number
	relationships: ComponentRelationship[]
}

export interface ComponentNode {
	name: string
	type: 'component' | 'page' | 'layout' | 'mcp'
	children: ComponentNode[]
	props: string[]
	dependencies: string[]
	usage: number
}

export interface ComponentRelationship {
	from: string
	to: string
	type: 'uses' | 'extends' | 'composes' | 'renders'
	strength: number
}

export interface DataFlowGraph {
	nodes: DataNode[]
	edges: DataEdge[]
	entryPoints: string[]
	exitPoints: string[]
	cycles: string[][]
}

export interface DataNode {
	id: string
	type: 'input' | 'output' | 'transform' | 'store' | 'component'
	name: string
	dataType: string
	location: string
}

export interface DataEdge {
	from: string
	to: string
	dataType: string
	transformation?: string
	frequency: number
}

// Re-export existing types from the main project
export type {
	FormComponent,
	FormLayout,
	FormTemplate,
	ComponentCategory,
	LayoutType,
	TemplateCategory,
	FormField,
	FieldType,
	ValidationRule,
	MCPResult,
	MCPError,
} from '../../src/types'
