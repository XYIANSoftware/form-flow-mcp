/**
 * FormAssistanceMCP - Model Context Protocol implementation for Form Assistance
 *
 * Provides intelligent assistance features for form creation including contextual help,
 * template intelligence, and performance analysis.
 */

import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { Form, FormField } from '@/types'
import { generateId } from '@/utils'

// Types for assistance features
export interface HelpContent {
	id: string
	title: string
	description: string
	steps?: string[]
	actions?: HelpAction[]
	relatedTopics?: string[]
	videoUrl?: string
}

export interface HelpAction {
	type: 'navigate' | 'apply' | 'dismiss' | 'close'
	label: string
	icon?: string
	action?: string
}

export interface OptimizationSuggestion {
	id: string
	type: 'performance' | 'usability' | 'accessibility' | 'security'
	title: string
	description: string
	impact: 'low' | 'medium' | 'high'
	effort: 'low' | 'medium' | 'high'
	action?: string
	estimatedImprovement?: string
}

export interface FormRequirements {
	purpose: string
	industry?: string
	audience?: string
	complexity?: 'simple' | 'intermediate' | 'advanced'
	fields?: string[]
	features?: string[]
}

export interface TemplateMatch {
	templateId: string
	templateName: string
	description: string
	fields: FormField[]
	similarity: number
	industry?: string
	useCase?: string
}

export interface Template {
	id: string
	name: string
	description: string
	category: string
	industry?: string
	fields: FormField[]
	preview?: string
	tags: string[]
}

export interface PerformanceAnalysis {
	loadTime: number
	fieldCount: number
	complexityScore: number
	optimizationSuggestions: OptimizationSuggestion[]
	performanceScore: number
}

export interface PerformanceSuggestion {
	id: string
	type: 'lazy-loading' | 'field-optimization' | 'validation-optimization' | 'bundle-optimization'
	title: string
	description: string
	impact: 'low' | 'medium' | 'high'
	effort: 'low' | 'medium' | 'high'
	estimatedImprovement: string
	action?: string
}

export interface UserContext {
	userId: string
	currentAction: string
	currentField?: FormField
	currentForm?: Form
	userPreferences?: Record<string, unknown>
	experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
}

