/**
 * ICodeGenerationProtocol - Interface for Automated Code Generation
 *
 * Provides comprehensive code generation capabilities for components,
 * MCPs, tests, documentation, and integration code.
 */

import { MCPResult } from '../../src/lib/mcp/protocols/types'
import {
	ComponentSpec,
	MCPProtocol,
	MCPImplementation,
	IntegrationCode,
	MigrationScript,
	GeneratedCode,
	ComponentDocumentation,
	APIDocumentation,
	ArchitectureDocumentation,
} from '../types/GenerationTypes'

export interface ICodeGenerationProtocol {
	/**
	 * Generate new component from specification
	 */
	generateNewComponent(spec: ComponentSpec): MCPResult<GeneratedCode>

	/**
	 * Generate component tests
	 */
	generateComponentTests(
		component: FormComponent
	): MCPResult<GeneratedTestSuite>

	/**
	 * Generate component documentation
	 */
	generateComponentDocumentation(
		component: FormComponent
	): MCPResult<ComponentDocumentation>

	/**
	 * Generate new MCP from protocol specification
	 */
	generateNewMCP(protocol: MCPProtocol): MCPResult<MCPImplementation>

	/**
	 * Generate MCP tests
	 */
	generateMCPTests(mcp: MCPClass): MCPResult<MCPTestSuite>

	/**
	 * Generate MCP documentation
	 */
	generateMCPDocumentation(mcp: MCPClass): MCPResult<MCPDocumentation>

	/**
	 * Generate integration code between systems
	 */
	generateIntegrationCode(
		source: string,
		target: string
	): MCPResult<IntegrationCode>

	/**
	 * Generate migration script between versions
	 */
	generateMigrationScript(
		fromVersion: string,
		toVersion: string
	): MCPResult<MigrationScript>

	/**
	 * Generate API documentation
	 */
	generateAPIDocumentation(
		endpoints: APIEndpoint[]
	): MCPResult<APIDocumentation>

	/**
	 * Generate architecture documentation
	 */
	generateArchitectureDocumentation(): MCPResult<ArchitectureDocumentation>

	/**
	 * Generate project scaffolding
	 */
	generateProjectScaffolding(
		template: ProjectTemplate
	): MCPResult<GeneratedCode>

	/**
	 * Generate configuration files
	 */
	generateConfigurationFiles(projectType: string): MCPResult<ConfigurationFiles>

	/**
	 * Generate deployment scripts
	 */
	generateDeploymentScripts(environment: string): MCPResult<DeploymentScripts>

	/**
	 * Generate monitoring setup
	 */
	generateMonitoringSetup(metrics: MetricSpec[]): MCPResult<MonitoringSetup>
}

export interface FormComponent {
	id: string
	name: string
	type: string
	props: any
	validation: any
	metadata: any
}

export interface MCPClass {
	name: string
	protocol: string
	methods: MCPMethod[]
	implementation: string
}

export interface MCPMethod {
	name: string
	parameters: Parameter[]
	returnType: string
	implementation: string
}

export interface Parameter {
	name: string
	type: string
	required: boolean
	description?: string
}

export interface GeneratedTestSuite {
	unit: GeneratedTest[]
	integration: GeneratedTest[]
	e2e: GeneratedTest[]
	coverage: CoverageReport
}

export interface GeneratedTest {
	name: string
	description: string
	type: 'unit' | 'integration' | 'e2e'
	code: string
	setup: string
	teardown: string
	expected: any
}

export interface CoverageReport {
	overall: number
	files: FileCoverage[]
	functions: FunctionCoverage[]
	lines: LineCoverage[]
}

export interface FileCoverage {
	file: string
	coverage: number
	lines: number
	covered: number
}

export interface FunctionCoverage {
	function: string
	coverage: number
	calls: number
	covered: number
}

export interface LineCoverage {
	line: number
	covered: boolean
	hits: number
}

export interface MCPTestSuite {
	protocol: string
	implementation: string
	tests: MCPTest[]
	coverage: CoverageReport
}

export interface MCPTest {
	method: string
	description: string
	input: any
	expected: any
	code: string
	type: 'success' | 'error' | 'edge-case'
}

export interface MCPDocumentation {
	overview: string
	protocol: string
	implementation: string
	methods: MethodDocumentation[]
	examples: CodeExample[]
	troubleshooting: TroubleshootingGuide[]
}

export interface MethodDocumentation {
	name: string
	description: string
	parameters: ParameterDocumentation[]
	returns: string
	examples: CodeExample[]
	notes: string[]
}

export interface ParameterDocumentation {
	name: string
	type: string
	description: string
	required: boolean
	example: any
}

export interface CodeExample {
	title: string
	description: string
	code: string
	language: string
	context: string
}

export interface TroubleshootingGuide {
	problem: string
	symptoms: string[]
	causes: string[]
	solutions: string[]
	prevention: string[]
}

export interface APIEndpoint {
	method: string
	path: string
	description: string
	parameters: ParameterDocumentation[]
	responses: ResponseDocumentation[]
	examples: CodeExample[]
}

export interface ResponseDocumentation {
	status: number
	description: string
	schema: any
	examples: CodeExample[]
}

export interface ProjectTemplate {
	name: string
	type: 'react' | 'next' | 'node' | 'fullstack'
	features: string[]
	dependencies: string[]
	structure: ProjectStructure
}

export interface ProjectStructure {
	directories: DirectoryStructure[]
	files: FileStructure[]
	configuration: ConfigurationStructure[]
}

export interface DirectoryStructure {
	name: string
	path: string
	purpose: string
	children: (DirectoryStructure | FileStructure)[]
}

export interface FileStructure {
	name: string
	path: string
	type: string
	template: string
	purpose: string
}

export interface ConfigurationStructure {
	file: string
	type: string
	content: string
	description: string
}

export interface ConfigurationFiles {
	typescript: ConfigurationFile
	eslint: ConfigurationFile
	prettier: ConfigurationFile
	jest: ConfigurationFile
	next: ConfigurationFile
	package: ConfigurationFile
}

export interface ConfigurationFile {
	path: string
	content: string
	description: string
	dependencies: string[]
}

export interface DeploymentScripts {
	docker: DeploymentScript
	kubernetes: DeploymentScript
	ci: DeploymentScript
	cd: DeploymentScript
}

export interface DeploymentScript {
	name: string
	content: string
	description: string
	environment: string
	dependencies: string[]
}

export interface MetricSpec {
	name: string
	type: string
	description: string
	threshold: number
	alert: boolean
}

export interface MonitoringSetup {
	metrics: MetricConfiguration[]
	alerts: AlertConfiguration[]
	dashboards: DashboardConfiguration[]
	logging: LoggingConfiguration[]
}

export interface MetricConfiguration {
	name: string
	type: string
	collection: string
	aggregation: string
	retention: string
}

export interface AlertConfiguration {
	name: string
	condition: string
	severity: string
	action: string
	notification: string
}

export interface DashboardConfiguration {
	name: string
	widgets: WidgetConfiguration[]
	refresh: string
	layout: string
}

export interface WidgetConfiguration {
	type: string
	title: string
	metrics: string[]
	visualization: string
	size: string
}

export interface LoggingConfiguration {
	level: string
	format: string
	destination: string
	retention: string
	filters: string[]
}
