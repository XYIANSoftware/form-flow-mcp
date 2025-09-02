/**
 * SmartSuggestionsPanel - Displays intelligent field and validation suggestions
 *
 * This component provides contextual suggestions for form fields, validation rules,
 * and form improvements based on the current form state and user context.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
// import { Tooltip } from 'primereact/tooltip'
// import { FormField, FieldType } from '@/types'
import {
	FieldMCP,
	FieldSuggestion,
	FormContext,
} from '@/lib/mcp/implementations/FieldMCP'
import {
	FormAssistanceMCP,
	OptimizationSuggestion,
} from '@/lib/mcp/implementations/FormAssistanceMCP'

interface SmartSuggestionsPanelProps {
	suggestions: FieldSuggestion[]
	onSuggestionSelect: (suggestion: FieldSuggestion) => void
	context: FormContext
	className?: string
}

interface SuggestionCardProps {
	suggestion: FieldSuggestion
	onSelect: (suggestion: FieldSuggestion) => void
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
	suggestion,
	onSelect,
}) => {
	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high':
				return 'text-red-500'
			case 'medium':
				return 'text-yellow-500'
			case 'low':
				return 'text-green-500'
			default:
				return 'text-gray-500'
		}
	}

	const getImpactIcon = (impact: string) => {
		switch (impact) {
			case 'high':
				return 'pi pi-exclamation-triangle'
			case 'medium':
				return 'pi pi-info-circle'
			case 'low':
				return 'pi pi-check-circle'
			default:
				return 'pi pi-circle'
		}
	}

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.8) return 'bg-green-500'
		if (confidence >= 0.6) return 'bg-yellow-500'
		return 'bg-red-500'
	}

	return (
		<Card
			className='suggestion-card mb-3 cursor-pointer hover:shadow-md transition-shadow'
			onClick={() => onSelect(suggestion)}
		>
			<div className='flex items-start justify-between'>
				<div className='flex-1'>
					<div className='flex items-center gap-2 mb-2'>
						<h6 className='text-sm font-medium text-white m-0'>
							{suggestion.title}
						</h6>
						<Badge
							value={`${Math.round(suggestion.confidence * 100)}%`}
							severity={
								suggestion.confidence >= 0.8
									? 'success'
									: suggestion.confidence >= 0.6
									? 'warning'
									: 'danger'
							}
							size='small'
						/>
					</div>
					<p className='text-xs text-gray-400 mb-3'>{suggestion.description}</p>

					{suggestion.field && (
						<div className='bg-gray-800 rounded p-2 mb-2'>
							<div className='text-xs text-gray-300 mb-1'>Suggested Field:</div>
							<div className='flex items-center gap-2'>
								<Badge
									value={suggestion.field.type}
									severity='info'
									size='small'
								/>
								<span className='text-xs text-white'>
									{suggestion.field.label}
								</span>
								{suggestion.field.required && (
									<Badge value='Required' severity='danger' size='small' />
								)}
							</div>
						</div>
					)}

					{suggestion.validation && (
						<div className='bg-gray-800 rounded p-2 mb-2'>
							<div className='text-xs text-gray-300 mb-1'>Validation Rule:</div>
							<div className='text-xs text-white'>
								{suggestion.validation.rule}
							</div>
							<div className='text-xs text-gray-400'>
								{suggestion.validation.message}
							</div>
						</div>
					)}

					{suggestion.grouping && (
						<div className='bg-gray-800 rounded p-2 mb-2'>
							<div className='text-xs text-gray-300 mb-1'>Grouping:</div>
							<div className='text-xs text-white'>
								{suggestion.grouping.groupName}
							</div>
							<div className='text-xs text-gray-400'>
								{suggestion.grouping.reason}
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-col items-end gap-1'>
					<div
						className={`w-3 h-3 rounded-full ${getConfidenceColor(
							suggestion.confidence
						)}`}
					/>
					<i
						className={`${getImpactIcon(suggestion.impact)} ${getImpactColor(
							suggestion.impact
						)} text-xs`}
					/>
				</div>
			</div>

			<div className='flex justify-end mt-3'>
				<Button
					label='Apply'
					icon='pi pi-check'
					size='small'
					className='p-button-sm p-button-outlined'
					onClick={e => {
						e.stopPropagation()
						onSelect(suggestion)
					}}
				/>
			</div>
		</Card>
	)
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({
	onSuggestionSelect,
	context,
	className = '',
}) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [fieldSuggestions, setFieldSuggestions] = useState<FieldSuggestion[]>(
		[]
	)
	const [optimizationSuggestions, setOptimizationSuggestions] = useState<
		OptimizationSuggestion[]
	>([])

	const loadSuggestions = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			// Get field suggestions
			const fieldResult = await FieldMCP.suggestNextFields(
				context.fields,
				context
			)
			if (fieldResult.success && fieldResult.data) {
				setFieldSuggestions(fieldResult.data)
			}

			// Get optimization suggestions if we have a form
			if (context.fields.length > 0) {
				const mockForm = {
					id: 'temp-form',
					userId: 'current-user',
					title: 'Current Form',
					description: '',
					fields: context.fields,
					createdAt: new Date(),
					updatedAt: new Date(),
				}

				const optimizationResult =
					await FormAssistanceMCP.suggestFormOptimizations(mockForm)
				if (optimizationResult.success && optimizationResult.data) {
					setOptimizationSuggestions(optimizationResult.data)
				}
			}
		} catch (err) {
			console.error('Error loading suggestions:', err)
			setError('Failed to load suggestions')
		} finally {
			setLoading(false)
		}
	}, [context])

	useEffect(() => {
		loadSuggestions()
	}, [context.fields, context.purpose, loadSuggestions])

	const handleSuggestionSelect = (suggestion: FieldSuggestion) => {
		console.log('Suggestion selected:', suggestion)
		onSuggestionSelect(suggestion)
	}

	// const getSuggestionTypeIcon = (type: string) => {
	// 	switch (type) {
	// 		case 'field': return 'pi pi-plus-circle'
	// 		case 'validation': return 'pi pi-check-circle'
	// 		case 'grouping': return 'pi pi-sitemap'
	// 		case 'placement': return 'pi pi-sort'
	// 		default: return 'pi pi-lightbulb'
	// 	}
	// }

	// const getSuggestionTypeColor = (type: string) => {
	// 	switch (type) {
	// 		case 'field': return 'text-blue-500'
	// 		case 'validation': return 'text-green-500'
	// 		case 'grouping': return 'text-purple-500'
	// 		case 'placement': return 'text-orange-500'
	// 		default: return 'text-gray-500'
	// 	}
	// }

	if (loading) {
		return (
			<Card className={`smart-suggestions-panel ${className}`}>
				<div className='flex items-center justify-center p-4'>
					<ProgressSpinner size='small' />
					<span className='ml-2 text-sm text-gray-400'>
						Loading suggestions...
					</span>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`smart-suggestions-panel ${className}`}>
			<div className='suggestions-header mb-4'>
				<div className='flex items-center justify-between mb-2'>
					<h5 className='text-white m-0 flex items-center gap-2'>
						<i className='pi pi-lightbulb text-yellow-500' />
						Smart Suggestions
					</h5>
					<Badge
						value={fieldSuggestions.length + optimizationSuggestions.length}
						severity='info'
						size='small'
					/>
				</div>
				<p className='text-sm text-gray-400 m-0'>
					AI-powered suggestions to improve your form
				</p>
			</div>

			{error && <Message severity='error' text={error} className='mb-4' />}

			{/* Field Suggestions */}
			{fieldSuggestions.length > 0 && (
				<div className='mb-4'>
					<div className='flex items-center gap-2 mb-3'>
						<i className='pi pi-plus-circle text-blue-500' />
						<h6 className='text-sm font-medium text-white m-0'>
							Field Suggestions
						</h6>
						<Badge
							value={fieldSuggestions.length}
							severity='info'
							size='small'
						/>
					</div>
					<div className='suggestions-list'>
						{fieldSuggestions.map((suggestion, index) => (
							<SuggestionCard
								key={`field-${index}`}
								suggestion={suggestion}
								onSelect={handleSuggestionSelect}
							/>
						))}
					</div>
				</div>
			)}

			{/* Optimization Suggestions */}
			{optimizationSuggestions.length > 0 && (
				<div className='mb-4'>
					<Divider />
					<div className='flex items-center gap-2 mb-3'>
						<i className='pi pi-cog text-orange-500' />
						<h6 className='text-sm font-medium text-white m-0'>
							Optimization Suggestions
						</h6>
						<Badge
							value={optimizationSuggestions.length}
							severity='warning'
							size='small'
						/>
					</div>
					<div className='optimization-suggestions'>
						{optimizationSuggestions.map((suggestion, index) => (
							<Card
								key={`optimization-${index}`}
								className='optimization-card mb-3'
							>
								<div className='flex items-start justify-between'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<h6 className='text-sm font-medium text-white m-0'>
												{suggestion.title}
											</h6>
											<Badge
												value={suggestion.impact}
												severity={
													suggestion.impact === 'high'
														? 'danger'
														: suggestion.impact === 'medium'
														? 'warning'
														: 'success'
												}
												size='small'
											/>
										</div>
										<p className='text-xs text-gray-400 mb-2'>
											{suggestion.description}
										</p>
										{suggestion.estimatedImprovement && (
											<div className='text-xs text-green-400'>
												<i className='pi pi-arrow-up mr-1' />
												{suggestion.estimatedImprovement}
											</div>
										)}
									</div>
									<div className='flex flex-col items-end gap-1'>
										<Badge
											value={suggestion.effort}
											severity={
												suggestion.effort === 'low'
													? 'success'
													: suggestion.effort === 'medium'
													? 'warning'
													: 'danger'
											}
											size='small'
										/>
									</div>
								</div>
								<div className='flex justify-end mt-3'>
									<Button
										label='Apply'
										icon='pi pi-check'
										size='small'
										className='p-button-sm p-button-outlined'
										onClick={() => {
											console.log(
												'Optimization suggestion applied:',
												suggestion
											)
											// Handle optimization application
										}}
									/>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* No Suggestions */}
			{fieldSuggestions.length === 0 &&
				optimizationSuggestions.length === 0 &&
				!loading && (
					<div className='text-center p-4'>
						<i className='pi pi-check-circle text-green-500 text-2xl mb-2' />
						<p className='text-sm text-gray-400 m-0'>
							Your form looks great! No suggestions at this time.
						</p>
					</div>
				)}

			{/* Refresh Button */}
			<div className='flex justify-end mt-4'>
				<Button
					label='Refresh'
					icon='pi pi-refresh'
					size='small'
					className='p-button-sm p-button-text'
					onClick={loadSuggestions}
					loading={loading}
				/>
			</div>
		</Card>
	)
}

export default SmartSuggestionsPanel
