/**
 * Code Generation Types
 *
 * Types for automated code generation, scaffolding, and template creation
 */

export interface ComponentSpec {
	name: string
	type: 'input' | 'display' | 'container' | 'layout' | 'utility'
	category: ComponentCategory
	props: PropSpec[]
	events: EventSpec[]
	styling: StylingSpec
	validation: ValidationSpec
	accessibility: AccessibilitySpec
	examples: ExampleSpec[]
}

export interface PropSpec {
	name: string
	type: string
	required: boolean
	defaultValue?: any
	description: string
	validation?: ValidationRule[]
}

export interface EventSpec {
	name: string
	parameters: ParameterSpec[]
	description: string
	bubbles: boolean
}

export interface ParameterSpec {
	name: string
	type: string
	description: string
}

export interface StylingSpec {
	theme: string
	variants: StyleVariant[]
	responsive: ResponsiveSpec
	animations: AnimationSpec[]
}

export interface StyleVariant {
	name: string
	properties: Record<string, string>
	description: string
}

export interface ResponsiveSpec {
	breakpoints: ResponsiveBreakpoint[]
	mobile: Record<string, string>
	tablet: Record<string, string>
	desktop: Record<string, string>
}

export interface ResponsiveBreakpoint {
	name: string
	value: string
	properties: Record<string, string>
}

export interface AnimationSpec {
	name: string
	duration: string
	easing: string
	properties: string[]
}

export interface ValidationSpec {
	rules: ValidationRule[]
	messages: Record<string, string>
	async?: boolean
}

export interface AccessibilitySpec {
	ariaLabels: string[]
	keyboardNavigation: boolean
	screenReader: boolean
	colorContrast: boolean
	focusManagement: boolean
}

export interface ExampleSpec {
	title: string
	description: string
	code: string
	props: Record<string, any>
	expected: string
}

export interface MCPProtocol {
	name: string
	description: string
	methods: MCPMethodSpec[]
	dependencies: string[]
	version: string
	category: MCPCategory
}

export interface MCPMethodSpec {
	name: string
	description: string
	parameters: ParameterSpec[]
	returnType: string
	async: boolean
	validation: ValidationSpec
	examples: ExampleSpec[]
}

export interface MCPCategory {
	name: string
	description: string
	icon: string
	color: string
}

export interface MCPImplementation {
	protocol: MCPProtocol
	class: string
	methods: MCPMethodImplementation[]
	tests: MCPTestSpec[]
	documentation: MCPDocumentationSpec
}

export interface MCPMethodImplementation {
	method: MCPMethodSpec
	implementation: string
	errorHandling: ErrorHandlingSpec
	logging: LoggingSpec
	performance: PerformanceSpec
}

export interface ErrorHandlingSpec {
	types: string[]
	messages: Record<string, string>
	recovery: string[]
}

export interface LoggingSpec {
	level: 'debug' | 'info' | 'warn' | 'error'
	format: string
	context: string[]
}

export interface PerformanceSpec {
	timeout: number
	retries: number
	caching: boolean
	optimization: string[]
}

export interface MCPTestSpec {
	name: string
	type: 'unit' | 'integration' | 'performance'
	description: string
	setup: string
	test: string
	teardown: string
	expected: any
}

export interface MCPDocumentationSpec {
	overview: string
	methods: MethodDocumentation[]
	examples: ExampleSpec[]
	troubleshooting: TroubleshootingGuide[]
}

export interface MethodDocumentation {
	method: string
	description: string
	parameters: ParameterDocumentation[]
	returns: string
	examples: ExampleSpec[]
	notes: string[]
}

export interface ParameterDocumentation {
	name: string
	type: string
	description: string
	required: boolean
	example: any
}

export interface TroubleshootingGuide {
	problem: string
	symptoms: string[]
	causes: string[]
	solutions: string[]
	prevention: string[]
}

export interface IntegrationCode {
	source: string
	target: string
	type: 'data' | 'event' | 'api' | 'component'
	transformation: TransformationSpec
	errorHandling: ErrorHandlingSpec
	testing: IntegrationTestSpec[]
}

export interface TransformationSpec {
	input: DataTypeSpec
	output: DataTypeSpec
	mapping: FieldMapping[]
	validation: ValidationSpec
}

export interface DataTypeSpec {
	type: string
	fields: FieldSpec[]
	constraints: ConstraintSpec[]
}

export interface FieldSpec {
	name: string
	type: string
	required: boolean
	description: string
}

export interface ConstraintSpec {
	type: 'min' | 'max' | 'pattern' | 'enum'
	value: any
	message: string
}

export interface FieldMapping {
	source: string
	target: string
	transformation?: string
	validation?: ValidationRule[]
}

export interface IntegrationTestSpec {
	name: string
	description: string
	input: any
	expected: any
	setup: string
	teardown: string
}

export interface MigrationScript {
	fromVersion: string
	toVersion: string
	changes: MigrationChange[]
	rollback: RollbackSpec
	testing: MigrationTestSpec[]
}

export interface MigrationChange {
	type: 'add' | 'remove' | 'modify' | 'rename' | 'move'
	file: string
	description: string
	code: string
	validation: ValidationSpec
}

export interface RollbackSpec {
	changes: MigrationChange[]
	validation: ValidationSpec
	testing: MigrationTestSpec[]
}

export interface MigrationTestSpec {
	name: string
	description: string
	before: any
	after: any
	validation: ValidationSpec
}

export interface GeneratedCode {
	files: GeneratedFile[]
	dependencies: DependencySpec[]
	configuration: ConfigurationSpec[]
	testing: TestingSpec[]
	documentation: DocumentationSpec[]
}

