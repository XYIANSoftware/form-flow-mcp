import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FormField } from '@/types'
// import { Form } from '@/types'

export interface FormTemplate {
	id: string
	name: string
	description: string
	category: string
	industry: string
	fields: FormField[]
	layout: string
	validationRules: ValidationRule[]
	estimatedCompletionTime: number
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	tags: string[]
	popularity: number
	lastUpdated: Date
}

export interface FormField {
	id: string
	type: string
	label: string
	required: boolean
	placeholder?: string
	options?: string[]
	validation?: ValidationRule[]
}

export interface ValidationRule {
	fieldId: string
	type:
		| 'required'
		| 'email'
		| 'phone'
		| 'minLength'
		| 'maxLength'
		| 'pattern'
		| 'custom'
	value?: string | number
	message: string
	severity: 'error' | 'warning' | 'info'
}

export interface TemplateMatch {
	template: FormTemplate
	score: number
	reasons: string[]
	confidence: 'low' | 'medium' | 'high'
}

export interface TemplateSuggestion {
	template: FormTemplate
	reason: string
	modifications: TemplateModification[]
}

export interface TemplateModification {
	type: 'add_field' | 'remove_field' | 'modify_field' | 'change_layout'
	fieldId?: string
	fieldType?: string
	description: string
	impact: 'low' | 'medium' | 'high'
}

export interface FormContext {
	purpose: string
	industry: string
	audience: string
	complexity: 'simple' | 'moderate' | 'complex'
	fields: FormField[]
	requirements: string[]
}

export class TemplateIntelligenceMCP {
	private logger: MCPLogger
	private templates: FormTemplate[] = []

	constructor() {
		this.logger = new MCPLogger('TemplateIntelligenceMCP')
		this.initializeTemplates()
	}

