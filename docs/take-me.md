# Take-Me: Universal Cursor MCP Integration Guide

This guide provides a complete process for integrating Model Context Protocol (MCP) systems with Cursor IDE in any codebase. Follow this step-by-step approach to give Cursor AI deep understanding of your project and enable intelligent development assistance.

## 🎯 Overview

This process will:

- Analyze your codebase to identify MCP opportunities
- Create intelligent MCP systems for Cursor integration
- Configure Cursor to automatically use the MCP system
- Provide comprehensive project intelligence to AI assistants

## 📋 Phase 1: Analysis & Planning

### Step 1: Codebase Analysis

Before starting, analyze your project to understand:

```bash
# Get project structure overview
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -20
find . -name "package.json" -exec cat {} \;
```

**Key Questions to Answer:**

- What is the main technology stack?
- What are the core business domains?
- What components/features could benefit from AI assistance?
- What patterns are used for data management, API calls, validation?
- What are the main pain points in development?

### Step 2: Create Game Plan

Based on analysis, create a structured plan:

```markdown
## MCP Integration Game Plan

### Phase 1: Core MCP Architecture

- [ ] Design MCP protocols for main business domains
- [ ] Create base MCP infrastructure
- [ ] Implement core MCPs (Repository, Analysis, Generation)

### Phase 2: Domain-Specific MCPs

- [ ] [Domain 1] MCP (e.g., User Management, Data Processing)
- [ ] [Domain 2] MCP (e.g., API Integration, Validation)
- [ ] [Domain 3] MCP (e.g., UI Components, Styling)

### Phase 3: Cursor Integration

- [ ] Create MCP server for Cursor
- [ ] Configure Cursor settings
- [ ] Test integration and create documentation

### Phase 4: Advanced Features

- [ ] Code generation capabilities
- [ ] Debugging assistance
- [ ] Performance analysis
- [ ] Documentation generation
```

## 🏗️ Phase 2: MCP Architecture Setup

### Step 3: Create MCP Directory Structure

```bash
mkdir -p mcp-curcontext/{protocols,implementations,types,utils,examples,tests}
```

### Step 4: Define Core Types

Create `mcp-curcontext/types/CursorTypes.ts`:

```typescript
/**
 * Core types for Cursor MCP integration
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
	type: 'component' | 'service' | 'page' | 'util' | 'type' | 'config' | 'other'
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
	serviceCount: number
	componentCount: number
	complexity: 'low' | 'medium' | 'high'
}

// Add domain-specific types based on your project
export interface MCPResult<T> {
	success: boolean
	data?: T
	errors?: MCPError[]
	executionTime: number
}

export interface MCPError {
	code: string
	message: string
	details?: any
}
```

### Step 5: Create Base MCP Protocol

Create `mcp-curcontext/protocols/IRepositoryProtocol.ts`:

```typescript
/**
 * Repository Intelligence Protocol
 * Provides deep understanding of the codebase structure and patterns
 */

import type { MCPResult } from '../types/CursorTypes'

export interface IRepositoryProtocol {
	// Project Analysis
	getProjectStructure(): Promise<MCPResult<ProjectStructure>>
	analyzeCodebase(): Promise<MCPResult<CodebaseAnalysis>>
	findFilesByPattern(pattern: string): Promise<MCPResult<FileInfo[]>>

	// Component Discovery
	findComponents(
		pattern?: string,
		type?: string
	): Promise<MCPResult<ComponentInfo[]>>
	getComponentInfo(
		name: string,
		includeCode?: boolean
	): Promise<MCPResult<ComponentInfo>>
	findSimilarComponents(name: string): Promise<MCPResult<ComponentMatch[]>>

	// Architecture Analysis
	getArchitecture(): Promise<MCPResult<ArchitectureInfo>>
	analyzeDependencies(): Promise<MCPResult<DependencyInfo[]>>
	getCodePatterns(): Promise<MCPResult<CodePattern[]>>

	// Health & Quality
	getRepositoryHealth(): Promise<MCPResult<RepositoryHealth>>
	findCodeIssues(): Promise<MCPResult<CodeIssue[]>>
	getDevelopmentRecommendations(): Promise<MCPResult<Recommendation[]>>
}
```

