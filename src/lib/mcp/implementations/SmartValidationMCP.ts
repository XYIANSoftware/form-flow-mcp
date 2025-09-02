'use client'

import { MCPResult, MCPError, MCPLogger } from '../core'

export interface ValidationRule {
	id: string
	fieldId: string
	type: ValidationType
	value?: string | number | RegExp
	message: string
	severity: ValidationSeverity
	enabled: boolean
	conditions?: ValidationCondition[]
}

export interface ValidationCondition {
	fieldId: string
	operator:
		| 'equals'
		| 'not_equals'
		| 'contains'
		| 'not_contains'
		| 'greater_than'
		| 'less_than'
		| 'is_empty'
		| 'is_not_empty'
	value: string | number
}

export interface ValidationResult {
	fieldId: string
	isValid: boolean
	errors: ValidationError[]
	warnings: ValidationWarning[]
	score: number
}

export interface ValidationError {
	ruleId: string
	message: string
	severity: ValidationSeverity
}

export interface ValidationWarning {
	ruleId: string
	message: string
	suggestion: string
}

export interface ValidationSuggestion {
	fieldId: string
	type: ValidationType
	reason: string
	confidence: number
	example: string
}

export interface FormValidationReport {
	overallScore: number
	isValid: boolean
	fieldResults: ValidationResult[]
	globalErrors: ValidationError[]
	globalWarnings: ValidationWarning[]
	suggestions: ValidationSuggestion[]
	completionRate: number
}

export interface FieldContext {
	id: string
	type: string
	label: string
	value: unknown
	required: boolean
	placeholder?: string
	options?: string[]
	previousValues?: unknown[]
	userBehavior?: UserBehaviorData
}

export interface UserBehaviorData {
	timeSpent: number
	attempts: number
	corrections: number
	helpRequests: number
}