export interface GeneratedFile {
	path: string
	content: string
	type: 'component' | 'mcp' | 'util' | 'type' | 'test' | 'config'
	description: string
	imports: string[]
	exports: string[]
}

export interface DependencySpec {
	name: string
	version: string
	type: 'dependency' | 'devDependency' | 'peerDependency'
	purpose: string
}

export interface ConfigurationSpec {
	file: string
	content: string
	type: 'tsconfig' | 'eslint' | 'prettier' | 'jest' | 'next'
	description: string
}

export interface TestingSpec {
	framework: string
	files: GeneratedFile[]
	configuration: ConfigurationSpec[]
	coverage: CoverageSpec
}

export interface CoverageSpec {
	threshold: number
	files: string[]
	exclude: string[]
	reports: string[]
}

export interface DocumentationSpec {
	type: 'readme' | 'api' | 'guide' | 'example'
	format: 'markdown' | 'html' | 'json'
	content: string
	path: string
}

export interface ComponentDocumentation {
	overview: string
	props: PropDocumentation[]
	events: EventDocumentation[]
	examples: ExampleSpec[]
	styling: StylingDocumentation
	accessibility: AccessibilityDocumentation
	troubleshooting: TroubleshootingGuide[]
}

export interface PropDocumentation {
	prop: string
	type: string
	required: boolean
	defaultValue: any
	description: string
	examples: ExampleSpec[]
}

export interface EventDocumentation {
	event: string
	parameters: ParameterDocumentation[]
	description: string
	examples: ExampleSpec[]
}

export interface StylingDocumentation {
	theme: string
	variants: StyleVariant[]
	customization: CustomizationGuide[]
	responsive: ResponsiveDocumentation
}

export interface CustomizationGuide {
	property: string
	description: string
	examples: ExampleSpec[]
	bestPractices: string[]
}

export interface ResponsiveDocumentation {
	breakpoints: ResponsiveBreakpoint[]
	guidelines: string[]
	examples: ExampleSpec[]
}

export interface AccessibilityDocumentation {
	ariaLabels: string[]
	keyboardNavigation: string[]
	screenReader: string[]
	colorContrast: string[]
	bestPractices: string[]
}

export interface APIDocumentation {
	endpoints: APIEndpoint[]
	authentication: AuthenticationSpec
	rateLimiting: RateLimitingSpec
	examples: ExampleSpec[]
}

export interface APIEndpoint {
	method: string
	path: string
	description: string
	parameters: ParameterDocumentation[]
	responses: ResponseSpec[]
	examples: ExampleSpec[]
}

export interface ResponseSpec {
	status: number
	description: string
	schema: DataTypeSpec
	examples: ExampleSpec[]
}

export interface AuthenticationSpec {
	type: 'bearer' | 'api-key' | 'oauth' | 'none'
	description: string
	examples: ExampleSpec[]
}

export interface RateLimitingSpec {
	requests: number
	window: string
	description: string
	headers: string[]
}

export interface ArchitectureDocumentation {
	overview: string
	layers: LayerDocumentation[]
	patterns: PatternDocumentation[]
	dataFlow: DataFlowDocumentation
	deployment: DeploymentDocumentation
}

export interface LayerDocumentation {
	name: string
	description: string
	components: string[]
	responsibilities: string[]
	interfaces: string[]
}

export interface PatternDocumentation {
	name: string
	description: string
	implementation: string
	benefits: string[]
	examples: ExampleSpec[]
}

export interface DataFlowDocumentation {
	overview: string
	sources: DataSource[]
	transformations: TransformationDocumentation[]
	destinations: DataDestination[]
}

export interface DataSource {
	name: string
	type: string
	description: string
	schema: DataTypeSpec
}

export interface TransformationDocumentation {
	name: string
	description: string
	input: DataTypeSpec
	output: DataTypeSpec
	logic: string
}

export interface DataDestination {
	name: string
	type: string
	description: string
	schema: DataTypeSpec
}

export interface DeploymentDocumentation {
	environments: EnvironmentSpec[]
	infrastructure: InfrastructureSpec
	monitoring: MonitoringSpec
	scaling: ScalingSpec
}

export interface EnvironmentSpec {
	name: string
	description: string
	configuration: ConfigurationSpec[]
	deployment: DeploymentStep[]
}

export interface InfrastructureSpec {
	type: string
	description: string
	components: string[]
	configuration: ConfigurationSpec[]
}

export interface MonitoringSpec {
	metrics: MetricSpec[]
	alerts: AlertSpec[]
	dashboards: DashboardSpec[]
}

export interface MetricSpec {
	name: string
	type: string
	description: string
	threshold: number
}

export interface AlertSpec {
	name: string
	condition: string
	severity: string
	action: string
}

export interface DashboardSpec {
	name: string
	description: string
	widgets: WidgetSpec[]
}

export interface WidgetSpec {
	type: string
	title: string
	metrics: string[]
	visualization: string
}

export interface ScalingSpec {
	horizontal: ScalingConfig
	vertical: ScalingConfig
	auto: AutoScalingConfig
}

export interface ScalingConfig {
	enabled: boolean
	min: number
	max: number
	triggers: ScalingTrigger[]
}

export interface AutoScalingConfig {
	enabled: boolean
	metrics: string[]
	policies: ScalingPolicy[]
}

export interface ScalingTrigger {
	metric: string
	threshold: number
	action: string
}

export interface ScalingPolicy {
	name: string
	type: string
	configuration: Record<string, any>
}

export interface DeploymentStep {
	order: number
	name: string
	description: string
	commands: string[]
	validation: ValidationSpec
}

// Re-export types from main project
export type { ComponentCategory, ValidationRule } from '../../src/types'