	private initializeTemplates(): void {
		this.templates = [
			{
				id: 'contact-form',
				name: 'Contact Form',
				description: 'Basic contact form with name, email, and message fields',
				category: 'communication',
				industry: 'general',
				fields: [
					{ id: 'name', type: 'text', label: 'Full Name', required: true },
					{
						id: 'email',
						type: 'email',
						label: 'Email Address',
						required: true,
					},
					{
						id: 'phone',
						type: 'phone',
						label: 'Phone Number',
						required: false,
					},
					{ id: 'message', type: 'textarea', label: 'Message', required: true },
				],
				layout: 'vertical',
				validationRules: [
					{
						fieldId: 'name',
						type: 'required',
						message: 'Name is required',
						severity: 'error',
					},
					{
						fieldId: 'email',
						type: 'email',
						message: 'Please enter a valid email',
						severity: 'error',
					},
					{
						fieldId: 'message',
						type: 'required',
						message: 'Message is required',
						severity: 'error',
					},
				],
				estimatedCompletionTime: 2,
				difficulty: 'beginner',
				tags: ['contact', 'communication', 'basic'],
				popularity: 95,
				lastUpdated: new Date(),
			},
			{
				id: 'registration-form',
				name: 'User Registration',
				description: 'Complete user registration form with validation',
				category: 'authentication',
				industry: 'general',
				fields: [
					{
						id: 'firstName',
						type: 'text',
						label: 'First Name',
						required: true,
					},
					{ id: 'lastName', type: 'text', label: 'Last Name', required: true },
					{
						id: 'email',
						type: 'email',
						label: 'Email Address',
						required: true,
					},
					{
						id: 'password',
						type: 'password',
						label: 'Password',
						required: true,
					},
					{
						id: 'confirmPassword',
						type: 'password',
						label: 'Confirm Password',
						required: true,
					},
					{
						id: 'terms',
						type: 'checkbox',
						label: 'I agree to the terms and conditions',
						required: true,
					},
				],
				layout: 'vertical',
				validationRules: [
					{
						fieldId: 'firstName',
						type: 'required',
						message: 'First name is required',
						severity: 'error',
					},
					{
						fieldId: 'lastName',
						type: 'required',
						message: 'Last name is required',
						severity: 'error',
					},
					{
						fieldId: 'email',
						type: 'email',
						message: 'Please enter a valid email',
						severity: 'error',
					},
					{
						fieldId: 'password',
						type: 'minLength',
						value: 8,
						message: 'Password must be at least 8 characters',
						severity: 'error',
					},
					{
						fieldId: 'confirmPassword',
						type: 'custom',
						message: 'Passwords must match',
						severity: 'error',
					},
					{
						fieldId: 'terms',
						type: 'required',
						message: 'You must agree to the terms',
						severity: 'error',
					},
				],
				estimatedCompletionTime: 5,
				difficulty: 'intermediate',
				tags: ['registration', 'authentication', 'user'],
				popularity: 88,
				lastUpdated: new Date(),
			},
			{
				id: 'survey-form',
				name: 'Customer Survey',
				description: 'Comprehensive customer feedback survey',
				category: 'feedback',
				industry: 'general',
				fields: [
					{
						id: 'satisfaction',
						type: 'radio',
						label: 'How satisfied are you?',
						required: true,
						options: [
							'Very Satisfied',
							'Satisfied',
							'Neutral',
							'Dissatisfied',
							'Very Dissatisfied',
						],
					},
					{
						id: 'recommend',
						type: 'radio',
						label: 'Would you recommend us?',
						required: true,
						options: ['Yes', 'No', 'Maybe'],
					},
					{
						id: 'improvements',
						type: 'textarea',
						label: 'What can we improve?',
						required: false,
					},
					{
						id: 'contact',
						type: 'checkbox',
						label: 'Contact me for follow-up',
						required: false,
					},
				],
				layout: 'vertical',
				validationRules: [
					{
						fieldId: 'satisfaction',
						type: 'required',
						message: 'Please select your satisfaction level',
						severity: 'error',
					},
					{
						fieldId: 'recommend',
						type: 'required',
						message: 'Please select if you would recommend us',
						severity: 'error',
					},
				],
				estimatedCompletionTime: 3,
				difficulty: 'beginner',
				tags: ['survey', 'feedback', 'customer'],
				popularity: 72,
				lastUpdated: new Date(),
			},
			{
				id: 'job-application',
				name: 'Job Application',
				description: 'Professional job application form',
				category: 'employment',
				industry: 'hr',
				fields: [
					{
						id: 'personalInfo',
						type: 'section',
						label: 'Personal Information',
						required: false,
					},
					{
						id: 'firstName',
						type: 'text',
						label: 'First Name',
						required: true,
					},
					{ id: 'lastName', type: 'text', label: 'Last Name', required: true },
					{
						id: 'email',
						type: 'email',
						label: 'Email Address',
						required: true,
					},
					{ id: 'phone', type: 'phone', label: 'Phone Number', required: true },
					{
						id: 'resume',
						type: 'file',
						label: 'Upload Resume',
						required: true,
					},
					{
						id: 'coverLetter',
						type: 'textarea',
						label: 'Cover Letter',
						required: false,
					},
					{
						id: 'experience',
						type: 'textarea',
						label: 'Relevant Experience',
						required: true,
					},
				],
				layout: 'sections',
				validationRules: [
					{
						fieldId: 'firstName',
						type: 'required',
						message: 'First name is required',
						severity: 'error',
					},
					{
						fieldId: 'lastName',
						type: 'required',
						message: 'Last name is required',
						severity: 'error',
					},
					{
						fieldId: 'email',
						type: 'email',
						message: 'Please enter a valid email',
						severity: 'error',
					},
					{
						fieldId: 'phone',
						type: 'phone',
						message: 'Please enter a valid phone number',
						severity: 'error',
					},
					{
						fieldId: 'resume',
						type: 'required',
						message: 'Resume is required',
						severity: 'error',
					},
					{
						fieldId: 'experience',
						type: 'required',
						message: 'Please describe your relevant experience',
						severity: 'error',
					},
				],
				estimatedCompletionTime: 10,
				difficulty: 'advanced',
				tags: ['job', 'application', 'employment', 'hr'],
				popularity: 65,
				lastUpdated: new Date(),
			},
		]
	}