export type ValidationType =
	| 'required'
	| 'email'
	| 'phone'
	| 'url'
	| 'minLength'
	| 'maxLength'
	| 'minValue'
	| 'maxValue'
	| 'pattern'
	| 'custom'
	| 'conditional'
	| 'crossField'
	| 'businessLogic'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export class SmartValidationMCP {
	private logger: MCPLogger
	private validationRules: Map<string, ValidationRule[]> = new Map()
	private fieldPatterns: Map<string, RegExp> = new Map()

	constructor() {
		this.logger = new MCPLogger('SmartValidationMCP')
		this.initializeFieldPatterns()
	}

	private initializeFieldPatterns(): void {
		this.fieldPatterns.set('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
		this.fieldPatterns.set('phone', /^[\+]?[1-9][\d]{0,15}$/)
		this.fieldPatterns.set(
			'url',
			/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
		)
		this.fieldPatterns.set('ssn', /^\d{3}-?\d{2}-?\d{4}$/)
		this.fieldPatterns.set(
			'creditcard',
			/^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/
		)
		this.fieldPatterns.set('zipcode', /^\d{5}(-\d{4})?$/)
		this.fieldPatterns.set(
			'password',
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		)
	}

	async validateField(
		field: FieldContext,
		rules: ValidationRule[]
	): Promise<MCPResult<ValidationResult>> {
		try {
			this.logger.log('Validating field', {
				fieldId: field.id,
				ruleCount: rules.length,
			})

			const errors: ValidationError[] = []
			const warnings: ValidationWarning[] = []
			let score = 100

			for (const rule of rules) {
				if (!rule.enabled) continue

				const ruleResult = await this.validateRule(field, rule)

				if (ruleResult.isValid === false) {
					errors.push({
						ruleId: rule.id,
						message: rule.message,
						severity: rule.severity,
					})

					score -=
						rule.severity === 'error'
							? 20
							: rule.severity === 'warning'
							? 10
							: 5
				} else if (ruleResult.suggestion) {
					warnings.push({
						ruleId: rule.id,
						message: ruleResult.suggestion,
						suggestion: ruleResult.suggestion,
					})
					score -= 5
				}
			}

			// Add smart suggestions based on field analysis
			const smartSuggestions = await this.generateSmartSuggestions(field, rules)
			for (const suggestion of smartSuggestions) {
				warnings.push({
					ruleId: `smart-${suggestion.type}`,
					message: suggestion.reason,
					suggestion: suggestion.example,
				})
			}

			const result: ValidationResult = {
				fieldId: field.id,
				isValid: errors.length === 0,
				errors,
				warnings,
				score: Math.max(score, 0),
			}

			this.logger.log('Field validation completed', {
				fieldId: field.id,
				isValid: result.isValid,
				score: result.score,
			})

			return {
				success: true,
				data: result,
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error validating field', error)
			return {
				success: false,
				error: new MCPError(
					'FIELD_VALIDATION_ERROR',
					'Failed to validate field',
					error
				),
			}
		}
	}

	async validateForm(
		fields: FieldContext[],
		rules: ValidationRule[]
	): Promise<MCPResult<FormValidationReport>> {
		try {
			this.logger.log('Validating form', {
				fieldCount: fields.length,
				ruleCount: rules.length,
			})

			const fieldResults: ValidationResult[] = []
			const globalErrors: ValidationError[] = []
			const globalWarnings: ValidationWarning[] = []
			const suggestions: ValidationSuggestion[] = []

			let totalScore = 0
			let validFields = 0

			// Validate each field
			for (const field of fields) {
				const fieldRules = rules.filter(rule => rule.fieldId === field.id)
				const fieldResult = await this.validateField(field, fieldRules)

				if (fieldResult.success) {
					fieldResults.push(fieldResult.data)
					totalScore += fieldResult.data.score
					if (fieldResult.data.isValid) validFields++
				}
			}

			// Cross-field validation
			const crossFieldResults = await this.validateCrossFieldRules(
				fields,
				rules
			)
			globalErrors.push(...crossFieldResults.errors)
			globalWarnings.push(...crossFieldResults.warnings)

			// Business logic validation
			const businessLogicResults = await this.validateBusinessLogic(
				fields,
				rules
			)
			globalErrors.push(...businessLogicResults.errors)
			globalWarnings.push(...businessLogicResults.warnings)

			// Generate form-level suggestions
			const formSuggestions = await this.generateFormSuggestions(fields, rules)
			suggestions.push(...formSuggestions)

			const overallScore =
				fieldResults.length > 0 ? totalScore / fieldResults.length : 0
			const completionRate =
				fields.length > 0 ? (validFields / fields.length) * 100 : 0

			const report: FormValidationReport = {
				overallScore,
				isValid:
					globalErrors.length === 0 && fieldResults.every(r => r.isValid),
				fieldResults,
				globalErrors,
				globalWarnings,
				suggestions,
				completionRate,
			}

			this.logger.log('Form validation completed', {
				overallScore,
				isValid: report.isValid,
				completionRate,
			})

			return {
				success: true,
				data: report,
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error validating form', error)
			return {
				success: false,
				error: new MCPError(
					'FORM_VALIDATION_ERROR',
					'Failed to validate form',
					error
				),
			}
		}
	}

	async suggestValidationRules(
		field: FieldContext
	): Promise<MCPResult<ValidationSuggestion[]>> {
		try {
			this.logger.log('Suggesting validation rules', {
				fieldId: field.id,
				fieldType: field.type,
			})

			const suggestions: ValidationSuggestion[] = []

			// Basic field type suggestions
			const typeSuggestions = this.getTypeBasedSuggestions(field)
			suggestions.push(...typeSuggestions)

			// Pattern-based suggestions
			const patternSuggestions = this.getPatternBasedSuggestions(field)
			suggestions.push(...patternSuggestions)

			// Context-based suggestions
			const contextSuggestions = this.getContextBasedSuggestions(field)
			suggestions.push(...contextSuggestions)

			// User behavior-based suggestions
			if (field.userBehavior) {
				const behaviorSuggestions = this.getBehaviorBasedSuggestions(field)
				suggestions.push(...behaviorSuggestions)
			}

			// Sort by confidence
			suggestions.sort((a, b) => b.confidence - a.confidence)

			this.logger.log('Validation suggestions generated', {
				fieldId: field.id,
				count: suggestions.length,
			})

			return {
				success: true,
				data: suggestions.slice(0, 5), // Return top 5 suggestions
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error suggesting validation rules', error)
			return {
				success: false,
				error: new MCPError(
					'VALIDATION_SUGGESTION_ERROR',
					'Failed to suggest validation rules',
					error
				),
			}
		}
	}

	async optimizeValidationRules(
		rules: ValidationRule[],
		fields: FieldContext[]
	): Promise<MCPResult<ValidationRule[]>> {
		try {
			this.logger.log('Optimizing validation rules', {
				ruleCount: rules.length,
				fieldCount: fields.length,
			})

			const optimizedRules: ValidationRule[] = []

			for (const rule of rules) {
				// Check if rule is still relevant
				const field = fields.find(f => f.id === rule.fieldId)
				if (!field) continue

				// Optimize rule based on field context
				const optimizedRule = await this.optimizeRule(rule, field)
				optimizedRules.push(optimizedRule)
			}

			// Add missing essential rules
			const missingRules = await this.identifyMissingRules(
				fields,
				optimizedRules
			)
			optimizedRules.push(...missingRules)

			// Remove redundant rules
			const deduplicatedRules = this.removeRedundantRules(optimizedRules)

			this.logger.log('Validation rules optimized', {
				originalCount: rules.length,
				optimizedCount: deduplicatedRules.length,
			})

			return {
				success: true,
				data: deduplicatedRules,
				executionTime: Date.now(),
			}
		} catch (error) {
			this.logger.error('Error optimizing validation rules', error)
			return {
				success: false,
				error: new MCPError(
					'VALIDATION_OPTIMIZATION_ERROR',
					'Failed to optimize validation rules',
					error
				),
			}
		}
	}

	private async validateRule(
		field: FieldContext,
		rule: ValidationRule
	): Promise<{ isValid: boolean; suggestion?: string }> {
		const value = field.value

		// Check conditions first
		if (rule.conditions && !this.evaluateConditions(rule.conditions, field)) {
			return { isValid: true }
		}

		switch (rule.type) {
			case 'required':
				return this.validateRequired(value, rule)
			case 'email':
				return this.validateEmail(value, rule)
			case 'phone':
				return this.validatePhone(value, rule)
			case 'url':
				return this.validateUrl(value, rule)
			case 'minLength':
				return this.validateMinLength(value, rule)
			case 'maxLength':
				return this.validateMaxLength(value, rule)
			case 'minValue':
				return this.validateMinValue(value, rule)
			case 'maxValue':
				return this.validateMaxValue(value, rule)
			case 'pattern':
				return this.validatePattern(value, rule)
			case 'custom':
				return this.validateCustom(value, rule)
			default:
				return { isValid: true }
		}
	}

	private validateRequired(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		const isValid = value !== null && value !== undefined && value !== ''
		return { isValid }
	}

	private validateEmail(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const pattern = this.fieldPatterns.get('email')
		const isValid = pattern ? pattern.test(value) : false
		return { isValid }
	}

	private validatePhone(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const pattern = this.fieldPatterns.get('phone')
		const isValid = pattern ? pattern.test(value.replace(/\D/g, '')) : false
		return { isValid }
	}

	private validateUrl(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const pattern = this.fieldPatterns.get('url')
		const isValid = pattern ? pattern.test(value) : false
		return { isValid }
	}

	private validateMinLength(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const minLength = typeof rule.value === 'number' ? rule.value : 0
		const isValid = value.length >= minLength
		return { isValid }
	}

	private validateMaxLength(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const maxLength = typeof rule.value === 'number' ? rule.value : Infinity
		const isValid = value.length <= maxLength
		return { isValid }
	}

	private validateMinValue(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		const numValue =
			typeof value === 'string'
				? parseFloat(value)
				: typeof value === 'number'
				? value
				: NaN
		if (isNaN(numValue)) return { isValid: false }
		const minValue = typeof rule.value === 'number' ? rule.value : 0
		const isValid = numValue >= minValue
		return { isValid }
	}

	private validateMaxValue(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		const numValue =
			typeof value === 'string'
				? parseFloat(value)
				: typeof value === 'number'
				? value
				: NaN
		if (isNaN(numValue)) return { isValid: false }
		const maxValue = typeof rule.value === 'number' ? rule.value : Infinity
		const isValid = numValue <= maxValue
		return { isValid }
	}

	private validatePattern(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		if (typeof value !== 'string') return { isValid: false }
		const pattern =
			rule.value instanceof RegExp
				? rule.value
				: new RegExp(rule.value as string)
		const isValid = pattern.test(value)
		return { isValid }
	}

	private validateCustom(
		value: unknown,
		rule: ValidationRule
	): { isValid: boolean; suggestion?: string } {
		// Custom validation logic would be implemented here
		// For now, return true as placeholder
		return { isValid: true }
	}

	private evaluateConditions(
		conditions: ValidationCondition[],
		field: FieldContext
	): boolean {
		// This would need access to other field values
		// For now, return true as placeholder
		return true
	}

	private async validateCrossFieldRules(
		fields: FieldContext[],
		rules: ValidationRule[]
	): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
		const errors: ValidationError[] = []
		const warnings: ValidationWarning[] = []

		// Find cross-field rules
		const crossFieldRules = rules.filter(rule => rule.type === 'crossField')

		for (const rule of crossFieldRules) {
			// Implement cross-field validation logic
			// This would check relationships between fields
		}

		return { errors, warnings }
	}

	private async validateBusinessLogic(
		fields: FieldContext[],
		rules: ValidationRule[]
	): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
		const errors: ValidationError[] = []
		const warnings: ValidationWarning[] = []

		// Find business logic rules
		const businessRules = rules.filter(rule => rule.type === 'businessLogic')

		for (const rule of businessRules) {
			// Implement business logic validation
			// This would check domain-specific rules
		}

		return { errors, warnings }
	}

	private async generateSmartSuggestions(
		field: FieldContext,
		rules: ValidationRule[]
	): Promise<ValidationSuggestion[]> {
		const suggestions: ValidationSuggestion[] = []

		// Analyze field value patterns
		if (field.value && typeof field.value === 'string') {
			const value = field.value

			// Check if it looks like an email but isn't validated as one
			if (value.includes('@') && !rules.some(r => r.type === 'email')) {
				suggestions.push({
					fieldId: field.id,
					type: 'email',
					reason: 'Value appears to be an email address',
					confidence: 0.8,
					example: 'Add email validation rule',
				})
			}

			// Check if it looks like a phone number
			if (
				/^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(value) &&
				!rules.some(r => r.type === 'phone')
			) {
				suggestions.push({
					fieldId: field.id,
					type: 'phone',
					reason: 'Value appears to be a phone number',
					confidence: 0.7,
					example: 'Add phone validation rule',
				})
			}
		}

		return suggestions
	}

	private async generateFormSuggestions(
		fields: FieldContext[],
		rules: ValidationRule[]
	): Promise<ValidationSuggestion[]> {
		const suggestions: ValidationSuggestion[] = []

		// Check for missing required field validations
		for (const field of fields) {
			if (
				field.required &&
				!rules.some(r => r.fieldId === field.id && r.type === 'required')
			) {
				suggestions.push({
					fieldId: field.id,
					type: 'required',
					reason: 'Required field missing validation',
					confidence: 1.0,
					example: 'Add required validation rule',
				})
			}
		}

		return suggestions
	}

	private getTypeBasedSuggestions(field: FieldContext): ValidationSuggestion[] {
		const suggestions: ValidationSuggestion[] = []

		switch (field.type) {
			case 'email':
				suggestions.push({
					fieldId: field.id,
					type: 'email',
					reason: 'Email field should have email validation',
					confidence: 1.0,
					example: 'Add email format validation',
				})
				break
			case 'phone':
				suggestions.push({
					fieldId: field.id,
					type: 'phone',
					reason: 'Phone field should have phone validation',
					confidence: 1.0,
					example: 'Add phone format validation',
				})
				break
			case 'url':
				suggestions.push({
					fieldId: field.id,
					type: 'url',
					reason: 'URL field should have URL validation',
					confidence: 1.0,
					example: 'Add URL format validation',
				})
				break
			case 'password':
				suggestions.push({
					fieldId: field.id,
					type: 'pattern',
					reason: 'Password should have strength validation',
					confidence: 0.9,
					example: 'Add password strength pattern',
				})
				break
		}

		return suggestions
	}

	private getPatternBasedSuggestions(
		field: FieldContext
	): ValidationSuggestion[] {
		const suggestions: ValidationSuggestion[] = []

		if (field.label.toLowerCase().includes('email') && field.type !== 'email') {
			suggestions.push({
				fieldId: field.id,
				type: 'email',
				reason: 'Field label suggests email format',
				confidence: 0.8,
				example: 'Add email validation',
			})
		}

		if (field.label.toLowerCase().includes('phone') && field.type !== 'phone') {
			suggestions.push({
				fieldId: field.id,
				type: 'phone',
				reason: 'Field label suggests phone format',
				confidence: 0.8,
				example: 'Add phone validation',
			})
		}

		return suggestions
	}

	private getContextBasedSuggestions(
		field: FieldContext
	): ValidationSuggestion[] {
		const suggestions: ValidationSuggestion[] = []

		// Analyze field context for suggestions
		if (field.required && !field.placeholder) {
			suggestions.push({
				fieldId: field.id,
				type: 'required',
				reason: 'Required field should have clear placeholder',
				confidence: 0.6,
				example: 'Add helpful placeholder text',
			})
		}

		return suggestions
	}

	private getBehaviorBasedSuggestions(
		field: FieldContext
	): ValidationSuggestion[] {
		const suggestions: ValidationSuggestion[] = []

		if (!field.userBehavior) return suggestions

		const { timeSpent, attempts, corrections, helpRequests } =
			field.userBehavior

		// High correction rate suggests validation issues
		if (corrections > attempts * 0.3) {
			suggestions.push({
				fieldId: field.id,
				type: 'pattern',
				reason: 'High correction rate suggests unclear validation',
				confidence: 0.7,
				example: 'Add clearer validation rules or help text',
			})
		}

		// High help requests suggest complexity
		if (helpRequests > 2) {
			suggestions.push({
				fieldId: field.id,
				type: 'custom',
				reason: 'High help requests suggest field complexity',
				confidence: 0.6,
				example: 'Simplify field or add better guidance',
			})
		}

		return suggestions
	}

	private async optimizeRule(
		rule: ValidationRule,
		field: FieldContext
	): Promise<ValidationRule> {
		// Optimize rule based on field context
		const optimizedRule = { ...rule }

		// Adjust validation values based on field type and context
		if (rule.type === 'minLength' && field.type === 'password') {
			optimizedRule.value = 8 // Minimum password length
		}

		if (rule.type === 'maxLength' && field.type === 'textarea') {
			optimizedRule.value = 1000 // Reasonable textarea limit
		}

		return optimizedRule
	}

	private async identifyMissingRules(
		fields: FieldContext[],
		rules: ValidationRule[]
	): Promise<ValidationRule[]> {
		const missingRules: ValidationRule[] = []

		for (const field of fields) {
			const fieldRules = rules.filter(r => r.fieldId === field.id)

			// Add required validation for required fields
			if (field.required && !fieldRules.some(r => r.type === 'required')) {
				missingRules.push({
					id: `required-${field.id}`,
					fieldId: field.id,
					type: 'required',
					message: `${field.label} is required`,
					severity: 'error',
					enabled: true,
				})
			}

			// Add type-specific validations
			if (field.type === 'email' && !fieldRules.some(r => r.type === 'email')) {
				missingRules.push({
					id: `email-${field.id}`,
					fieldId: field.id,
					type: 'email',
					message: 'Please enter a valid email address',
					severity: 'error',
					enabled: true,
				})
			}
		}

		return missingRules
	}

	private removeRedundantRules(rules: ValidationRule[]): ValidationRule[] {
		const uniqueRules: ValidationRule[] = []

		for (const rule of rules) {
			const isDuplicate = uniqueRules.some(
				existing =>
					existing.fieldId === rule.fieldId &&
					existing.type === rule.type &&
					existing.value === rule.value
			)

			if (!isDuplicate) {
				uniqueRules.push(rule)
			}
		}

		return uniqueRules
	}
}