## 🔧 Phase 3: MCP Implementation

### Step 6: Implement Repository MCP

Create `mcp-curcontext/implementations/RepositoryMCP.ts`:

```typescript
/**
 * Repository MCP Implementation
 * Provides intelligent codebase analysis and navigation
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { IRepositoryProtocol } from '../protocols/IRepositoryProtocol'
import type { MCPResult, ProjectStructure } from '../types/CursorTypes'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class RepositoryMCP implements IRepositoryProtocol {
	private projectRoot: string

	constructor() {
		this.projectRoot = resolve(__dirname, '..', '..')
	}

	async getProjectStructure(): Promise<MCPResult<ProjectStructure>> {
		const startTime = performance.now()

		try {
			const structure: ProjectStructure = {
				root: this.projectRoot,
				directories: [],
				files: [],
				dependencies: [],
				architecture: {
					layers: [],
					patterns: [],
					serviceCount: 0,
					componentCount: 0,
					complexity: 'medium',
				},
			}

			this.scanDirectory(join(this.projectRoot, 'src'), structure, 0, 3)

			return {
				success: true,
				data: structure,
				executionTime: performance.now() - startTime,
			}
		} catch (error) {
			return {
				success: false,
				errors: [
					{
						code: 'ANALYSIS_ERROR',
						message: error instanceof Error ? error.message : 'Unknown error',
					},
				],
				executionTime: performance.now() - startTime,
			}
		}
	}

	async analyzeCodebase(): Promise<MCPResult<CodebaseAnalysis>> {
		// Implement comprehensive codebase analysis
		// - Count files, lines, complexity
		// - Identify patterns and anti-patterns
		// - Analyze dependencies and relationships
		// - Generate insights and recommendations
	}

	async findComponents(
		pattern = '*.tsx',
		type = 'all'
	): Promise<MCPResult<ComponentInfo[]>> {
		// Implement component discovery
		// - Search by file pattern
		// - Filter by component type
		// - Extract component metadata
		// - Return structured component information
	}

	// Add other required methods...

	private scanDirectory(
		dir: string,
		structure: ProjectStructure,
		depth: number,
		maxDepth: number
	) {
		if (depth >= maxDepth) return

		try {
			const items = readdirSync(dir)

			for (const item of items) {
				const fullPath = join(dir, item)
				const stat = statSync(fullPath)

				if (stat.isDirectory()) {
					structure.directories.push({
						name: item,
						path: fullPath,
						type: this.categorizeDirectory(item),
						children: [],
						purpose: this.inferPurpose(item, fullPath),
					})
					this.scanDirectory(fullPath, structure, depth + 1, maxDepth)
				} else if (stat.isFile()) {
					structure.files.push({
						name: item,
						path: fullPath,
						type: this.categorizeFile(item),
						size: stat.size,
						lastModified: stat.mtime,
						dependencies: [],
						exports: [],
						imports: [],
					})
				}
			}
		} catch (error) {
			// Skip directories we can't read
		}
	}

	private categorizeDirectory(name: string): DirectoryInfo['type'] {
		if (name.includes('component')) return 'src'
		if (name.includes('service')) return 'src'
		if (name.includes('test')) return 'tests'
		if (name.includes('doc')) return 'docs'
		return 'other'
	}

	private categorizeFile(name: string): FileInfo['type'] {
		if (name.endsWith('.tsx') || name.endsWith('.jsx')) return 'component'
		if (name.endsWith('.ts') || name.endsWith('.js')) return 'service'
		if (name.includes('page')) return 'page'
		if (name.includes('type')) return 'type'
		if (name.includes('config')) return 'config'
		return 'other'
	}

	private inferPurpose(name: string, path: string): string {
		// Implement logic to infer directory/file purpose
		// Based on naming conventions, imports, exports, etc.
		return 'General purpose'
	}
}
```

