/**
 * CodeAnalyzer - Utility for analyzing code patterns and structure
 *
 * Provides helper functions for code analysis, pattern recognition,
 * and structural understanding of the Form-Flow repository.
 */

import * as fs from 'fs'
import * as path from 'path'

export class CodeAnalyzer {
	/**
	 * Analyze a TypeScript file for imports, exports, and structure
	 */
	static analyzeTypeScriptFile(filePath: string): FileAnalysis {
		try {
			const content = fs.readFileSync(filePath, 'utf-8')

			return {
				imports: this.extractImports(content),
				exports: this.extractExports(content),
				functions: this.extractFunctions(content),
				classes: this.extractClasses(content),
				interfaces: this.extractInterfaces(content),
				types: this.extractTypes(content),
				complexity: this.calculateComplexity(content),
				lines: content.split('\n').length,
			}
		} catch (error) {
			throw new Error(`Failed to analyze file ${filePath}: ${error}`)
		}
	}

	/**
	 * Extract import statements from file content
	 */
	private static extractImports(content: string): ImportInfo[] {
		const importRegex =
			/import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g
		const imports: ImportInfo[] = []
		let match

		while ((match = importRegex.exec(content)) !== null) {
			imports.push({
				source: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return imports
	}

	/**
	 * Extract export statements from file content
	 */
	private static extractExports(content: string): ExportInfo[] {
		const exportRegex =
			/export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+(\w+)/g
		const exports: ExportInfo[] = []
		let match

		while ((match = exportRegex.exec(content)) !== null) {
			exports.push({
				name: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return exports
	}

	/**
	 * Extract function definitions from file content
	 */
	private static extractFunctions(content: string): FunctionInfo[] {
		const functionRegex =
			/(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)/g
		const functions: FunctionInfo[] = []
		let match

		while ((match = functionRegex.exec(content)) !== null) {
			functions.push({
				name: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return functions
	}

	/**
	 * Extract class definitions from file content
	 */
	private static extractClasses(content: string): ClassInfo[] {
		const classRegex = /(?:export\s+)?class\s+(\w+)/g
		const classes: ClassInfo[] = []
		let match

		while ((match = classRegex.exec(content)) !== null) {
			classes.push({
				name: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return classes
	}

	/**
	 * Extract interface definitions from file content
	 */
	private static extractInterfaces(content: string): InterfaceInfo[] {
		const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g
		const interfaces: InterfaceInfo[] = []
		let match

		while ((match = interfaceRegex.exec(content)) !== null) {
			interfaces.push({
				name: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return interfaces
	}

	/**
	 * Extract type definitions from file content
	 */
	private static extractTypes(content: string): TypeInfo[] {
		const typeRegex = /(?:export\s+)?type\s+(\w+)/g
		const types: TypeInfo[] = []
		let match

		while ((match = typeRegex.exec(content)) !== null) {
			types.push({
				name: match[1],
				line: content.substring(0, match.index).split('\n').length,
			})
		}

		return types
	}

	/**
	 * Calculate code complexity based on cyclomatic complexity
	 */
	private static calculateComplexity(content: string): number {
		const complexityKeywords = [
			'if',
			'else',
			'for',
			'while',
			'do',
			'switch',
			'case',
			'catch',
			'&&',
			'||',
			'?',
			':',
		]

		let complexity = 1 // Base complexity

		complexityKeywords.forEach(keyword => {
			const regex = new RegExp(`\\b${keyword}\\b`, 'g')
			const matches = content.match(regex)
			if (matches) {
				complexity += matches.length
			}
		})

		return complexity
	}

	/**
	 * Analyze project structure and dependencies
	 */
	static analyzeProjectStructure(rootPath: string): ProjectStructure {
		const structure: ProjectStructure = {
			root: rootPath,
			directories: [],
			files: [],
			dependencies: [],
		}

		this.analyzeDirectory(rootPath, structure)
		return structure
	}

	/**
	 * Recursively analyze directory structure
	 */
	private static analyzeDirectory(
		dirPath: string,
		structure: ProjectStructure
	): void {
		try {
			const items = fs.readdirSync(dirPath)

			items.forEach(item => {
				const itemPath = path.join(dirPath, item)
				const stat = fs.statSync(itemPath)

				if (stat.isDirectory()) {
					structure.directories.push({
						name: item,
						path: itemPath,
						type: this.determineDirectoryType(item),
						children: [],
					})

					// Recursively analyze subdirectories
					this.analyzeDirectory(itemPath, structure)
				} else if (stat.isFile()) {
					structure.files.push({
						name: item,
						path: itemPath,
						type: this.determineFileType(item),
						size: stat.size,
						lastModified: stat.mtime,
					})
				}
			})
		} catch (error) {
			console.warn(`Failed to analyze directory ${dirPath}: ${error}`)
		}
	}

	/**
	 * Determine directory type based on name
	 */
	private static determineDirectoryType(name: string): string {
		if (name === 'src') return 'src'
		if (name === 'docs') return 'docs'
		if (name === 'public') return 'public'
		if (name === 'tests' || name === '__tests__') return 'tests'
		if (name.startsWith('.')) return 'config'
		return 'other'
	}

	/**
	 * Determine file type based on extension
	 */
	private static determineFileType(name: string): string {
		const ext = path.extname(name)

		switch (ext) {
			case '.tsx':
			case '.jsx':
				return 'component'
			case '.ts':
			case '.js':
				return 'mcp'
			case '.md':
				return 'documentation'
			case '.json':
				return 'config'
			case '.css':
			case '.scss':
				return 'style'
			default:
				return 'other'
		}
	}

	/**
	 * Find similar components based on name and structure
	 */
	static findSimilarComponents(
		targetName: string,
		components: ComponentInfo[]
	): ComponentMatch[] {
		const matches: ComponentMatch[] = []

		components.forEach(component => {
			const similarity = this.calculateSimilarity(targetName, component.name)

			if (similarity > 0.3) {
				// Threshold for similarity
				matches.push({
					component,
					similarity,
					reasons: this.getSimilarityReasons(targetName, component.name),
				})
			}
		})

		return matches.sort((a, b) => b.similarity - a.similarity)
	}

	/**
	 * Calculate similarity between two strings
	 */
	private static calculateSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2
		const shorter = str1.length > str2.length ? str2 : str1

		if (longer.length === 0) return 1.0

		const distance = this.levenshteinDistance(longer, shorter)
		return (longer.length - distance) / longer.length
	}

	/**
	 * Calculate Levenshtein distance between two strings
	 */
	private static levenshteinDistance(str1: string, str2: string): number {
		const matrix = []

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i]
		}

		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1]
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1,
						matrix[i][j - 1] + 1,
						matrix[i - 1][j] + 1
					)
				}
			}
		}

		return matrix[str2.length][str1.length]
	}

	/**
	 * Get reasons for similarity between two component names
	 */
	private static getSimilarityReasons(name1: string, name2: string): string[] {
		const reasons: string[] = []

		// Check for common words
		const words1 = name1.toLowerCase().split(/(?=[A-Z])|[-_\s]/)
		const words2 = name2.toLowerCase().split(/(?=[A-Z])|[-_\s]/)

		const commonWords = words1.filter(word => words2.includes(word))
		if (commonWords.length > 0) {
			reasons.push(`Common words: ${commonWords.join(', ')}`)
		}

		// Check for similar patterns
		if (name1.includes('Input') && name2.includes('Input')) {
			reasons.push('Both are input components')
		}

		if (name1.includes('Button') && name2.includes('Button')) {
			reasons.push('Both are button components')
		}

		if (name1.includes('Form') && name2.includes('Form')) {
			reasons.push('Both are form components')
		}

		return reasons
	}
}

// Type definitions
export interface FileAnalysis {
	imports: ImportInfo[]
	exports: ExportInfo[]
	functions: FunctionInfo[]
	classes: ClassInfo[]
	interfaces: InterfaceInfo[]
	types: TypeInfo[]
	complexity: number
	lines: number
}

export interface ImportInfo {
	source: string
	line: number
}

export interface ExportInfo {
	name: string
	line: number
}

export interface FunctionInfo {
	name: string
	line: number
}

export interface ClassInfo {
	name: string
	line: number
}

export interface InterfaceInfo {
	name: string
	line: number
}

export interface TypeInfo {
	name: string
	line: number
}

export interface ProjectStructure {
	root: string
	directories: DirectoryInfo[]
	files: FileInfo[]
	dependencies: DependencyInfo[]
}

export interface DirectoryInfo {
	name: string
	path: string
	type: string
	children: any[]
}

export interface FileInfo {
	name: string
	path: string
	type: string
	size: number
	lastModified: Date
}

export interface DependencyInfo {
	from: string
	to: string
	type: string
}

export interface ComponentInfo {
	name: string
	type: string
	props: string[]
	location: string
}

export interface ComponentMatch {
	component: ComponentInfo
	similarity: number
	reasons: string[]
}
