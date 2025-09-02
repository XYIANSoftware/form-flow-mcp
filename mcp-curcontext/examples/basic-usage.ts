/**
 * Basic Usage Examples for Cursor MCP System
 *
 * Demonstrates how to use the various MCPs for common development tasks.
 */

import { FormFlowRepositoryMCP } from '../implementations/FormFlowRepositoryMCP'
import { CodeAnalyzer } from '../utils/CodeAnalyzer'

/**
 * Example: Analyze project structure
 */
export async function analyzeProjectStructure() {
	console.log('🔍 Analyzing project structure...')

	const result = await FormFlowRepositoryMCP.getProjectStructure()

	if (result.success) {
		console.log('✅ Project structure analyzed successfully')
		console.log(`📁 Root: ${result.data.root}`)
		console.log(`📂 Directories: ${result.data.directories.length}`)
		console.log(`📄 Files: ${result.data.files.length}`)
		console.log(`🔗 Dependencies: ${result.data.dependencies.length}`)
		console.log(`⏱️  Execution time: ${result.executionTime}ms`)
	} else {
		console.error('❌ Failed to analyze project structure')
		result.errors.forEach(error => {
			console.error(`  Error ${error.code}: ${error.message}`)
		})
	}
}

/**
 * Example: Find files by pattern
 */
export async function findFilesByPattern() {
	console.log('🔍 Searching for TypeScript files...')

	const result = await FormFlowRepositoryMCP.findFilesByPattern('*.ts')

	if (result.success) {
		console.log('✅ Found TypeScript files')
		console.log(`📄 Found ${result.data.length} files`)
		result.data.forEach(file => {
			console.log(`  - ${file.name} (${file.type})`)
		})
		console.log(`⏱️  Execution time: ${result.executionTime}ms`)
	} else {
		console.error('❌ Failed to search files')
		result.errors.forEach(error => {
			console.error(`  Error ${error.code}: ${error.message}`)
		})
	}
}

/**
 * Example: Analyze codebase
 */
export async function analyzeCodebase() {
	console.log('🔍 Analyzing codebase...')

	const result = await FormFlowRepositoryMCP.analyzeCodebase()

	if (result.success) {
		console.log('✅ Codebase analysis completed')
		console.log(`📊 Total files: ${result.data.totalFiles}`)
		console.log(`📏 Total lines: ${result.data.totalLines}`)
		console.log(`🧩 Complexity: ${result.data.complexity}`)
		console.log(`🔍 Patterns found: ${result.data.patterns.length}`)
		console.log(`⚠️  Issues found: ${result.data.issues.length}`)
		console.log(`💡 Recommendations: ${result.data.recommendations.length}`)
		console.log(`⏱️  Execution time: ${result.executionTime}ms`)
	} else {
		console.error('❌ Failed to analyze codebase')
		result.errors.forEach(error => {
			console.error(`  Error ${error.code}: ${error.message}`)
		})
	}
}

/**
 * Example: Find similar components
 */
export async function findSimilarComponents() {
	console.log('🔍 Finding similar components...')

	const result = await FormFlowRepositoryMCP.findSimilarComponents('Button')

	if (result.success) {
		console.log('✅ Similar components found')
		console.log(`🔍 Found ${result.data.length} similar components`)
		result.data.forEach(match => {
			console.log(
				`  - ${match.component.name} (similarity: ${(
					match.similarity * 100
				).toFixed(1)}%)`
			)
			match.reasons.forEach(reason => {
				console.log(`    Reason: ${reason}`)
			})
		})
		console.log(`⏱️  Execution time: ${result.executionTime}ms`)
	} else {
		console.error('❌ Failed to find similar components')
		result.errors.forEach(error => {
			console.error(`  Error ${error.code}: ${error.message}`)
		})
	}
}

/**
 * Example: Get MCP architecture
 */