### Step 7: Create Domain-Specific MCPs

Based on your project analysis, create MCPs for your main domains:

```typescript
// Example: User Management MCP
export class UserManagementMCP {
	async createUser(userData: UserData): Promise<MCPResult<User>>
	async updateUser(
		id: string,
		updates: Partial<UserData>
	): Promise<MCPResult<User>>
	async deleteUser(id: string): Promise<MCPResult<boolean>>
	async validateUserData(data: UserData): Promise<MCPResult<ValidationResult>>
	async generateUserComponent(type: string): Promise<MCPResult<GeneratedCode>>
}

// Example: API Integration MCP
export class APIIntegrationMCP {
	async analyzeEndpoints(): Promise<MCPResult<EndpointInfo[]>>
	async generateAPIClient(): Promise<MCPResult<GeneratedCode>>
	async validateAPIContracts(): Promise<MCPResult<ValidationResult>>
	async suggestAPIImprovements(): Promise<MCPResult<Recommendation[]>>
}
```

## 🖥️ Phase 4: Cursor Server Implementation

### Step 8: Create MCP Server

Create `mcp-curcontext/server.ts`:

```typescript
#!/usr/bin/env node

/**
 * Universal Cursor MCP Server
 * Provides intelligent assistance for any codebase
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface MCPTool {
	name: string
	description: string
	inputSchema: any
}

interface MCPResponse {
	content: Array<{
		type: 'text'
		text: string
	}>
}

class UniversalCursorMCP {
	private projectRoot: string

	constructor() {
		this.projectRoot = resolve(__dirname, '..')
	}

	listTools(): MCPTool[] {
		return [
			{
				name: 'analyze_project',
				description:
					'Analyze the project structure and provide comprehensive insights',
				inputSchema: {
					type: 'object',
					properties: {
						includeDetails: {
							type: 'boolean',
							description: 'Include detailed file information',
							default: false,
						},
					},
				},
			},
			{
				name: 'find_components',
				description: 'Find and analyze components in the project',
				inputSchema: {
					type: 'object',
					properties: {
						pattern: {
							type: 'string',
							description: 'File pattern to search for',
							default: '*.tsx',
						},
						type: {
							type: 'string',
							description: 'Component type filter',
							enum: ['component', 'service', 'page', 'util', 'all'],
							default: 'all',
						},
					},
				},
			},
			{
				name: 'get_component_info',
				description: 'Get detailed information about a specific component',
				inputSchema: {
					type: 'object',
					properties: {
						componentName: {
							type: 'string',
							description: 'Name of the component to analyze',
						},
						includeCode: {
							type: 'boolean',
							description: 'Include component code',
							default: false,
						},
					},
					required: ['componentName'],
				},
			},
			{
				name: 'suggest_improvements',
				description: 'Analyze codebase and suggest improvements',
				inputSchema: {
					type: 'object',
					properties: {
						focus: {
							type: 'string',
							description: 'Focus area for suggestions',
							enum: [
								'performance',
								'maintainability',
								'security',
								'best-practices',
								'all',
							],
							default: 'all',
						},
					},
				},
			},
			{
				name: 'generate_code',
				description: 'Generate code following project patterns',
				inputSchema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							description: 'Type of code to generate',
							enum: ['component', 'service', 'hook', 'util', 'test'],
						},
						name: {
							type: 'string',
							description: 'Name of the generated item',
						},
						props: {
							type: 'array',
							description: 'Properties or parameters',
						},
					},
					required: ['type', 'name'],
				},
			},
		]
	}

	async executeTool(name: string, args: any = {}): Promise<MCPResponse> {
		try {
			switch (name) {
				case 'analyze_project':
					return await this.analyzeProject(args.includeDetails || false)
				case 'find_components':
					return await this.findComponents(
						args.pattern || '*.tsx',
						args.type || 'all'
					)
				case 'get_component_info':
					return await this.getComponentInfo(
						args.componentName,
						args.includeCode || false
					)
				case 'suggest_improvements':
					return await this.suggestImprovements(args.focus || 'all')
				case 'generate_code':
					return await this.generateCode(args.type, args.name, args.props || [])
				default:
					return {
						content: [
							{
								type: 'text',
								text: `Unknown tool: ${name}`,
							},
						],
					}
			}
		} catch (error) {
			return {
				content: [
					{
						type: 'text',
						text: `Error executing tool ${name}: ${
							error instanceof Error ? error.message : 'Unknown error'
						}`,
					},
				],
			}
		}
	}

	private async analyzeProject(includeDetails: boolean): Promise<MCPResponse> {
		const analysis = {
			projectRoot: this.projectRoot,
			components: [] as string[],
			services: [] as string[],
			pages: [] as string[],
			totalFiles: 0,
			totalDirectories: 0,
		}

		this.scanDirectory(join(this.projectRoot, 'src'), analysis, 0, 3)

		const summary = `# Project Analysis

