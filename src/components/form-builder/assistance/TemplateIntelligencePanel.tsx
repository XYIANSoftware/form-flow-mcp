'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormField } from '@/types'
import {
	TemplateIntelligenceMCP,
	FormContext,
	TemplateMatch,
	TemplateSuggestion,
} from '@/lib/mcp'

interface TemplateIntelligencePanelProps {
	fields: FormField[]
	selectedField: FormField | null
	onTemplateSelect: (template: any) => void
	onSuggestionApply: (suggestion: TemplateSuggestion) => void
	className?: string
}

export default function TemplateIntelligencePanel({
	fields,
	selectedField,
	onTemplateSelect,
	onSuggestionApply,
	className = '',
}: TemplateIntelligencePanelProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [templateMatches, setTemplateMatches] = useState<TemplateMatch[]>([])
	const [templateSuggestions, setTemplateSuggestions] = useState<
		TemplateSuggestion[]
	>([])
	const [activeTab, setActiveTab] = useState(0)

	const templateMCP = new TemplateIntelligenceMCP()

	const analyzeTemplates = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const context: FormContext = {
				purpose: 'form creation',
				industry: 'general',
				audience: 'users',
				complexity:
					fields.length > 10
						? 'complex'
						: fields.length > 5
						? 'moderate'
						: 'simple',
				fields: fields.map(field => ({
					id: field.id,
					type: field.type,
					label: field.label,
					required: field.required || false,
					placeholder: field.placeholder,
					options: field.options,
				})),
				requirements: [],
			}

			// Find matching templates
			const matchResult = await templateMCP.findMatchingTemplates(context)
			if (matchResult.success) {
				setTemplateMatches(matchResult.data)
			}

			// Get template recommendations
			const suggestionResult = await templateMCP.getTemplateRecommendations(
				context.fields,
				context
			)
			if (suggestionResult.success) {
				setTemplateSuggestions(suggestionResult.data)
			}
		} catch (err) {
			setError('Failed to analyze templates')
			console.error('Template analysis error:', err)
		} finally {
			setLoading(false)
		}
	}, [fields, templateMCP])

	useEffect(() => {
		if (fields.length > 0) {
			analyzeTemplates()
		}
	}, [fields, analyzeTemplates])

	const handleTemplateSelect = (template: any) => {
		onTemplateSelect(template)
	}

	const handleSuggestionApply = (suggestion: TemplateSuggestion) => {
		onSuggestionApply(suggestion)
	}

	const getConfidenceColor = (confidence: string) => {
		switch (confidence) {
			case 'high':
				return 'success'
			case 'medium':
				return 'warning'
			case 'low':
				return 'info'
			default:
				return 'info'
		}
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'beginner':
				return 'success'
			case 'intermediate':
				return 'warning'
			case 'advanced':
				return 'danger'
			default:
				return 'info'
		}
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-lightbulb text-purple-400' />
						<h3 className='text-sm font-medium text-white'>
							Template Intelligence
						</h3>
					</div>
					<Button
						icon='pi pi-refresh'
						className='p-button-text p-button-sm'
						onClick={analyzeTemplates}
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
							Analyzing templates...
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
						className='template-intelligence-tabs'
					>
						<TabPanel header='Matching Templates' leftIcon='pi pi-search'>
							<div className='p-4 space-y-4'>
								{templateMatches.length === 0 ? (
									<div className='text-center py-8 text-gray-400'>
										<i className='pi pi-search text-2xl mb-2' />
										<div>No matching templates found</div>
										<div className='text-sm'>
											Try adding more fields to get better matches
										</div>
									</div>
								) : (
									templateMatches.map((match, index) => (
										<TemplateMatchCard
											key={match.template.id}
											match={match}
											onSelect={() => handleTemplateSelect(match.template)}
										/>
									))
								)}
							</div>
						</TabPanel>

						<TabPanel header='Suggestions' leftIcon='pi pi-lightbulb'>
							<div className='p-4 space-y-4'>
								{templateSuggestions.length === 0 ? (
									<div className='text-center py-8 text-gray-400'>
										<i className='pi pi-lightbulb text-2xl mb-2' />
										<div>No suggestions available</div>
										<div className='text-sm'>
											Add more fields to get personalized suggestions
										</div>
									</div>
								) : (
									templateSuggestions.map((suggestion, index) => (
										<TemplateSuggestionCard
											key={`${suggestion.template.id}-${index}`}
											suggestion={suggestion}
											onApply={() => handleSuggestionApply(suggestion)}
										/>
									))
								)}
							</div>
						</TabPanel>

						<TabPanel header='Custom Template' leftIcon='pi pi-plus'>
							<div className='p-4'>
								<div className='text-center py-8 text-gray-400'>
									<i className='pi pi-plus text-2xl mb-2' />
									<div>Generate Custom Template</div>
									<div className='text-sm'>
										Create a template based on your current form
									</div>
									<Button
										label='Generate Template'
										className='mt-4'
										onClick={() => {
											// TODO: Implement custom template generation
											console.log('Generate custom template')
										}}
									/>
								</div>
							</div>
						</TabPanel>
					</TabView>
				)}
			</div>
		</Card>
	)
}