export class FormAssistanceMCP {
	/**
	 * Provides contextual help based on current user context
	 */
	static provideContextualHelp(context: UserContext): MCPResult<HelpContent> {
		const tracker = MCPLogger.createPerformanceTracker('provideContextualHelp')

		try {
			console.log('🆘 FormAssistanceMCP: Providing contextual help...')
			console.log('👤 User ID:', context.userId)
			console.log('🎯 Current action:', context.currentAction)

			const helpContent = FormAssistanceMCP.generateContextualHelp(context)

			const result: MCPResult<HelpContent> = {
				success: true,
				data: helpContent,
				metadata: {
					executionTime: tracker.end(),
					operation: 'provideContextualHelp',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('provideContextualHelp', context, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'HELP_ERROR',
				message: 'Unexpected error providing contextual help',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<HelpContent> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'provideContextualHelp',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('provideContextualHelp', mcpError)
			return result
		}
	}

	/**
	 * Suggests form optimizations based on current form state
	 */
	static suggestFormOptimizations(form: Form): MCPResult<OptimizationSuggestion[]> {
		const tracker = MCPLogger.createPerformanceTracker('suggestFormOptimizations')

		try {
			console.log('💡 FormAssistanceMCP: Suggesting form optimizations...')
			console.log('📝 Form ID:', form.id)
			console.log('📊 Field count:', form.fields.length)

			const suggestions = FormAssistanceMCP.generateOptimizationSuggestions(form)

			const result: MCPResult<OptimizationSuggestion[]> = {
				success: true,
				data: suggestions,
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestFormOptimizations',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('suggestFormOptimizations', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'OPTIMIZATION_ERROR',
				message: 'Unexpected error suggesting form optimizations',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<OptimizationSuggestion[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestFormOptimizations',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('suggestFormOptimizations', mcpError)
			return result
		}
	}

	/**
	 * Finds matching templates based on requirements
	 */
	static findMatchingTemplates(requirements: FormRequirements): MCPResult<TemplateMatch[]> {
		const tracker = MCPLogger.createPerformanceTracker('findMatchingTemplates')

		try {
			console.log('🔍 FormAssistanceMCP: Finding matching templates...')
			console.log('🎯 Purpose:', requirements.purpose)
			console.log('🏭 Industry:', requirements.industry)

			const matches = FormAssistanceMCP.matchTemplates(requirements)

			const result: MCPResult<TemplateMatch[]> = {
				success: true,
				data: matches,
				metadata: {
					executionTime: tracker.end(),
					operation: 'findMatchingTemplates',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('findMatchingTemplates', requirements, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'TEMPLATE_ERROR',
				message: 'Unexpected error finding matching templates',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<TemplateMatch[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'findMatchingTemplates',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('findMatchingTemplates', mcpError)
			return result
		}
	}

	/**
	 * Generates a custom template based on requirements
	 */
	static generateCustomTemplate(requirements: FormRequirements): MCPResult<Template> {
		const tracker = MCPLogger.createPerformanceTracker('generateCustomTemplate')

		try {
			console.log('🏗️ FormAssistanceMCP: Generating custom template...')
			console.log('🎯 Purpose:', requirements.purpose)

			const template = FormAssistanceMCP.createCustomTemplate(requirements)

			const result: MCPResult<Template> = {
				success: true,
				data: template,
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateCustomTemplate',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('generateCustomTemplate', requirements, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'TEMPLATE_ERROR',
				message: 'Unexpected error generating custom template',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<Template> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateCustomTemplate',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('generateCustomTemplate', mcpError)
			return result
		}
	}

	/**
	 * Analyzes form performance and provides insights
	 */
	static analyzeFormPerformance(form: Form): MCPResult<PerformanceAnalysis> {
		const tracker = MCPLogger.createPerformanceTracker('analyzeFormPerformance')

		try {
			console.log('📊 FormAssistanceMCP: Analyzing form performance...')
			console.log('📝 Form ID:', form.id)

			const analysis = FormAssistanceMCP.calculatePerformanceAnalysis(form)

			const result: MCPResult<PerformanceAnalysis> = {
				success: true,
				data: analysis,
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeFormPerformance',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('analyzeFormPerformance', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'ANALYSIS_ERROR',
				message: 'Unexpected error analyzing form performance',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<PerformanceAnalysis> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeFormPerformance',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('analyzeFormPerformance', mcpError)
			return result
		}
	}

	/**
	 * Suggests performance improvements for a form
	 */
	static suggestPerformanceImprovements(form: Form): MCPResult<PerformanceSuggestion[]> {
		const tracker = MCPLogger.createPerformanceTracker('suggestPerformanceImprovements')

		try {
			console.log('⚡ FormAssistanceMCP: Suggesting performance improvements...')
			console.log('📝 Form ID:', form.id)

			const suggestions = FormAssistanceMCP.generatePerformanceSuggestions(form)

			const result: MCPResult<PerformanceSuggestion[]> = {
				success: true,
				data: suggestions,
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestPerformanceImprovements',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('suggestPerformanceImprovements', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'PERFORMANCE_ERROR',
				message: 'Unexpected error suggesting performance improvements',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<PerformanceSuggestion[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestPerformanceImprovements',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('suggestPerformanceImprovements', mcpError)
			return result
		}
	}

	// ===== PRIVATE HELPER METHODS =====

	/**
	 * Generates contextual help based on user context
	 */
	private static generateContextualHelp(context: UserContext): HelpContent {
		const action = context.currentAction.toLowerCase()

		// Help for different actions
		if (action.includes('field') || action.includes('add')) {
			return {
				id: generateId(),
				title: 'Adding Fields to Your Form',
				description: 'Learn how to add and configure fields for your form',
				steps: [
					'Click on a field type from the field palette',
					'Drag and drop it onto your form canvas',
					'Configure the field properties in the right panel',
					'Set validation rules if needed',
					'Test your field by previewing the form',
				],
				actions: [
					{
						type: 'navigate',
						label: 'View Field Types',
						icon: 'pi pi-list',
						action: 'show-field-palette',
					},
					{
						type: 'apply',
						label: 'Add Sample Field',
						icon: 'pi pi-plus',
						action: 'add-sample-field',
					},
				],
				relatedTopics: ['Field Types', 'Validation', 'Form Layout'],
			}
		}

		if (action.includes('validation') || action.includes('validate')) {
			return {
				id: generateId(),
				title: 'Setting Up Field Validation',
				description: 'Configure validation rules to ensure data quality',
				steps: [
					'Select the field you want to validate',
					'Go to the validation section in properties',
					'Choose validation rules (required, pattern, range)',
					'Set custom error messages',
					'Test validation by previewing the form',
				],
				actions: [
					{
						type: 'apply',
						label: 'Add Email Validation',
						icon: 'pi pi-check',
						action: 'add-email-validation',
					},
				],
				relatedTopics: ['Field Types', 'Error Messages', 'Form Testing'],
			}
		}

		if (action.includes('layout') || action.includes('design')) {
			return {
				id: generateId(),
				title: 'Form Layout and Design',
				description: 'Organize your form for better user experience',
				steps: [
					'Group related fields together',
					'Use clear section headers',
					'Order fields logically (personal info first)',
					'Consider multi-step forms for long forms',
					'Test on different screen sizes',
				],
				actions: [
					{
						type: 'apply',
						label: 'Auto-Organize Fields',
						icon: 'pi pi-sort',
						action: 'auto-organize',
					},
				],
				relatedTopics: ['Field Grouping', 'Responsive Design', 'User Experience'],
			}
		}

		// Default help
		return {
			id: generateId(),
			title: 'Getting Started with Form Builder',
			description: 'Welcome to the Form Builder! Here are some tips to get you started',
			steps: [
				'Start by giving your form a clear title and description',
				'Add fields by dragging them from the field palette',
				'Configure field properties and validation rules',
				'Preview your form to test the user experience',
				'Use the quality dashboard to improve your form',
			],
			actions: [
				{
					type: 'navigate',
					label: 'View Tutorial',
					icon: 'pi pi-play',
					action: 'show-tutorial',
				},
				{
					type: 'apply',
					label: 'Create Sample Form',
					icon: 'pi pi-magic-wand',
					action: 'create-sample',
				},
			],
			relatedTopics: ['Field Types', 'Templates', 'Best Practices'],
		}
	}

	/**
	 * Generates optimization suggestions for a form
	 */
	private static generateOptimizationSuggestions(form: Form): OptimizationSuggestion[] {
		const suggestions: OptimizationSuggestion[] = []

		// Performance optimizations
		if (form.fields.length > 15) {
			suggestions.push({
				id: generateId(),
				type: 'performance',
				title: 'Consider Multi-Step Form',
				description: 'Forms with many fields can benefit from being split into multiple steps',
				impact: 'high',
				effort: 'medium',
				action: 'Split form into logical steps',
				estimatedImprovement: '30-50% improvement in completion rate',
			})
		}

		// Usability optimizations
		const requiredFields = form.fields.filter(f => f.required)
		if (requiredFields.length > 8) {
			suggestions.push({
				id: generateId(),
				type: 'usability',
				title: 'Reduce Required Fields',
				description: 'Too many required fields can reduce form completion rates',
				impact: 'high',
				effort: 'low',
				action: 'Make some fields optional',
				estimatedImprovement: '20-30% improvement in completion rate',
			})
		}

		// Accessibility optimizations
		const fieldsWithoutLabels = form.fields.filter(f => !f.label?.trim())
		if (fieldsWithoutLabels.length > 0) {
			suggestions.push({
				id: generateId(),
				type: 'accessibility',
				title: 'Add Field Labels',
				description: 'All fields should have descriptive labels for accessibility',
				impact: 'high',
				effort: 'low',
				action: 'Add clear labels to all fields',
				estimatedImprovement: 'Better accessibility compliance',
			})
		}

		// Security optimizations
		const fileFields = form.fields.filter(f => f.type === 'file')
		if (fileFields.length > 0) {
			suggestions.push({
				id: generateId(),
				type: 'security',
				title: 'Add File Upload Restrictions',
				description: 'File upload fields should have size and type restrictions',
				impact: 'medium',
				effort: 'low',
				action: 'Add file size and type restrictions',
				estimatedImprovement: 'Better security and performance',
			})
		}

		return suggestions
	}

	/**
	 * Matches templates based on requirements
	 */
	private static matchTemplates(requirements: FormRequirements): TemplateMatch[] {
		const templates = FormAssistanceMCP.getAvailableTemplates()
		const matches: TemplateMatch[] = []

		templates.forEach(template => {
			let similarity = 0

			// Check purpose match
			if (template.category.toLowerCase().includes(requirements.purpose.toLowerCase())) {
				similarity += 0.4
			}

			// Check industry match
			if (requirements.industry && template.industry === requirements.industry) {
				similarity += 0.3
			}

			// Check field count match
			const fieldCountMatch = Math.max(0, 1 - Math.abs(template.fields.length - (requirements.fields?.length || 0)) / 10)
			similarity += fieldCountMatch * 0.2

			// Check complexity match
			const complexity = requirements.complexity || 'intermediate'
			const templateComplexity = template.fields.length > 10 ? 'advanced' : template.fields.length > 5 ? 'intermediate' : 'simple'
			if (complexity === templateComplexity) {
				similarity += 0.1
			}

			if (similarity > 0.3) {
				matches.push({
					templateId: template.id,
					templateName: template.name,
					description: template.description,
					fields: template.fields,
					similarity,
					industry: template.industry,
					useCase: template.category,
				})
			}
		})

		return matches.sort((a, b) => b.similarity - a.similarity)
	}

	/**
	 * Creates a custom template based on requirements
	 */
	private static createCustomTemplate(requirements: FormRequirements): Template {
		const fields = FormAssistanceMCP.generateFieldsForPurpose(requirements.purpose, requirements.industry)
		
		return {
			id: generateId(),
			name: `${requirements.purpose.charAt(0).toUpperCase() + requirements.purpose.slice(1)} Form Template`,
			description: `A custom ${requirements.purpose} form template${requirements.industry ? ` for ${requirements.industry}` : ''}`,
			category: requirements.purpose,
			industry: requirements.industry,
			fields,
			tags: [requirements.purpose, ...(requirements.industry ? [requirements.industry] : [])],
		}
	}

	/**
	 * Calculates performance analysis for a form
	 */
	private static calculatePerformanceAnalysis(form: Form): PerformanceAnalysis {
		const fieldCount = form.fields.length
		const complexityScore = FormAssistanceMCP.calculateComplexityScore(form)
		const loadTime = FormAssistanceMCP.estimateLoadTime(form)
		const performanceScore = FormAssistanceMCP.calculatePerformanceScore(form)
		const optimizationSuggestions = FormAssistanceMCP.generatePerformanceSuggestions(form)

		return {
			loadTime,
			fieldCount,
			complexityScore,
			optimizationSuggestions,
			performanceScore,
		}
	}

	/**
	 * Generates performance improvement suggestions
	 */
	private static generatePerformanceSuggestions(form: Form): PerformanceSuggestion[] {
		const suggestions: PerformanceSuggestion[] = []

		// Lazy loading suggestion
		if (form.fields.length > 10) {
			suggestions.push({
				id: generateId(),
				type: 'lazy-loading',
				title: 'Implement Lazy Loading',
				description: 'Load fields as they become visible to improve initial load time',
				impact: 'high',
				effort: 'medium',
				estimatedImprovement: '40-60% faster initial load',
				action: 'Implement field lazy loading',
			})
		}

		// Field optimization
		const complexFields = form.fields.filter(f => ['file', 'signature', 'rich-text'].includes(f.type))
		if (complexFields.length > 2) {
			suggestions.push({
				id: generateId(),
				type: 'field-optimization',
				title: 'Optimize Complex Fields',
				description: 'Complex fields like file uploads and rich text can impact performance',
				impact: 'medium',
				effort: 'low',
				estimatedImprovement: '20-30% performance improvement',
				action: 'Add loading states and optimize field rendering',
			})
		}

		// Validation optimization
		const fieldsWithValidation = form.fields.filter(f => f.validation)
		if (fieldsWithValidation.length > 5) {
			suggestions.push({
				id: generateId(),
				type: 'validation-optimization',
				title: 'Optimize Validation',
				description: 'Consider debouncing validation to improve performance',
				impact: 'medium',
				effort: 'low',
				estimatedImprovement: '15-25% better responsiveness',
				action: 'Implement debounced validation',
			})
		}

		return suggestions
	}

	/**
	 * Calculates complexity score for a form
	 */
	private static calculateComplexityScore(form: Form): number {
		let score = 0

		// Base score from field count
		score += form.fields.length * 2

		// Add complexity for different field types
		form.fields.forEach(field => {
			switch (field.type) {
				case 'file':
				case 'signature':
					score += 5
					break
				case 'rich-text':
				case 'textarea':
					score += 3
					break
				case 'select':
				case 'radio':
				case 'checkbox':
					score += 2
					break
				default:
					score += 1
			}
		})

		return Math.min(100, score)
	}

	/**
	 * Estimates load time for a form
	 */
	private static estimateLoadTime(form: Form): number {
		let baseTime = 200 // Base load time in ms

		// Add time for each field
		baseTime += form.fields.length * 10

		// Add extra time for complex fields
		form.fields.forEach(field => {
			switch (field.type) {
				case 'file':
					baseTime += 50
					break
				case 'rich-text':
					baseTime += 30
					break
				case 'signature':
					baseTime += 40
					break
			}
		})

		return baseTime
	}

	/**
	 * Calculates overall performance score
	 */
	private static calculatePerformanceScore(form: Form): number {
		const loadTime = FormAssistanceMCP.estimateLoadTime(form)
		const complexityScore = FormAssistanceMCP.calculateComplexityScore(form)

		// Score based on load time (lower is better)
		let score = 100
		if (loadTime > 1000) score -= 30
		else if (loadTime > 500) score -= 15

		// Score based on complexity (lower is better)
		if (complexityScore > 80) score -= 25
		else if (complexityScore > 50) score -= 10

		// Score based on field count
		if (form.fields.length > 20) score -= 20
		else if (form.fields.length > 10) score -= 10

		return Math.max(0, score)
	}

	/**
	 * Gets available templates
	 */
	private static getAvailableTemplates(): Template[] {
		return [
			{
				id: 'contact-template',
				name: 'Contact Form',
				description: 'A simple contact form with name, email, and message fields',
				category: 'contact',
				fields: [
					{
						id: generateId(),
						type: 'text',
						label: 'Name',
						required: true,
						placeholder: 'Enter your full name',
					},
					{
						id: generateId(),
						type: 'email',
						label: 'Email',
						required: true,
						placeholder: 'Enter your email address',
					},
					{
						id: generateId(),
						type: 'textarea',
						label: 'Message',
						required: true,
						placeholder: 'Enter your message',
					},
				],
				tags: ['contact', 'simple', 'basic'],
			},
			{
				id: 'registration-template',
				name: 'Registration Form',
				description: 'A comprehensive registration form for events or services',
				category: 'registration',
				fields: [
					{
						id: generateId(),
						type: 'text',
						label: 'First Name',
						required: true,
						placeholder: 'Enter your first name',
					},
					{
						id: generateId(),
						type: 'text',
						label: 'Last Name',
						required: true,
						placeholder: 'Enter your last name',
					},
					{
						id: generateId(),
						type: 'email',
						label: 'Email',
						required: true,
						placeholder: 'Enter your email address',
					},
					{
						id: generateId(),
						type: 'phone',
						label: 'Phone',
						required: false,
						placeholder: 'Enter your phone number',
					},
				],
				tags: ['registration', 'event', 'signup'],
			},
			{
				id: 'survey-template',
				name: 'Survey Form',
				description: 'A survey form with rating and feedback fields',
				category: 'survey',
				fields: [
					{
						id: generateId(),
						type: 'radio',
						label: 'How satisfied are you?',
						required: true,
						options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
					},
					{
						id: generateId(),
						type: 'textarea',
						label: 'Additional Comments',
						required: false,
						placeholder: 'Share any additional thoughts...',
					},
				],
				tags: ['survey', 'feedback', 'rating'],
			},
		]
	}

	/**
	 * Generates fields for a specific purpose
	 */
	private static generateFieldsForPurpose(purpose: string, industry?: string): FormField[] {
		const baseFields: FormField[] = []

		switch (purpose.toLowerCase()) {
			case 'contact':
				baseFields.push(
					{
						id: generateId(),
						type: 'text',
						label: 'Name',
						required: true,
						placeholder: 'Enter your full name',
					},
					{
						id: generateId(),
						type: 'email',
						label: 'Email',
						required: true,
						placeholder: 'Enter your email address',
					},
					{
						id: generateId(),
						type: 'textarea',
						label: 'Message',
						required: true,
						placeholder: 'Enter your message',
					}
				)
				break

			case 'registration':
				baseFields.push(
					{
						id: generateId(),
						type: 'text',
						label: 'First Name',
						required: true,
						placeholder: 'Enter your first name',
					},
					{
						id: generateId(),
						type: 'text',
						label: 'Last Name',
						required: true,
						placeholder: 'Enter your last name',
					},
					{
						id: generateId(),
						type: 'email',
						label: 'Email',
						required: true,
						placeholder: 'Enter your email address',
					}
				)
				break

			case 'survey':
				baseFields.push(
					{
						id: generateId(),
						type: 'radio',
						label: 'How satisfied are you?',
						required: true,
						options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
					},
					{
						id: generateId(),
						type: 'textarea',
						label: 'Additional Comments',
						required: false,
						placeholder: 'Share any additional thoughts...',
					}
				)
				break

			default:
				baseFields.push(
					{
						id: generateId(),
						type: 'text',
						label: 'Name',
						required: true,
						placeholder: 'Enter your name',
					},
					{
						id: generateId(),
						type: 'email',
						label: 'Email',
						required: true,
						placeholder: 'Enter your email address',
					}
				)
		}

		return baseFields
	}
}