## Overview
- **Project Root**: ${analysis.projectRoot}
- **Total Components**: ${analysis.components.length}
- **Total Services**: ${analysis.services.length}
- **Total Pages**: ${analysis.pages.length}
- **Total Files**: ${analysis.totalFiles}
- **Total Directories**: ${analysis.totalDirectories}

## Technology Stack
${this.analyzeTechnologyStack()}

## Architecture Patterns
${this.analyzeArchitecturePatterns()}

## Key Features
${this.analyzeKeyFeatures()}

## Development Guidelines
${this.generateDevelopmentGuidelines()}
`

		return {
			content: [
				{
					type: 'text',
					text: summary,
				},
			],
		}
	}

	// Implement other methods...
	private scanDirectory(
		dir: string,
		analysis: any,
		depth: number,
		maxDepth: number
	) {
		// Implementation similar to previous examples
	}

	private analyzeTechnologyStack(): string {
		// Analyze package.json, imports, file extensions
		// Return technology stack information
		return '- React/Next.js\n- TypeScript\n- Tailwind CSS\n- [Add your stack]'
	}

	private analyzeArchitecturePatterns(): string {
		// Analyze code patterns, folder structure, naming conventions
		return '- Component-based architecture\n- Service layer pattern\n- [Add your patterns]'
	}

	private analyzeKeyFeatures(): string {
		// Analyze main features based on components and services
		return '- User authentication\n- Data management\n- [Add your features]'
	}

	private generateDevelopmentGuidelines(): string {
		// Generate guidelines based on project analysis
		return '- Use TypeScript for all new code\n- Follow component patterns\n- [Add your guidelines]'
	}
}

// MCP Protocol Implementation
const mcp = new UniversalCursorMCP()

process.stdin.setEncoding('utf8')
let buffer = ''

process.stdin.on('data', chunk => {
	buffer += chunk

	const lines = buffer.split('\n')
	buffer = lines.pop() || ''

	for (const line of lines) {
		if (line.trim()) {
			try {
				const message = JSON.parse(line)
				handleMessage(message)
			} catch (error) {
				// Ignore invalid JSON
			}
		}
	}
})

async function handleMessage(message: any) {
	try {
		if (message.method === 'tools/list') {
			const response = {
				jsonrpc: '2.0',
				id: message.id,
				result: {
					tools: mcp.listTools(),
				},
			}
			console.log(JSON.stringify(response))
		} else if (message.method === 'tools/call') {
			const { name, arguments: args } = message.params
			const result = await mcp.executeTool(name, args)

			const response = {
				jsonrpc: '2.0',
				id: message.id,
				result,
			}
			console.log(JSON.stringify(response))
		}
	} catch (error) {
		const response = {
			jsonrpc: '2.0',
			id: message.id,
			error: {
				code: -1,
				message: error instanceof Error ? error.message : 'Unknown error',
			},
		}
		console.log(JSON.stringify(response))
	}
}

// Send initialization message
console.log(
	JSON.stringify({
		jsonrpc: '2.0',
		method: 'initialize',
		params: {
			protocolVersion: '2024-11-05',
			capabilities: {
				tools: {},
			},
			clientInfo: {
				name: 'universal-cursor-mcp',
				version: '1.0.0',
			},
		},
	})
)

console.error('Universal Cursor MCP Server running on stdio')
```

