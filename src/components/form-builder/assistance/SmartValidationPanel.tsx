'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { TabView, TabPanel } from 'primereact/tabview'
import { ProgressBar } from 'primereact/progressbar'
import { FormField } from '@/types'
import {
	SmartValidationMCP,
	FieldContext,
	ValidationSuggestion,
	FormValidationReport,
} from '@/lib/mcp'

interface SmartValidationPanelProps {
	fields: FormField[]
	selectedField: FormField | null
	onValidationRuleAdd: (rule: any) => void
	onValidationRuleUpdate: (rule: any) => void
	className?: string
}

export default function SmartValidationPanel({
	fields,
	selectedField,
	onValidationRuleAdd,
	onValidationRuleUpdate,
	className = '',
}: SmartValidationPanelProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [validationSuggestions, setValidationSuggestions] = useState<
		ValidationSuggestion[]
	>([])
	const [validationReport, setValidationReport] =
		useState<FormValidationReport | null>(null)
	const [activeTab, setActiveTab] = useState(0)

	const validationMCP = new SmartValidationMCP()

	const analyzeValidation = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			// Convert fields to field contexts
			const fieldContexts: FieldContext[] = fields.map(field => ({
				id: field.id,
				type: field.type,
				label: field.label,
				value: field.defaultValue || '',
				required: field.required || false,
				placeholder: field.placeholder,
				options: field.options,
			}))

			// Get validation suggestions for all fields
			const allSuggestions: ValidationSuggestion[] = []
			for (const field of fieldContexts) {
				const suggestionResult = await validationMCP.suggestValidationRules(
					field
				)
				if (suggestionResult.success) {
					allSuggestions.push(...suggestionResult.data)
				}
			}
			setValidationSuggestions(allSuggestions)

			// Generate validation report
			const reportResult = await validationMCP.validateForm(fieldContexts, [])
			if (reportResult.success) {
				setValidationReport(reportResult.data)
			}
		} catch (err) {
			setError('Failed to analyze validation')
			console.error('Validation analysis error:', err)
		} finally {
			setLoading(false)
		}
	}, [fields, validationMCP])

	useEffect(() => {
		if (fields.length > 0) {
			analyzeValidation()
		}
	}, [fields, analyzeValidation])

	const handleSuggestionApply = (suggestion: ValidationSuggestion) => {
		const rule = {
			id: `rule-${Date.now()}`,
			fieldId: suggestion.fieldId,
			type: suggestion.type,
			message: suggestion.reason,
			severity: 'error',
			enabled: true,
		}
		onValidationRuleAdd(rule)
	}

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'error':
				return 'danger'
			case 'warning':
				return 'warning'
			case 'info':
				return 'info'
			default:
				return 'info'
		}
	}

	const getValidationTypeIcon = (type: string) => {
		switch (type) {
			case 'required':
				return 'pi-check-circle'
			case 'email':
				return 'pi-envelope'
			case 'phone':
				return 'pi-phone'
			case 'url':
				return 'pi-link'
			case 'minLength':
				return 'pi-align-left'
			case 'maxLength':
				return 'pi-align-left'
			case 'pattern':
				return 'pi-code'
			case 'custom':
				return 'pi-cog'
			default:
				return 'pi-shield'
		}
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-shield text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Smart Validation</h3>
					</div>
					<Button
						icon='pi pi-refresh'
						className='p-button-text p-button-sm'
						onClick={analyzeValidation}
						loading={loading}
						tooltip='Refresh Analysis'
					/>
				</div>
			</div>

			<div className='p-0'>
				{loading && (
					<div className='p-8 text-center'>
						<ProgressSpinner size='50' />
						<div className='text-sm text-gray-400 mt-2'>
							Analyzing validation...
						</div>
					</div>
				)}

				{error && (
					<div className='p-4'>
						<Message severity='error' text={error} />
					</div>
				)}

				{!loading && !error && (
					<TabView
						activeIndex={activeTab}
						onTabChange={e => setActiveTab(e.index)}
						className='smart-validation-tabs'
					>
						<TabPanel header='Validation Report' leftIcon='pi pi-chart-bar'>
							<div className='p-4 space-y-4'>
								{validationReport ? (
									<>
										<div className='grid grid-cols-2 gap-4 mb-4'>
											<div className='text-center p-3 bg-gray-800 rounded'>
												<div className='text-2xl font-bold text-white'>
													{Math.round(validationReport.overallScore)}
												</div>
												<div className='text-xs text-gray-400'>
													Overall Score
												</div>
											</div>
											<div className='text-center p-3 bg-gray-800 rounded'>
												<div className='text-2xl font-bold text-white'>
													{Math.round(validationReport.completionRate)}%
												</div>
												<div className='text-xs text-gray-400'>
													Completion Rate
												</div>
											</div>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center justify-between text-sm'>
												<span className='text-gray-300'>Form Quality</span>
												<span className='text-gray-400'>
													{validationReport.isValid
														? 'Valid'
														: 'Needs Improvement'}
												</span>
											</div>
											<ProgressBar
												value={validationReport.overallScore}
												className='w-full'
											/>
										</div>

										{validationReport.globalErrors.length > 0 && (
											<div className='space-y-2'>
												<h4 className='text-sm font-medium text-red-400'>
													Global Errors
												</h4>
												{validationReport.globalErrors.map((error, index) => (
													<div
														key={index}
														className='flex items-center gap-2 text-xs text-red-300'
													>
														<i className='pi pi-times-circle' />
														{error.message}
													</div>
												))}
											</div>
										)}

										{validationReport.globalWarnings.length > 0 && (
											<div className='space-y-2'>
												<h4 className='text-sm font-medium text-yellow-400'>
													Warnings
												</h4>
												{validationReport.globalWarnings.map(
													(warning, index) => (
														<div
															key={index}
															className='flex items-center gap-2 text-xs text-yellow-300'
														>
															<i className='pi pi-exclamation-triangle' />
															{warning.message}
														</div>
													)
												)}
											</div>
										)}
									</>
								) : (
									<div className='text-center py-8 text-gray-400'>
										<i className='pi pi-chart-bar text-2xl mb-2' />
										<div>No validation report available</div>
										<div className='text-sm'>
											Add fields to generate validation analysis
										</div>
									</div>
								)}
							</div>
						</TabPanel>

						<TabPanel header='Suggestions' leftIcon='pi pi-lightbulb'>
							<div className='p-4 space-y-4'>
								{validationSuggestions.length === 0 ? (
									<div className='text-center py-8 text-gray-400'>
										<i className='pi pi-lightbulb text-2xl mb-2' />
										<div>No validation suggestions</div>
										<div className='text-sm'>
											All fields have appropriate validation
										</div>
									</div>
								) : (
									validationSuggestions.map((suggestion, index) => (
										<ValidationSuggestionCard
											key={`${suggestion.fieldId}-${suggestion.type}-${index}`}
											suggestion={suggestion}
											onApply={() => handleSuggestionApply(suggestion)}
										/>
									))
								)}
							</div>
						</TabPanel>

						<TabPanel header='Field Analysis' leftIcon='pi pi-list'>
							<div className='p-4 space-y-4'>
								{validationReport?.fieldResults.map((result, index) => (
									<FieldValidationCard
										key={result.fieldId}
										result={result}
										field={fields.find(f => f.id === result.fieldId)}
									/>
								))}
							</div>
						</TabPanel>
					</TabView>
				)}
			</div>
		</Card>
	)
}

