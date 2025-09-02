/**
 * Jest Test Setup
 *
 * Global test configuration and setup for the Cursor MCP system tests.
 */

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }

beforeAll(() => {
	// Suppress console output during tests unless explicitly enabled
	if (!process.env.ENABLE_TEST_LOGS) {
		console.log = jest.fn()
		console.info = jest.fn()
		console.warn = jest.fn()
		console.error = jest.fn()
	}
})

afterAll(() => {
	// Restore original console methods
	Object.assign(console, originalConsole)
})

// Global test utilities
global.testUtils = {
	// Mock file system operations
	mockFileSystem: (files: Record<string, string>) => {
		const fs = require('fs')
		const originalReadFileSync = fs.readFileSync
		const originalExistsSync = fs.existsSync
		const originalReaddirSync = fs.readdirSync
		const originalStatSync = fs.statSync

		fs.readFileSync = jest.fn((path: string) => {
			if (files[path]) {
				return files[path]
			}
			return originalReadFileSync(path)
		})

		fs.existsSync = jest.fn((path: string) => {
			if (files.hasOwnProperty(path)) {
				return true
			}
			return originalExistsSync(path)
		})

		fs.readdirSync = jest.fn((path: string) => {
			const dirFiles = Object.keys(files).filter(
				file => file.startsWith(path) && file !== path
			)
			return dirFiles.map(file => file.replace(path + '/', ''))
		})

		fs.statSync = jest.fn((path: string) => {
			if (files[path]) {
				return {
					isFile: () => true,
					isDirectory: () => false,
					size: files[path].length,
					mtime: new Date(),
				}
			}
			return originalStatSync(path)
		})

		return () => {
			fs.readFileSync = originalReadFileSync
			fs.existsSync = originalExistsSync
			fs.readdirSync = originalReaddirSync
			fs.statSync = originalStatSync
		}
	},

	// Create mock MCP result
	createMockMCPResult: <T>(data: T, success: boolean = true) => ({
		success,
		data: success ? data : undefined,
		errors: success ? [] : [{ code: 'MOCK_ERROR', message: 'Mock error' }],
		executionTime: Math.random() * 100,
	}),

	// Create mock component
	createMockComponent: (name: string, type: string = 'component') => ({
		id: name.toLowerCase(),
		name,
		type,
		props: {},
		validation: {},
		metadata: {
			author: 'Test',
			version: '1.0.0',
			tags: [type],
			documentation: `Mock ${type} component`,
		},
	}),

	// Create mock file info
	createMockFileInfo: (name: string, type: string = 'other') => ({
		name,
		path: `./src/${name}`,
		type,
		size: Math.floor(Math.random() * 1000),
		lastModified: new Date(),
		dependencies: [],
		exports: [],
		imports: [],
	}),

	// Wait for async operations
	waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

	// Mock performance.now
	mockPerformance: () => {
		const originalNow = performance.now
		let time = 0
		performance.now = jest.fn(() => (time += Math.random() * 10))
		return () => {
			performance.now = originalNow
		}
	},
}

// Extend Jest matchers
expect.extend({
	toBeValidMCPResult(received) {
		const pass =
			received &&
			typeof received.success === 'boolean' &&
			typeof received.executionTime === 'number' &&
			(received.success
				? received.data !== undefined
				: received.errors !== undefined)

		if (pass) {
			return {
				message: () => `expected ${received} not to be a valid MCP result`,
				pass: true,
			}
		} else {
			return {
				message: () => `expected ${received} to be a valid MCP result`,
				pass: false,
			}
		}
	},

	toHaveValidExecutionTime(received) {
		const pass =
			received &&
			typeof received.executionTime === 'number' &&
			received.executionTime >= 0

		if (pass) {
			return {
				message: () =>
					`expected ${received} not to have a valid execution time`,
				pass: true,
			}
		} else {
			return {
				message: () => `expected ${received} to have a valid execution time`,
				pass: false,
			}
		}
	},
})

// Declare global types
declare global {
	namespace jest {
		interface Matchers<R> {
			toBeValidMCPResult(): R
			toHaveValidExecutionTime(): R
		}
	}

	var testUtils: {
		mockFileSystem: (files: Record<string, string>) => () => void
		createMockMCPResult: <T>(data: T, success?: boolean) => any
		createMockComponent: (name: string, type?: string) => any
		createMockFileInfo: (name: string, type?: string) => any
		waitFor: (ms: number) => Promise<void>
		mockPerformance: () => () => void
	}
}