## ⚙️ Phase 5: Cursor Configuration

### Step 9: Create Cursor Configuration

Create `.cursor/mcp.json`:

```json
{
	"mcpServers": {
		"universal-cursor-mcp": {
			"command": "tsx",
			"args": ["mcp-curcontext/server.ts"],
			"env": {
				"NODE_ENV": "development"
			}
		}
	}
}
```

### Step 10: Create Cursor Rules

Create `.cursorrules`:

```markdown
# Cursor Rules for [Your Project Name]

## Project Context

This is a [Technology Stack] project with [Key Features].

## Key Technologies

- [Technology 1] - [Purpose]
- [Technology 2] - [Purpose]
- [Technology 3] - [Purpose]

## Project Structure

- `src/` - Source code
- `components/` - React/Vue/Angular components
- `services/` - Business logic and API calls
- `utils/` - Utility functions
- `types/` - TypeScript type definitions

## Architecture Patterns

- [Pattern 1] - [Description]
- [Pattern 2] - [Description]
- [Pattern 3] - [Description]

## Development Guidelines

- Use TypeScript for all new code
- Follow [Framework] best practices
- Implement proper error handling
- Write comprehensive tests
- Use consistent naming conventions

## MCP Integration

The project includes a Cursor MCP system that provides:

- Repository intelligence and navigation
- Component discovery and analysis
- Code generation following project patterns
- Debugging and performance assistance
- Documentation generation

## Code Style

- Use functional components with hooks
- Prefer composition over inheritance
- Use proper TypeScript types
- Follow [Framework] best practices
- Implement proper error boundaries

## Testing

- Write unit tests for services
- Test component interactions
- Validate business logic
- Test API integrations
- Verify error handling

## Performance

- Use [Framework] optimization techniques
- Implement proper loading states
- Optimize bundle size
- Monitor performance metrics
- Use lazy loading where appropriate
```

### Step 11: Create Package Configuration

Create `mcp-curcontext/package.json`:

```json
{
	"name": "universal-cursor-mcp",
	"version": "1.0.0",
	"description": "Universal Cursor MCP System for intelligent development assistance",
	"main": "server.ts",
	"type": "module",
	"scripts": {
		"server": "tsx server.ts",
		"test": "echo 'Tests not implemented yet'",
		"build": "tsc"
	},
	"keywords": [
		"mcp",
		"cursor",
		"development",
		"assistance",
		"code-generation",
		"debugging"
	],
	"author": "Your Name",
	"license": "MIT",
	"dependencies": {
		"typescript": "^5.0.0"
	},
	"devDependencies": {
		"@types/node": "^20.0.0",
		"tsx": "^4.0.0"
	}
}
```

## 📚 Phase 6: Documentation & Testing

### Step 12: Create Setup Guide

Create `CURSOR_SETUP_GUIDE.md`:

```markdown
# Cursor MCP Setup Guide

## Quick Setup

1. Restart Cursor to pick up the new configuration
2. Start a new chat - the AI will now have access to your project intelligence
3. Test with: "Analyze my project structure"

## Available Tools

- `analyze_project` - Complete project analysis
- `find_components` - Component discovery
- `get_component_info` - Detailed component information
- `suggest_improvements` - Codebase improvement suggestions
- `generate_code` - Code generation following project patterns

## Usage Examples

- "Analyze my project and tell me about the architecture"
- "Find all components related to user management"
- "Generate a new service component for data processing"
- "Suggest improvements for performance optimization"

## Troubleshooting

- Ensure `tsx` is installed globally or in the project
- Check that the MCP server is enabled in Cursor settings
- Restart Cursor if the integration doesn't work immediately
```