export async function getMCPArchitecture() {
	console.log('🔍 Analyzing MCP architecture...')

	const result = await FormFlowRepositoryMCP.getMCPArchitecture()

	if (result.success) {
		console.log('✅ MCP architecture analyzed')
		console.log(`📋 Protocols: ${result.data.protocols.length}`)
		console.log(`🔧 Implementations: ${result.data.implementations.length}`)
		console.log(`🔗 Relationships: ${result.data.relationships.length}`)
		console.log(`💚 Health score: ${result.data.health.overall}`)
		console.log(`⏱️  Execution time: ${result.executionTime}ms`)
	} else {
		console.error('❌ Failed to analyze MCP architecture')
		result.errors.forEach(error => {
			console.error(`  Error ${error.code}: ${error.message}`)
		})
	}
}

/**
 * Example: Analyze a specific file
 */
export function analyzeFile() {
	console.log('🔍 Analyzing file...')

	try {
		const analysis = CodeAnalyzer.analyzeTypeScriptFile('./src/app/page.tsx')

		console.log('✅ File analysis completed')
		console.log(`📄 File: page.tsx`)
		console.log(`📏 Lines: ${analysis.lines}`)
		console.log(`🧩 Complexity: ${analysis.complexity}`)
		console.log(`📥 Imports: ${analysis.imports.length}`)
		console.log(`📤 Exports: ${analysis.exports.length}`)
		console.log(`🔧 Functions: ${analysis.functions.length}`)
		console.log(`🏗️  Classes: ${analysis.classes.length}`)
		console.log(`📋 Interfaces: ${analysis.interfaces.length}`)
		console.log(`🏷️  Types: ${analysis.types.length}`)

		if (analysis.imports.length > 0) {
			console.log('📥 Imports:')
			analysis.imports.forEach(imp => {
				console.log(`  - ${imp.source} (line ${imp.line})`)
			})
		}

		if (analysis.exports.length > 0) {
			console.log('📤 Exports:')
			analysis.exports.forEach(exp => {
				console.log(`  - ${exp.name} (line ${exp.line})`)
			})
		}
	} catch (error) {
		console.error('❌ Failed to analyze file:', error)
	}
}

/**
 * Example: Find similar components using CodeAnalyzer
 */
export function findSimilarComponentsWithAnalyzer() {
	console.log('🔍 Finding similar components with CodeAnalyzer...')

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
			name: 'CancelButton',
			type: 'button',
			props: ['label', 'onClick'],
			location: 'src/components/CancelButton.tsx',
		},
		{
			name: 'Input',
			type: 'input',
			props: ['value', 'onChange'],
			location: 'src/components/Input.tsx',
		},
		{
			name: 'TextInput',
			type: 'input',
			props: ['value', 'onChange', 'placeholder'],
			location: 'src/components/TextInput.tsx',
		},
	]

	const matches = CodeAnalyzer.findSimilarComponents('Button', components)

	console.log('✅ Similar components found')
	console.log(`🔍 Found ${matches.length} similar components`)
	matches.forEach(match => {
		console.log(
			`  - ${match.component.name} (similarity: ${(
				match.similarity * 100
			).toFixed(1)}%)`
		)
		match.reasons.forEach(reason => {
			console.log(`    Reason: ${reason}`)
		})
	})
}

/**
 * Run all examples
 */
export async function runAllExamples() {
	console.log('🚀 Running Cursor MCP System Examples\n')

	try {
		await analyzeProjectStructure()
		console.log('')

		await findFilesByPattern()
		console.log('')

		await analyzeCodebase()
		console.log('')

		await findSimilarComponents()
		console.log('')

		await getMCPArchitecture()
		console.log('')

		analyzeFile()
		console.log('')

		findSimilarComponentsWithAnalyzer()
		console.log('')

		console.log('✅ All examples completed successfully!')
	} catch (error) {
		console.error('❌ Error running examples:', error)
	}
}

// Export individual functions for testing
export {
	analyzeProjectStructure,
	findFilesByPattern,
	analyzeCodebase,
	findSimilarComponents,
	getMCPArchitecture,
	analyzeFile,
	findSimilarComponentsWithAnalyzer,
}
