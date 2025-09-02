/**
 * Cursor MCP System - Main Export
 *
 * Comprehensive MCP system for Cursor integration with the Form-Flow repository.
 * Provides intelligent assistance for development, debugging, and documentation.
 */

// Export all protocols
export * from './protocols/IFormFlowRepositoryProtocol'
export * from './protocols/IFormBuilderAssistantProtocol'
export * from './protocols/ICodeGenerationProtocol'
export * from './protocols/IDebuggingAssistantProtocol'
export * from './protocols/IDocumentationProtocol'

// Export all types
export * from './types/CursorTypes'
export * from './types/CodeAnalysisTypes'
export * from './types/GenerationTypes'

// Export implementations (to be created)
export * from './implementations/FormFlowRepositoryMCP'
export * from './implementations/FormBuilderAssistantMCP'
export * from './implementations/CodeGenerationMCP'
export * from './implementations/DebuggingAssistantMCP'
export * from './implementations/DocumentationMCP'

// Export utilities (to be created)
export * from './utils/CodeAnalyzer'
export * from './utils/ComponentMatcher'
export * from './utils/CodeGenerator'
export * from './utils/DocumentationGenerator'

/**
 * Cursor MCP System Overview
 *
 * This system provides five main MCPs for Cursor integration:
 *
 * 1. FormFlowRepositoryMCP - Repository intelligence and navigation
 * 2. FormBuilderAssistantMCP - Form building assistance and optimization
 * 3. CodeGenerationMCP - Automated code generation and scaffolding
 * 4. DebuggingAssistantMCP - Debugging, testing, and performance analysis
 * 5. DocumentationMCP - Documentation generation and maintenance
 *
 * Each MCP follows the established MCP pattern with:
 * - Static methods for stateless operations
 * - Comprehensive error handling with MCPResult
 * - Performance tracking and logging
 * - Type-safe interfaces and implementations
 *
 * Usage Example:
 * ```typescript
 * import { FormFlowRepositoryMCP } from './mcp-curcontext'
 *
 * const result = await FormFlowRepositoryMCP.getProjectStructure()
 * if (result.success) {
 *   console.log('Project structure:', result.data)
 * } else {
 *   console.error('Error:', result.errors)
 * }
 * ```
 */