interface TemplateMatchCardProps {
	match: TemplateMatch
	onSelect: () => void
}

function TemplateMatchCard({ match, onSelect }: TemplateMatchCardProps) {
	const { template, score, reasons, confidence } = match

	return (
		<Card className='mb-3'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div className='flex-1'>
						<div className='flex items-center gap-2 mb-2'>
							<h4 className='text-sm font-medium text-white'>
								{template.name}
							</h4>
							<Badge
								value={Math.round(score * 100)}
								severity={getConfidenceColor(confidence)}
								size='small'
							/>
						</div>
						<p className='text-xs text-gray-400 mb-2'>{template.description}</p>
						<div className='flex items-center gap-2 mb-2'>
							<Badge
								value={template.difficulty}
								severity={getDifficultyColor(template.difficulty)}
								size='small'
							/>
							<span className='text-xs text-gray-500'>
								{template.estimatedCompletionTime} min
							</span>
							<span className='text-xs text-gray-500'>
								{template.fields.length} fields
							</span>
						</div>
					</div>
					<Button
						label='Use Template'
						className='p-button-sm'
						onClick={onSelect}
					/>
				</div>

				<div className='space-y-1'>
					{reasons.map((reason, index) => (
						<div
							key={index}
							className='flex items-center gap-2 text-xs text-gray-300'
						>
							<i className='pi pi-check text-green-400' />
							{reason}
						</div>
					))}
				</div>

				<div className='mt-3 pt-3 border-t border-gray-600'>
					<div className='flex items-center justify-between text-xs text-gray-500'>
						<span>Match Score: {Math.round(score * 100)}%</span>
						<span>Confidence: {confidence}</span>
					</div>
				</div>
			</div>
		</Card>
	)
}

interface TemplateSuggestionCardProps {
	suggestion: TemplateSuggestion
	onApply: () => void
}

function TemplateSuggestionCard({
	suggestion,
	onApply,
}: TemplateSuggestionCardProps) {
	const { template, reason, modifications } = suggestion

	return (
		<Card className='mb-3'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div className='flex-1'>
						<h4 className='text-sm font-medium text-white mb-1'>
							{template.name}
						</h4>
						<p className='text-xs text-gray-400 mb-2'>{reason}</p>
					</div>
					<Button label='Apply' className='p-button-sm' onClick={onApply} />
				</div>

				<div className='space-y-2'>
					{modifications.map((mod, index) => (
						<div
							key={index}
							className='flex items-center gap-2 text-xs text-gray-300'
						>
							<i
								className={`pi pi-${getModificationIcon(
									mod.type
								)} text-purple-400`}
							/>
							<span>{mod.description}</span>
							<Badge
								value={mod.impact}
								severity={getImpactColor(mod.impact)}
								size='small'
							/>
						</div>
					))}
				</div>
			</div>
		</Card>
	)
}

function getConfidenceColor(confidence: string) {
	switch (confidence) {
		case 'high':
			return 'success'
		case 'medium':
			return 'warning'
		case 'low':
			return 'info'
		default:
			return 'info'
	}
}

function getDifficultyColor(difficulty: string) {
	switch (difficulty) {
		case 'beginner':
			return 'success'
		case 'intermediate':
			return 'warning'
		case 'advanced':
			return 'danger'
		default:
			return 'info'
	}
}

function getModificationIcon(type: string) {
	switch (type) {
		case 'add_field':
			return 'plus'
		case 'remove_field':
			return 'minus'
		case 'modify_field':
			return 'edit'
		case 'change_layout':
			return 'layout'
		default:
			return 'cog'
	}
}

function getImpactColor(impact: string) {
	switch (impact) {
		case 'high':
			return 'danger'
		case 'medium':
			return 'warning'
		case 'low':
			return 'success'
		default:
			return 'info'
	}
}
