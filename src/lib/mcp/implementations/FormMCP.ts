/**
 * FormMCP - Model Context Protocol implementation for Form operations
 *
 * Handles all form-related business logic including creation, validation,
 * updates, and metadata generation.
 */

import { MCPResult, ValidationResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { Form, CreateFormData, FormField, FieldType } from '@/types'
import { generateId } from '@/utils'

// New types for assistance features
export interface FormQualityAssessment {
	overall: number
	usability: number
	accessibility: number
	performance: number
	security: number
	improvements: FormImprovement[]
}

export interface FormImprovement {
	id: string
	type: 'usability' | 'accessibility' | 'performance' | 'security'
	title: string
	description: string
	impact: 'low' | 'medium' | 'high'
	effort: 'low' | 'medium' | 'high'
	action?: string
}

export interface FormPurpose {
	type:
		| 'contact'
		| 'registration'
		| 'survey'
		| 'application'
		| 'feedback'
		| 'lead-generation'
		| 'event'
		| 'other'
	confidence: number
	keywords: string[]
	suggestedFields: FormField[]
}

export interface CompletionPrediction {
	rate: number
	estimatedTime: number
	dropOffPoints: DropOffPoint[]
	confidence: number
}

export interface DropOffPoint {
	fieldId: string
	fieldLabel: string
	probability: number
	reason: string
	suggestion: string
}

export class FormMCP {
	/**
	 * Creates a new form with validation and business logic
	 */
	static createForm(data: CreateFormData, userId: string): MCPResult<Form> {
		const tracker = MCPLogger.createPerformanceTracker('createForm')

		try {
			console.log('🚀 FormMCP: Starting form creation...')
			console.log('👤 User ID:', userId)
			console.log('📝 Form title:', data.title)
			console.log('📊 Field count:', data.fields?.length || 0)

			// Validate input data
			console.log('🔍 Validating form data...')
			const validation = FormMCP.validateFormData(data)
			if (!validation.isValid) {
				console.error('❌ Form validation failed:', validation.errors)
				const result: MCPResult<Form> = {
					success: false,
					errors: validation.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'createForm',
						timestamp: new Date(),
					},
				}

				MCPLogger.log('createForm', data, result)
				return result
			}
			console.log('✅ Form validation passed')

			// Sanitize input data
			console.log('🧹 Sanitizing form data...')
			const sanitizedData = FormMCP.sanitizeFormData(data)

			// Generate form metadata
			console.log('📋 Generating form metadata...')
			const metadata = FormMCP.generateFormMetadata(userId)
			console.log('🆔 Generated form ID:', metadata.id)

			// Create form object
			console.log('🏗️ Creating form object...')
			const form: Form = {
				id: metadata.id!,
				userId: metadata.userId!,
				createdAt: metadata.createdAt!,
				updatedAt: metadata.updatedAt!,
				title: sanitizedData.title,
				description: sanitizedData.description,
				fields: sanitizedData.fields.map(field =>
					FormMCP.sanitizeFieldData(field)
				),
			}

			const result: MCPResult<Form> = {
				success: true,
				data: form,
				metadata: {
					executionTime: tracker.end(),
					operation: 'createForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('createForm', data, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Unexpected error creating form',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<Form> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'createForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('createForm', mcpError)
			return result
		}
	}

	/**
	 * Validates form data before creation or update
	 */
	static validateFormData(data: CreateFormData): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		// Validate title
		if (!data.title?.trim()) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form title is required',
				field: 'title',
				timestamp: new Date(),
			})
		} else if (data.title.length > 200) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form title must be less than 200 characters',
				field: 'title',
				details: { actual: data.title.length, expected: 200 },
				timestamp: new Date(),
			})
		}

		// Validate description
		if (data.description && data.description.length > 1000) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form description must be less than 1000 characters',
				field: 'description',
				details: { actual: data.description.length, expected: 1000 },
				timestamp: new Date(),
			})
		}

		// Validate fields
		if (!data.fields?.length) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'At least one field is required',
				field: 'fields',
				timestamp: new Date(),
			})
		} else {
			// Validate individual fields
			const fieldValidation = FormMCP.validateFields(data.fields)
			if (!fieldValidation.isValid) {
				errors.push(...fieldValidation.errors)
			}
			if (fieldValidation.warnings) {
				warnings.push(...fieldValidation.warnings)
			}

			// Check for duplicate field labels
			const labels = data.fields.map(f => f.label.toLowerCase().trim())
			const duplicates = labels.filter(
				(label, index) => labels.indexOf(label) !== index
			)
			if (duplicates.length > 0) {
				warnings.push(
					`Duplicate field labels found: ${[...new Set(duplicates)].join(', ')}`
				)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Validates an existing form structure
	 */
	static validateForm(form: Form): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		// Validate form structure
		if (!form.id) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form ID is required',
				field: 'id',
				timestamp: new Date(),
			})
		}

		if (!form.userId) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'User ID is required',
				field: 'userId',
				timestamp: new Date(),
			})
		}

		// Validate form data
		const formDataValidation = FormMCP.validateFormData({
			title: form.title,
			description: form.description,
			fields: form.fields,
		})

		if (!formDataValidation.isValid) {
			errors.push(...formDataValidation.errors)
		}
		if (formDataValidation.warnings) {
			warnings.push(...formDataValidation.warnings)
		}

		// Validate timestamps
		if (!form.createdAt || !form.updatedAt) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form timestamps are required',
				field: 'timestamps',
				timestamp: new Date(),
			})
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Updates an existing form with new data
	 */
	static updateForm(
		form: Form,
		updates: Partial<CreateFormData>
	): MCPResult<Form> {
		const tracker = MCPLogger.createPerformanceTracker('updateForm')

		try {
			// Create updated form data
			const updatedData: CreateFormData = {
				title: updates.title ?? form.title,
				description: updates.description ?? form.description,
				fields: updates.fields ?? form.fields,
			}

			// Validate updated data
			const validation = FormMCP.validateFormData(updatedData)
			if (!validation.isValid) {
				const result: MCPResult<Form> = {
					success: false,
					errors: validation.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'updateForm',
						timestamp: new Date(),
					},
				}

				MCPLogger.log('updateForm', { form, updates }, result)
				return result
			}

			// Create updated form
			const updatedForm: Form = {
				...form,
				title: updatedData.title,
				description: updatedData.description,
				fields: updatedData.fields.map(field =>
					FormMCP.sanitizeFieldData(field)
				),
				updatedAt: new Date(),
			}

			const result: MCPResult<Form> = {
				success: true,
				data: updatedForm,
				metadata: {
					executionTime: tracker.end(),
					operation: 'updateForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('updateForm', { form, updates }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Unexpected error updating form',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<Form> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'updateForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('updateForm', mcpError)
			return result
		}
	}

	/**
	 * Validates form fields configuration
	 */
	static validateFields(fields: FormField[]): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		if (!Array.isArray(fields)) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Fields must be an array',
				field: 'fields',
				timestamp: new Date(),
			})
			return { isValid: false, errors }
		}

		// Validate each field
		fields.forEach((field, index) => {
			const fieldErrors = FormMCP.validateField(field)
			if (!fieldErrors.isValid) {
				errors.push(
					...fieldErrors.errors.map(error => ({
						...error,
						field: `fields[${index}].${error.field || 'unknown'}`,
					}))
				)
			}
		})

		// Check for maximum fields limit
		if (fields.length > 50) {
			warnings.push(
				'Forms with more than 50 fields may have performance issues'
			)
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Validates individual field
	 */
	private static validateField(field: FormField): ValidationResult {
		const errors: MCPError[] = []

		// Validate required fields
		if (!field.id) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field ID is required',
				field: 'id',
				timestamp: new Date(),
			})
		}

		if (!field.label?.trim()) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field label is required',
				field: 'label',
				timestamp: new Date(),
			})
		}

		if (!field.type) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field type is required',
				field: 'type',
				timestamp: new Date(),
			})
		}

		// Validate field type
		const validTypes: FieldType[] = [
			'text',
			'email',
			'number',
			'date',
			'textarea',
			'select',
			'checkbox',
			'radio',
			'money',
			'phone',
			'address',
			'yesno',
			'file',
			'signature',
		]

		if (field.type && !validTypes.includes(field.type)) {
			errors.push({
				code: 'FIELD_ERROR',
				message: `Invalid field type: ${field.type}`,
				field: 'type',
				details: { actual: field.type, expected: validTypes },
				timestamp: new Date(),
			})
		}

		// Validate options for fields that require them
		const fieldsRequiringOptions: FieldType[] = ['select', 'radio', 'checkbox']
		if (
			fieldsRequiringOptions.includes(field.type) &&
			(!field.options || field.options.length === 0)
		) {
			errors.push({
				code: 'FIELD_ERROR',
				message: `Field type '${field.type}' requires options`,
				field: 'options',
				timestamp: new Date(),
			})
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Generates form metadata (ID, timestamps, etc.)
	 */
	static generateFormMetadata(userId: string): Partial<Form> {
		return {
			id: generateId(),
			userId: userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	}

	/**
	 * Sanitizes form data for storage
	 */
	static sanitizeFormData(data: CreateFormData): CreateFormData {
		return {
			title: data.title?.trim() || '',
			description: data.description?.trim() || undefined,
			fields: data.fields.map(field => FormMCP.sanitizeFieldData(field)),
		}
	}

	/**
	 * Sanitizes field data for storage
	 */
	private static sanitizeFieldData(field: FormField): FormField {
		return {
			...field,
			label: field.label?.trim() || '',
			placeholder: field.placeholder?.trim() || undefined,
			options:
				field.options?.map(opt => opt.trim()).filter(opt => opt.length > 0) ||
				undefined,
		}
	}

	// ===== ASSISTANCE METHODS =====

	/**
	 * Analyzes form quality and provides assessment
	 */
	static analyzeFormQuality(form: Form): MCPResult<FormQualityAssessment> {
		const tracker = MCPLogger.createPerformanceTracker('analyzeFormQuality')

		try {
			console.log('🔍 FormMCP: Analyzing form quality...')
			console.log('📝 Form ID:', form.id)
			console.log('📊 Field count:', form.fields.length)

			const assessment = FormMCP.calculateQualityScore(form)
			const improvements = FormMCP.generateImprovementSuggestions(form)

			const result: MCPResult<FormQualityAssessment> = {
				success: true,
				data: {
					...assessment,
					improvements,
				},
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeFormQuality',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('analyzeFormQuality', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'ANALYSIS_ERROR',
				message: 'Unexpected error analyzing form quality',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormQualityAssessment> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeFormQuality',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('analyzeFormQuality', mcpError)
			return result
		}
	}

	/**
	 * Suggests form improvements based on quality analysis
	 */
	static suggestFormImprovements(form: Form): MCPResult<FormImprovement[]> {
		const tracker = MCPLogger.createPerformanceTracker(
			'suggestFormImprovements'
		)

		try {
			console.log('💡 FormMCP: Generating improvement suggestions...')

			const improvements = FormMCP.generateImprovementSuggestions(form)

			const result: MCPResult<FormImprovement[]> = {
				success: true,
				data: improvements,
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestFormImprovements',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('suggestFormImprovements', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'SUGGESTION_ERROR',
				message: 'Unexpected error generating suggestions',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormImprovement[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestFormImprovements',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('suggestFormImprovements', mcpError)
			return result
		}
	}

	/**
	 * Detects form purpose based on title, description, and fields
	 */
	static detectFormPurpose(form: Form): MCPResult<FormPurpose> {
		const tracker = MCPLogger.createPerformanceTracker('detectFormPurpose')

		try {
			console.log('🎯 FormMCP: Detecting form purpose...')

			const purpose = FormMCP.analyzeFormPurpose(form)

			const result: MCPResult<FormPurpose> = {
				success: true,
				data: purpose,
				metadata: {
					executionTime: tracker.end(),
					operation: 'detectFormPurpose',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('detectFormPurpose', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'PURPOSE_ERROR',
				message: 'Unexpected error detecting form purpose',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormPurpose> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'detectFormPurpose',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('detectFormPurpose', mcpError)
			return result
		}
	}

	/**
	 * Suggests fields based on detected purpose
	 */
	static suggestPurposeBasedFields(
		purpose: FormPurpose
	): MCPResult<FormField[]> {
		const tracker = MCPLogger.createPerformanceTracker(
			'suggestPurposeBasedFields'
		)

		try {
			console.log('📋 FormMCP: Suggesting purpose-based fields...')
			console.log('🎯 Purpose type:', purpose.type)

			const suggestedFields = FormMCP.generatePurposeBasedFields(purpose)

			const result: MCPResult<FormField[]> = {
				success: true,
				data: suggestedFields,
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestPurposeBasedFields',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('suggestPurposeBasedFields', purpose, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'SUGGESTION_ERROR',
				message: 'Unexpected error suggesting purpose-based fields',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormField[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'suggestPurposeBasedFields',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('suggestPurposeBasedFields', mcpError)
			return result
		}
	}

	/**
	 * Predicts form completion rate and identifies drop-off points
	 */
	static predictCompletionRate(form: Form): MCPResult<CompletionPrediction> {
		const tracker = MCPLogger.createPerformanceTracker('predictCompletionRate')

		try {
			console.log('📊 FormMCP: Predicting completion rate...')

			const prediction = FormMCP.calculateCompletionPrediction(form)

			const result: MCPResult<CompletionPrediction> = {
				success: true,
				data: prediction,
				metadata: {
					executionTime: tracker.end(),
					operation: 'predictCompletionRate',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('predictCompletionRate', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'PREDICTION_ERROR',
				message: 'Unexpected error predicting completion rate',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<CompletionPrediction> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'predictCompletionRate',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('predictCompletionRate', mcpError)
			return result
		}
	}

	/**
	 * Identifies potential drop-off points in the form
	 */
	static identifyDropOffPoints(form: Form): MCPResult<DropOffPoint[]> {
		const tracker = MCPLogger.createPerformanceTracker('identifyDropOffPoints')

		try {
			console.log('⚠️ FormMCP: Identifying drop-off points...')

			const dropOffPoints = FormMCP.analyzeDropOffPoints(form)

			const result: MCPResult<DropOffPoint[]> = {
				success: true,
				data: dropOffPoints,
				metadata: {
					executionTime: tracker.end(),
					operation: 'identifyDropOffPoints',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('identifyDropOffPoints', form, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'ANALYSIS_ERROR',
				message: 'Unexpected error identifying drop-off points',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<DropOffPoint[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'identifyDropOffPoints',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('identifyDropOffPoints', mcpError)
			return result
		}
	}

	// ===== PRIVATE HELPER METHODS =====

	/**
	 * Calculates quality score for different dimensions
	 */
	private static calculateQualityScore(
		form: Form
	): Omit<FormQualityAssessment, 'improvements'> {
		const usability = FormMCP.calculateUsabilityScore(form)
		const accessibility = FormMCP.calculateAccessibilityScore(form)
		const performance = FormMCP.calculatePerformanceScore(form)
		const security = FormMCP.calculateSecurityScore(form)

		const overall = Math.round(
			(usability + accessibility + performance + security) / 4
		)

		return {
			overall,
			usability,
			accessibility,
			performance,
			security,
		}
	}

	/**
	 * Calculates usability score (0-100)
	 */
	private static calculateUsabilityScore(form: Form): number {
		let score = 100

		// Penalize for too many fields
		if (form.fields.length > 10) score -= 10
		if (form.fields.length > 20) score -= 15

		// Check for required fields
		const requiredFields = form.fields.filter(f => f.required)
		if (requiredFields.length > 5) score -= 10

		// Check for field labels
		const fieldsWithoutLabels = form.fields.filter(f => !f.label?.trim())
		score -= fieldsWithoutLabels.length * 5

		// Check for placeholder text
		const fieldsWithoutPlaceholders = form.fields.filter(
			f => !f.placeholder?.trim()
		)
		score -= Math.floor(fieldsWithoutPlaceholders.length * 2)

		return Math.max(0, score)
	}

	/**
	 * Calculates accessibility score (0-100)
	 */
	private static calculateAccessibilityScore(form: Form): number {
		let score = 100

		// Check for proper field labels
		const fieldsWithoutLabels = form.fields.filter(f => !f.label?.trim())
		score -= fieldsWithoutLabels.length * 10

		// Check for required field indicators
		const requiredFieldsWithoutIndicators = form.fields.filter(
			f => f.required && !f.label?.includes('*')
		)
		score -= requiredFieldsWithoutIndicators.length * 5

		// Check for field types that might need special accessibility considerations
		const complexFields = form.fields.filter(f =>
			['file', 'signature'].includes(f.type)
		)
		score -= complexFields.length * 3

		return Math.max(0, score)
	}

	/**
	 * Calculates performance score (0-100)
	 */
	private static calculatePerformanceScore(form: Form): number {
		let score = 100

		// Penalize for too many fields
		if (form.fields.length > 15) score -= 10
		if (form.fields.length > 25) score -= 20

		// Check for file upload fields (can impact performance)
		const fileFields = form.fields.filter(f => f.type === 'file')
		score -= fileFields.length * 5

		// Check for complex field types
		const complexFields = form.fields.filter(f =>
			['signature', 'textarea'].includes(f.type)
		)
		score -= complexFields.length * 2

		return Math.max(0, score)
	}

	/**
	 * Calculates security score (0-100)
	 */
	private static calculateSecurityScore(form: Form): number {
		let score = 100

		// Check for email fields (should have validation)
		const emailFields = form.fields.filter(f => f.type === 'email')
		score -= emailFields.length * 2 // Assume they need validation

		// Check for file upload fields (security risk)
		const fileFields = form.fields.filter(f => f.type === 'file')
		score -= fileFields.length * 10

		// Check for required fields (good for data integrity)
		const requiredFields = form.fields.filter(f => f.required)
		score += Math.min(requiredFields.length * 2, 10)

		return Math.max(0, Math.min(100, score))
	}

	/**
	 * Generates improvement suggestions based on quality analysis
	 */
	private static generateImprovementSuggestions(form: Form): FormImprovement[] {
		const improvements: FormImprovement[] = []

		// Usability improvements
		if (form.fields.length > 10) {
			improvements.push({
				id: 'reduce-field-count',
				type: 'usability',
				title: 'Reduce Field Count',
				description:
					'Consider reducing the number of fields to improve completion rates',
				impact: 'high',
				effort: 'medium',
				action: 'Remove non-essential fields or split into multiple steps',
			})
		}

		// Accessibility improvements
		const fieldsWithoutLabels = form.fields.filter(f => !f.label?.trim())
		if (fieldsWithoutLabels.length > 0) {
			improvements.push({
				id: 'add-field-labels',
				type: 'accessibility',
				title: 'Add Field Labels',
				description:
					'All fields should have descriptive labels for accessibility',
				impact: 'high',
				effort: 'low',
				action: 'Add clear, descriptive labels to all fields',
			})
		}

		// Performance improvements
		const fileFields = form.fields.filter(f => f.type === 'file')
		if (fileFields.length > 2) {
			improvements.push({
				id: 'optimize-file-uploads',
				type: 'performance',
				title: 'Optimize File Uploads',
				description: 'Multiple file upload fields can impact form performance',
				impact: 'medium',
				effort: 'medium',
				action: 'Consider combining file uploads or adding file size limits',
			})
		}

		// Security improvements
		const emailFields = form.fields.filter(f => f.type === 'email')
		if (emailFields.length > 0) {
			improvements.push({
				id: 'add-email-validation',
				type: 'security',
				title: 'Add Email Validation',
				description: 'Email fields should have proper validation',
				impact: 'high',
				effort: 'low',
				action: 'Add email format validation to email fields',
			})
		}

		return improvements
	}

	/**
	 * Analyzes form purpose based on title, description, and fields
	 */
	private static analyzeFormPurpose(form: Form): FormPurpose {
		const text = `${form.title} ${form.description || ''}`.toLowerCase()
		const fieldTypes = form.fields.map(f => f.type)
		// const fieldLabels = form.fields.map(f => f.label?.toLowerCase() || '')

		// Contact form detection
		if (
			text.includes('contact') ||
			text.includes('reach') ||
			text.includes('get in touch')
		) {
			return {
				type: 'contact',
				confidence: 0.9,
				keywords: ['contact', 'reach', 'touch'],
				suggestedFields: FormMCP.getContactFormFields(),
			}
		}

		// Registration form detection
		if (
			text.includes('register') ||
			text.includes('sign up') ||
			text.includes('join')
		) {
			return {
				type: 'registration',
				confidence: 0.9,
				keywords: ['register', 'sign up', 'join'],
				suggestedFields: FormMCP.getRegistrationFormFields(),
			}
		}

		// Survey form detection
		if (
			text.includes('survey') ||
			text.includes('feedback') ||
			text.includes('opinion')
		) {
			return {
				type: 'survey',
				confidence: 0.8,
				keywords: ['survey', 'feedback', 'opinion'],
				suggestedFields: FormMCP.getSurveyFormFields(),
			}
		}

		// Application form detection
		if (
			text.includes('application') ||
			text.includes('apply') ||
			text.includes('candidate')
		) {
			return {
				type: 'application',
				confidence: 0.9,
				keywords: ['application', 'apply', 'candidate'],
				suggestedFields: FormMCP.getApplicationFormFields(),
			}
		}

		// Lead generation detection
		if (fieldTypes.includes('email') && fieldTypes.includes('phone')) {
			return {
				type: 'lead-generation',
				confidence: 0.7,
				keywords: ['lead', 'contact', 'information'],
				suggestedFields: FormMCP.getLeadGenerationFields(),
			}
		}

		// Default to other
		return {
			type: 'other',
			confidence: 0.5,
			keywords: [],
			suggestedFields: [],
		}
	}

	/**
	 * Generates purpose-based field suggestions
	 */
	private static generatePurposeBasedFields(purpose: FormPurpose): FormField[] {
		return purpose.suggestedFields
	}

	/**
	 * Calculates completion prediction
	 */
	private static calculateCompletionPrediction(
		form: Form
	): CompletionPrediction {
		let baseRate = 0.8 // 80% base completion rate

		// Adjust based on field count
		if (form.fields.length > 10) baseRate -= 0.1
		if (form.fields.length > 20) baseRate -= 0.15

		// Adjust based on required fields
		const requiredFields = form.fields.filter(f => f.required)
		if (requiredFields.length > 5) baseRate -= 0.1

		// Adjust based on complex fields
		const complexFields = form.fields.filter(f =>
			['file', 'signature', 'textarea'].includes(f.type)
		)
		baseRate -= complexFields.length * 0.05

		const estimatedTime = form.fields.length * 30 // 30 seconds per field
		const dropOffPoints = FormMCP.analyzeDropOffPoints(form)

		return {
			rate: Math.max(0.1, Math.min(0.95, baseRate)),
			estimatedTime,
			dropOffPoints,
			confidence: 0.7,
		}
	}

	/**
	 * Analyzes potential drop-off points
	 */
	private static analyzeDropOffPoints(form: Form): DropOffPoint[] {
		const dropOffPoints: DropOffPoint[] = []

		form.fields.forEach((field, index) => {
			// File upload fields are common drop-off points
			if (field.type === 'file') {
				dropOffPoints.push({
					fieldId: field.id,
					fieldLabel: field.label,
					probability: 0.3,
					reason: 'File uploads can be intimidating',
					suggestion:
						'Consider making file uploads optional or providing clear instructions',
				})
			}

			// Long forms tend to have drop-offs after 10-15 fields
			if (index >= 10 && index < 15) {
				dropOffPoints.push({
					fieldId: field.id,
					fieldLabel: field.label,
					probability: 0.2,
					reason: 'Forms become less engaging after 10+ fields',
					suggestion: 'Consider splitting the form into multiple steps',
				})
			}

			// Required fields without clear indication
			if (field.required && !field.label?.includes('*')) {
				dropOffPoints.push({
					fieldId: field.id,
					fieldLabel: field.label,
					probability: 0.15,
					reason:
						'Required fields without clear indication can cause confusion',
					suggestion: 'Add asterisk (*) to required field labels',
				})
			}
		})

		return dropOffPoints
	}

	// ===== PURPOSE-BASED FIELD TEMPLATES =====

	private static getContactFormFields(): FormField[] {
		return [
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
				type: 'phone',
				label: 'Phone',
				required: false,
				placeholder: 'Enter your phone number',
			},
			{
				id: generateId(),
				type: 'textarea',
				label: 'Message',
				required: true,
				placeholder: 'Enter your message',
			},
		]
	}

	private static getRegistrationFormFields(): FormField[] {
		return [
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
		]
	}

	private static getSurveyFormFields(): FormField[] {
		return [
			{
				id: generateId(),
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
				id: generateId(),
				type: 'textarea',
				label: 'Additional Comments',
				required: false,
				placeholder: 'Share any additional thoughts...',
			},
		]
	}

	private static getApplicationFormFields(): FormField[] {
		return [
			{
				id: generateId(),
				type: 'text',
				label: 'Full Name',
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
				type: 'file',
				label: 'Resume',
				required: true,
			},
			{
				id: generateId(),
				type: 'textarea',
				label: 'Cover Letter',
				required: false,
				placeholder: "Tell us why you're interested...",
			},
		]
	}

	private static getLeadGenerationFields(): FormField[] {
		return [
			{
				id: generateId(),
				type: 'text',
				label: 'Company Name',
				required: true,
				placeholder: 'Enter your company name',
			},
			{
				id: generateId(),
				type: 'email',
				label: 'Business Email',
				required: true,
				placeholder: 'Enter your business email',
			},
			{
				id: generateId(),
				type: 'phone',
				label: 'Phone Number',
				required: true,
				placeholder: 'Enter your phone number',
			},
			{
				id: generateId(),
				type: 'select',
				label: 'Company Size',
				required: false,
				options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
			},
		]
	}
}