	async findMatchingTemplates(
		context: FormContext
	): Promise<MCPResult<TemplateMatch[]>> {
		try {
			this.logger.log('Finding matching templates', { context })

			const matches: TemplateMatch[] = []

			for (const template of this.templates) {
				const score = this.calculateTemplateScore(template, context)
				if (score > 0.3) {
					// Only include templates with reasonable match
					const reasons = this.generateMatchReasons(template, context)
					const confidence = this.determineConfidence(score)

					matches.push({
						template,
						score,
						reasons,
						confidence,
					})
				}
			}

			// Sort by score descending
			matches.sort((a, b) => b.score - a.score)

			this.logger.log('Template matches found', { count: matches.length })

			return {
				success: true,
				data: matches.slice(0, 5), // Return top 5 matches
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error finding matching templates', error)
			return {
				success: false,
				error: new MCPError(
					'TEMPLATE_MATCH_ERROR',
					'Failed to find matching templates',
					error
				),
			}
		}
	}

	async generateCustomTemplate(
		context: FormContext
	): Promise<MCPResult<FormTemplate>> {
		try {
			this.logger.log('Generating custom template', { context })

			const template: FormTemplate = {
				id: `custom-${Date.now()}`,
				name: this.generateTemplateName(context),
				description: this.generateTemplateDescription(context),
				category: this.determineCategory(context),
				industry: context.industry,
				fields: this.generateFieldsForContext(context),
				layout: this.determineOptimalLayout(context),
				validationRules: this.generateValidationRules(context),
				estimatedCompletionTime: this.estimateCompletionTime(context),
				difficulty: this.determineDifficulty(context),
				tags: this.generateTags(context),
				popularity: 0,
				lastUpdated: new Date(),
			}

			this.logger.log('Custom template generated', { templateId: template.id })

			return {
				success: true,
				data: template,
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error generating custom template', error)
			return {
				success: false,
				error: new MCPError(
					'TEMPLATE_GENERATION_ERROR',
					'Failed to generate custom template',
					error
				),
			}
		}
	}

	async suggestTemplateImprovements(
		template: FormTemplate,
		context: FormContext
	): Promise<MCPResult<TemplateSuggestion[]>> {
		try {
			this.logger.log('Suggesting template improvements', {
				templateId: template.id,
				context,
			})

			const suggestions: TemplateSuggestion[] = []

			// Analyze field completeness
			const missingFields = this.identifyMissingFields(template, context)
			if (missingFields.length > 0) {
				suggestions.push({
					template,
					reason: 'Missing essential fields for this use case',
					modifications: missingFields.map(field => ({
						type: 'add_field',
						fieldType: field.type,
						description: `Add ${field.label} field`,
						impact: 'medium' as const,
					})),
				})
			}

			// Analyze validation completeness
			const missingValidation = this.identifyMissingValidation(
				template,
				context
			)
			if (missingValidation.length > 0) {
				suggestions.push({
					template,
					reason: 'Missing validation rules',
					modifications: missingValidation.map(rule => ({
						type: 'modify_field',
						fieldId: rule.fieldId,
						description: `Add ${rule.type} validation`,
						impact: 'high' as const,
					})),
				})
			}

			// Analyze layout optimization
			const layoutSuggestion = this.analyzeLayoutOptimization(template, context)
			if (layoutSuggestion) {
				suggestions.push(layoutSuggestion)
			}

			this.logger.log('Template improvements suggested', {
				count: suggestions.length,
			})

			return {
				success: true,
				data: suggestions,
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error suggesting template improvements', error)
			return {
				success: false,
				error: new MCPError(
					'TEMPLATE_IMPROVEMENT_ERROR',
					'Failed to suggest template improvements',
					error
				),
			}
		}
	}

	async getTemplateRecommendations(
		currentFields: FormField[],
		context: FormContext
	): Promise<MCPResult<TemplateSuggestion[]>> {
		try {
			this.logger.log('Getting template recommendations', {
				fieldCount: currentFields.length,
				context,
			})

			const recommendations: TemplateSuggestion[] = []

			// Find templates that could enhance current form
			for (const template of this.templates) {
				const enhancements = this.findEnhancementOpportunities(
					template,
					currentFields,
					context
				)
				if (enhancements.length > 0) {
					recommendations.push({
						template,
						reason: 'Could enhance your current form',
						modifications: enhancements,
					})
				}
			}

			// Sort by relevance
			recommendations.sort(
				(a, b) => b.modifications.length - a.modifications.length
			)

			this.logger.log('Template recommendations generated', {
				count: recommendations.length,
			})

			return {
				success: true,
				data: recommendations.slice(0, 3), // Return top 3 recommendations
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error getting template recommendations', error)
			return {
				success: false,
				error: new MCPError(
					'TEMPLATE_RECOMMENDATION_ERROR',
					'Failed to get template recommendations',
					error
				),
			}
		}
	}

	private calculateTemplateScore(
		template: FormTemplate,
		context: FormContext
	): number {
		let score = 0

		// Industry match
		if (
			template.industry === context.industry ||
			template.industry === 'general'
		) {
			score += 0.3
		}

		// Category match
		const categoryMatch = this.getCategoryMatch(
			template.category,
			context.purpose
		)
		score += categoryMatch * 0.4

		// Field similarity
		const fieldSimilarity = this.calculateFieldSimilarity(
			template.fields,
			context.fields
		)
		score += fieldSimilarity * 0.2

		// Complexity match
		const complexityMatch = this.getComplexityMatch(
			template.difficulty,
			context.complexity
		)
		score += complexityMatch * 0.1

		return Math.min(score, 1.0)
	}

	private generateMatchReasons(
		template: FormTemplate,
		context: FormContext
	): string[] {
		const reasons: string[] = []

		if (template.industry === context.industry) {
			reasons.push(`Perfect match for ${context.industry} industry`)
		}

		if (template.difficulty === context.complexity) {
			reasons.push(`Appropriate complexity level`)
		}

		const fieldOverlap = this.calculateFieldOverlap(
			template.fields,
			context.fields
		)
		if (fieldOverlap > 0.5) {
			reasons.push(`High field similarity (${Math.round(fieldOverlap * 100)}%)`)
		}

		if (template.popularity > 80) {
			reasons.push('Popular and well-tested template')
		}

		return reasons
	}

	private determineConfidence(score: number): 'low' | 'medium' | 'high' {
		if (score >= 0.8) return 'high'
		if (score >= 0.5) return 'medium'
		return 'low'
	}

	private generateTemplateName(context: FormContext): string {
		const purpose = context.purpose.toLowerCase()
		const industry = context.industry.toLowerCase()

		if (purpose.includes('contact')) return 'Contact Form'
		if (purpose.includes('registration')) return 'Registration Form'
		if (purpose.includes('survey')) return 'Survey Form'
		if (purpose.includes('application')) return 'Application Form'
		if (purpose.includes('feedback')) return 'Feedback Form'

		return `${industry.charAt(0).toUpperCase() + industry.slice(1)} Form`
	}

	private generateTemplateDescription(context: FormContext): string {
		return `Custom ${context.purpose} form for ${context.industry} industry, designed for ${context.audience}`
	}

	private determineCategory(context: FormContext): string {
		const purpose = context.purpose.toLowerCase()

		if (purpose.includes('contact')) return 'communication'
		if (purpose.includes('registration') || purpose.includes('signup'))
			return 'authentication'
		if (purpose.includes('survey') || purpose.includes('feedback'))
			return 'feedback'
		if (purpose.includes('application')) return 'employment'
		if (purpose.includes('order') || purpose.includes('purchase'))
			return 'ecommerce'

		return 'general'
	}

	private generateFieldsForContext(context: FormContext): FormField[] {
		const fields: FormField[] = []
		const purpose = context.purpose.toLowerCase()

		// Common fields
		if (purpose.includes('contact') || purpose.includes('registration')) {
			fields.push({
				id: 'name',
				type: 'text',
				label: 'Full Name',
				required: true,
			})
			fields.push({
				id: 'email',
				type: 'email',
				label: 'Email Address',
				required: true,
			})
		}

		if (purpose.includes('contact')) {
			fields.push({
				id: 'phone',
				type: 'phone',
				label: 'Phone Number',
				required: false,
			})
			fields.push({
				id: 'message',
				type: 'textarea',
				label: 'Message',
				required: true,
			})
		}

		if (purpose.includes('registration')) {
			fields.push({
				id: 'password',
				type: 'password',
				label: 'Password',
				required: true,
			})
			fields.push({
				id: 'confirmPassword',
				type: 'password',
				label: 'Confirm Password',
				required: true,
			})
		}

		if (purpose.includes('survey')) {
			fields.push({
				id: 'satisfaction',
				type: 'radio',
				label: 'How satisfied are you?',
				required: true,
				options: [
					'Very Satisfied',
					'Satisfied',
					'Neutral',
					'Dissatisfied',
					'Very Dissatisfied',
				],
			})
			fields.push({
				id: 'feedback',
				type: 'textarea',
				label: 'Additional Feedback',
				required: false,
			})
		}

		return fields
	}

	private determineOptimalLayout(context: FormContext): string {
		if (context.complexity === 'complex') return 'sections'
		if (context.fields.length > 8) return 'multi-column'
		return 'vertical'
	}

	private generateValidationRules(context: FormContext): ValidationRule[] {
		const rules: ValidationRule[] = []
		const purpose = context.purpose.toLowerCase()

		if (purpose.includes('contact') || purpose.includes('registration')) {
			rules.push({
				fieldId: 'name',
				type: 'required',
				message: 'Name is required',
				severity: 'error',
			})
			rules.push({
				fieldId: 'email',
				type: 'email',
				message: 'Please enter a valid email',
				severity: 'error',
			})
		}

		if (purpose.includes('registration')) {
			rules.push({
				fieldId: 'password',
				type: 'minLength',
				value: 8,
				message: 'Password must be at least 8 characters',
				severity: 'error',
			})
		}

		return rules
	}

	private estimateCompletionTime(context: FormContext): number {
		let baseTime = 2

		if (context.complexity === 'moderate') baseTime = 5
		if (context.complexity === 'complex') baseTime = 10

		baseTime += context.fields.length * 0.5

		return Math.round(baseTime)
	}

	private determineDifficulty(
		context: FormContext
	): 'beginner' | 'intermediate' | 'advanced' {
		if (context.complexity === 'simple') return 'beginner'
		if (context.complexity === 'moderate') return 'intermediate'
		return 'advanced'
	}

	private generateTags(context: FormContext): string[] {
		const tags: string[] = []

		tags.push(context.industry)
		tags.push(context.purpose.toLowerCase())

		if (context.complexity === 'complex') tags.push('advanced')
		if (context.complexity === 'simple') tags.push('basic')

		return tags
	}

	private getCategoryMatch(templateCategory: string, purpose: string): number {
		const purposeLower = purpose.toLowerCase()

		if (
			templateCategory === 'communication' &&
			purposeLower.includes('contact')
		)
			return 1.0
		if (
			templateCategory === 'authentication' &&
			purposeLower.includes('registration')
		)
			return 1.0
		if (
			templateCategory === 'feedback' &&
			(purposeLower.includes('survey') || purposeLower.includes('feedback'))
		)
			return 1.0
		if (
			templateCategory === 'employment' &&
			purposeLower.includes('application')
		)
			return 1.0

		return 0.3 // Default partial match
	}

	private calculateFieldSimilarity(
		templateFields: FormField[],
		contextFields: FormField[]
	): number {
		if (templateFields.length === 0 && contextFields.length === 0) return 1.0
		if (templateFields.length === 0 || contextFields.length === 0) return 0.0

		let matches = 0
		for (const templateField of templateFields) {
			for (const contextField of contextFields) {
				if (
					templateField.type === contextField.type &&
					templateField.label
						.toLowerCase()
						.includes(contextField.label.toLowerCase())
				) {
					matches++
					break
				}
			}
		}

		return matches / Math.max(templateFields.length, contextFields.length)
	}

	private getComplexityMatch(
		templateDifficulty: string,
		contextComplexity: string
	): number {
		if (templateDifficulty === 'beginner' && contextComplexity === 'simple')
			return 1.0
		if (
			templateDifficulty === 'intermediate' &&
			contextComplexity === 'moderate'
		)
			return 1.0
		if (templateDifficulty === 'advanced' && contextComplexity === 'complex')
			return 1.0

		return 0.5 // Partial match for adjacent complexity levels
	}

	private calculateFieldOverlap(
		templateFields: FormField[],
		contextFields: FormField[]
	): number {
		return this.calculateFieldSimilarity(templateFields, contextFields)
	}

	private identifyMissingFields(
		template: FormTemplate,
		context: FormContext
	): FormField[] {
		const missing: FormField[] = []
		const contextFieldTypes = context.fields.map(f => f.type)

		// Check for common required fields based on context
		if (
			context.purpose.toLowerCase().includes('contact') &&
			!contextFieldTypes.includes('email')
		) {
			missing.push({
				id: 'email',
				type: 'email',
				label: 'Email Address',
				required: true,
			})
		}

		if (
			context.purpose.toLowerCase().includes('registration') &&
			!contextFieldTypes.includes('password')
		) {
			missing.push({
				id: 'password',
				type: 'password',
				label: 'Password',
				required: true,
			})
		}

		return missing
	}

	private identifyMissingValidation(
		template: FormTemplate
	): ValidationRule[] {
		const missing: ValidationRule[] = []

		// Check for basic validation rules
		for (const field of template.fields) {
			if (
				field.required &&
				!template.validationRules.some(
					rule => rule.fieldId === field.id && rule.type === 'required'
				)
			) {
				missing.push({
					fieldId: field.id,
					type: 'required',
					message: `${field.label} is required`,
					severity: 'error',
				})
			}

			if (
				field.type === 'email' &&
				!template.validationRules.some(
					rule => rule.fieldId === field.id && rule.type === 'email'
				)
			) {
				missing.push({
					fieldId: field.id,
					type: 'email',
					message: 'Please enter a valid email address',
					severity: 'error',
				})
			}
		}

		return missing
	}

	private analyzeLayoutOptimization(
		template: FormTemplate
	): TemplateSuggestion | null {
		if (template.fields.length > 10 && template.layout === 'vertical') {
			return {
				template,
				reason: 'Consider multi-column layout for better user experience',
				modifications: [
					{
						type: 'change_layout',
						description: 'Switch to multi-column layout',
						impact: 'medium',
					},
				],
			}
		}

		return null
	}

	private findEnhancementOpportunities(
		template: FormTemplate,
		currentFields: FormField[],
		context: FormContext
	): TemplateModification[] {
		const enhancements: TemplateModification[] = []

		// Find fields in template that could enhance current form
		for (const templateField of template.fields) {
			const hasSimilarField = currentFields.some(
				field =>
					field.type === templateField.type &&
					field.label.toLowerCase().includes(templateField.label.toLowerCase())
			)

			if (!hasSimilarField && this.isRelevantField(templateField, context)) {
				enhancements.push({
					type: 'add_field',
					fieldType: templateField.type,
					description: `Add ${templateField.label} field`,
					impact: 'low',
				})
			}
		}

		return enhancements
	}

	private isRelevantField(field: FormField, context: FormContext): boolean {
		const purpose = context.purpose.toLowerCase()
		const fieldLabel = field.label.toLowerCase()

		// Check if field is relevant to the form purpose
		if (
			purpose.includes('contact') &&
			(fieldLabel.includes('name') ||
				fieldLabel.includes('email') ||
				fieldLabel.includes('message'))
		) {
			return true
		}

		if (
			purpose.includes('registration') &&
			(fieldLabel.includes('password') || fieldLabel.includes('confirm'))
		) {
			return true
		}

		if (
			purpose.includes('survey') &&
			(fieldLabel.includes('satisfaction') || fieldLabel.includes('rating'))
		) {
			return true
		}

		return false
	}
}