### Step 13: Update Git Configuration

Update `.gitignore`:

```gitignore
# MCP System
mcp-curcontext/node_modules/
mcp-curcontext/dist/
mcp-curcontext/coverage/
mcp-curcontext/*.log
mcp-curcontext/test-*.ts
mcp-curcontext/package-lock.json

# Generated files
*.d.ts
*.d.ts.map
*.js
*.js.map
*.mjs
```

## 🚀 Phase 7: Testing & Validation

### Step 14: Test the Integration

```bash
# Test the MCP server
cd mcp-curcontext
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm run server

# Test specific tool
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"analyze_project","arguments":{}}}' | npm run server
```

### Step 15: Validate Cursor Integration

1. Restart Cursor completely
2. Start a new chat
3. Test with: "Analyze my project structure"
4. Verify the AI provides detailed, project-specific information

## 🎯 Customization Guidelines

### For Different Project Types

**React/Next.js Projects:**

- Focus on component analysis and generation
- Include routing and state management patterns
- Add UI library integration (Material-UI, Chakra, etc.)

**Node.js/Express Projects:**

- Emphasize API endpoint analysis
- Include middleware and authentication patterns
- Add database integration patterns

**Python/Django Projects:**

- Focus on model and view analysis
- Include Django-specific patterns
- Add testing and migration assistance

**Vue.js Projects:**

- Emphasize component and composition API patterns
- Include Vuex/Pinia state management
- Add Vue Router integration

### Domain-Specific Customizations

**E-commerce Projects:**

- Add product, order, and payment MCPs
- Include inventory management patterns
- Add customer service integration

**SaaS Applications:**

- Focus on user management and subscription patterns
- Include multi-tenancy considerations
- Add billing and analytics integration

**Data Processing Projects:**

- Emphasize ETL and data pipeline patterns
- Include data validation and transformation
- Add monitoring and alerting capabilities

## 📈 Advanced Features

### Code Generation Templates

Create templates for common patterns in your project:

```typescript
const codeTemplates = {
	component: (name: string, props: any[]) => `// Generated component template`,
	service: (name: string, methods: string[]) => `// Generated service template`,
	hook: (name: string, dependencies: string[]) => `// Generated hook template`,
	test: (component: string, testCases: string[]) =>
		`// Generated test template`,
}
```

### Performance Monitoring

Add performance tracking to MCP operations:

```typescript
private trackPerformance(operation: string, startTime: number) {
  const duration = performance.now() - startTime
  console.log(`MCP Operation: ${operation} took ${duration}ms`)
}
```

### Error Handling & Logging

Implement comprehensive error handling:

```typescript
private handleError(operation: string, error: Error): MCPError {
  console.error(`MCP Error in ${operation}:`, error)
  return {
    code: 'MCP_ERROR',
    message: error.message,
    details: { operation, timestamp: Date.now() }
  }
}
```

## 🎉 Success Criteria

Your MCP integration is successful when:

1. **Cursor AI provides project-specific insights** - Not generic advice, but tailored to your codebase
2. **Code generation follows your patterns** - Generated code matches your project's conventions
3. **Component discovery works accurately** - AI can find and analyze your components correctly
4. **Improvement suggestions are relevant** - Recommendations are specific to your project's needs
5. **Integration is seamless** - No manual configuration needed after initial setup

## 🔄 Maintenance

### Regular Updates

- Update MCP tools as your project evolves
- Add new domain-specific MCPs for new features
- Refine code generation templates based on usage
- Update Cursor rules as patterns change

### Monitoring

- Track MCP operation performance
- Monitor error rates and fix issues
- Collect feedback on AI assistance quality
- Update documentation based on user needs

---

**Ready to implement!** Follow this guide step-by-step to give Cursor AI deep understanding of any codebase and enable intelligent development assistance. 🚀