interface ValidationSuggestionCardProps {
	suggestion: ValidationSuggestion
	onApply: () => void
}

function ValidationSuggestionCard({
	suggestion,
	onApply,
}: ValidationSuggestionCardProps) {
	const { fieldId, type, reason, confidence, example } = suggestion

	return (
		<Card className='mb-3'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div className='flex-1'>
						<div className='flex items-center gap-2 mb-2'>
							<i
								className={`pi ${getValidationTypeIcon(type)} text-purple-400`}
							/>
							<h4 className='text-sm font-medium text-white'>
								{type} Validation
							</h4>
							<Badge
								value={`${Math.round(confidence * 100)}%`}
								severity={
									confidence > 0.8
										? 'success'
										: confidence > 0.6
										? 'warning'
										: 'info'
								}
								size='small'
							/>
						</div>
						<p className='text-xs text-gray-400 mb-2'>{reason}</p>
						<p className='text-xs text-gray-500 italic'>{example}</p>
					</div>
					<Button label='Add Rule' className='p-button-sm' onClick={onApply} />
				</div>

				<div className='flex items-center justify-between text-xs text-gray-500'>
					<span>Field: {fieldId}</span>
					<span>Confidence: {Math.round(confidence * 100)}%</span>
				</div>
			</div>
		</Card>
	)
}

interface FieldValidationCardProps {
	result: any
	field?: FormField
}

function FieldValidationCard({ result, field }: FieldValidationCardProps) {
	const { fieldId, isValid, errors, warnings, score } = result

	return (
		<Card className='mb-3'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-3'>
					<div className='flex items-center gap-2'>
						<h4 className='text-sm font-medium text-white'>
							{field?.label || fieldId}
						</h4>
						<Badge
							value={isValid ? 'Valid' : 'Invalid'}
							severity={isValid ? 'success' : 'danger'}
							size='small'
						/>
					</div>
					<div className='text-xs text-gray-400'>
						Score: {Math.round(score)}
					</div>
				</div>

				{errors.length > 0 && (
					<div className='space-y-1 mb-2'>
						{errors.map((error: any, index: number) => (
							<div
								key={index}
								className='flex items-center gap-2 text-xs text-red-300'
							>
								<i className='pi pi-times-circle' />
								{error.message}
							</div>
						))}
					</div>
				)}

				{warnings.length > 0 && (
					<div className='space-y-1'>
						{warnings.map((warning: any, index: number) => (
							<div
								key={index}
								className='flex items-center gap-2 text-xs text-yellow-300'
							>
								<i className='pi pi-exclamation-triangle' />
								{warning.message}
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}

function getValidationTypeIcon(type: string) {
	switch (type) {
		case 'required':
			return 'pi-check-circle'
		case 'email':
			return 'pi-envelope'
		case 'phone':
			return 'pi-phone'
		case 'url':
			return 'pi-link'
		case 'minLength':
			return 'pi-align-left'
		case 'maxLength':
			return 'pi-align-left'
		case 'pattern':
			return 'pi-code'
		case 'custom':
			return 'pi-cog'
		default:
			return 'pi-shield'
	}
}
